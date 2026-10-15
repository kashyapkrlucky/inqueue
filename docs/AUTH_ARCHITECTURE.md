# Auth architecture

This describes how authentication actually works in InQueue today, plus the
reasoning behind it. It used to be a forward-looking "plan" living in the
README; that plan has since been implemented (mostly) or superseded, so this
document now describes current state rather than a TODO list — see
[History](#history) at the bottom for what changed.

InQueue itself doesn't implement auth — it's a client of **atlas-id**, a
separate centralized auth service. This doc covers the InQueue side of that
integration: how the frontend talks to atlas-id, and how it keeps a session
alive.

## Flows

**Guest login** — `POST /v1/public/guest` with a `clientId`. atlas-id creates
(or reuses) a guest user and a session scoped to this client, and responds
with the user profile. No credentials involved.

**Atlas SSO login** — the app redirects to atlas-id's own login page
(`{VITE_AUTH_URL}/login?client_id=...`). After the user authenticates there,
atlas-id redirects back with an authorization code in the URL, which the app
exchanges via `POST /v1/public/session`.

Both flows return the user profile **and** the access/refresh tokens in the
response body. atlas-id also sets them as cookies, but see below for why the
frontend can't rely on those.

## Token strategy: Bearer header (cookies as same-site fallback)

atlas-id sets its `httpOnly` cookies on **its own** domain. On localhost
everything shares one host, so the cookies reach atlas-apps too and cookie
auth "just works". In production the three apps live on different sites
(e.g. separate `*.vercel.app` subdomains, which are on the Public Suffix
List and so count as separate sites), so the browser never sends atlas-id's
cookies to atlas-apps — requests arrive unauthenticated.

So the frontend stores the tokens itself (`src/shared/utils` →
`setAuthTokens`) and:

- sends `Authorization: Bearer <access_token>` on every request
  (`src/lib/axios.ts`). atlas-apps and atlas-id both check that header first
  and only fall back to their cookie;
- sends `{ refresh_token }` in the body of `POST /v1/public/session/refresh`,
  which atlas-id also accepts in place of its cookie.

`withCredentials: true` stays on, so same-site setups still get the cookie
as a fallback.

**Trade-off:** tokens in `localStorage` are readable by any script on the
page, so an XSS bug could exfiltrate them. Refresh-token rotation (below)
limits how long a stolen refresh token stays useful. The alternative that
keeps `httpOnly` cookies is to serve all three apps from subdomains of one
custom domain (e.g. `app.example.com`, `id.example.com`,
`api.example.com`) and have atlas-id set the cookie with
`Domain=.example.com`.

### Refresh

`axios.ts` installs a response interceptor on the api-server axios instance:
on a `401`, it calls `POST /v1/public/session/refresh` with the stored
refresh token, stores the rotated pair, and retries the original request
with the new access token. Concurrent requests that 401 at the same time
share a single in-flight refresh via a small queue, so a burst of requests
never triggers a burst of refresh calls. If refresh itself fails, the store
logs out and redirects to `/login`.

`atlas-id`'s refresh endpoint rotates both tokens on every use and hashes the
refresh token before storing it, so a stolen refresh token stops working the
moment it's used once (either by the real client or an attacker) — reuse is
detectable and the session is revoked (`logoutReason: "security_breach"`).

### Logout

`logout()` POSTs to `/v1/public/logout` with the Bearer token, clears the
locally stored tokens, and atlas-id clears its cookies and revokes the session for that user+client pair specifically — not every
session the user has across every Atlas-connected app.

## State management

`useAuthStore` (Zustand) is the single source of truth for auth state —
there's no separate `useAuth` hook or `AuthContext` layered on top. Given the
store already exposes plain functions and reactive state via a hook, an
additional context provider would only add indirection without adding
capability.

## What's still open

- **CSRF**: `SameSite=Lax` already blocks the classic cross-site
  form-submission CSRF pattern (the cookie isn't sent on cross-site
  non-navigation requests), but a dedicated CSRF token would be defense in
  depth for state-changing requests specifically.
- **Rate limiting** on the auth endpoints (guest/session/refresh) — not
  implemented on the atlas-id side yet.
- **Audit logging** of auth events (login, logout, refresh, revocation) for
  later review.
- **Multi-tab sync** — logging out in one tab doesn't currently notify other
  open tabs (no `storage` event listener, since there's no longer a
  localStorage token to watch).

## History

The original version of this document was a migration plan written before
any of it existed: consolidate a duplicated `useAuth`/`useAuthStore` split,
move tokens off `localStorage`, add a refresh queue. All of that has since
landed — the duplicated hook was already gone before the token migration,
and the token migration itself moved auth to httpOnly cookies directly
(atlas-id, atlas-apps, and this repo all changed together) rather than the
originally-proposed "encrypt localStorage" fallback, since the encryption
approach doesn't actually stop XSS (see above).
