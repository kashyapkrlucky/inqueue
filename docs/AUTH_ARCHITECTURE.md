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

Both flows return the user profile in the response body — but the **tokens
never touch the response body's usable half**. See below.

## Token strategy: httpOnly cookies, not localStorage

Both endpoints above (and the refresh endpoint) set the access and refresh
tokens as `httpOnly`, `SameSite=Lax` cookies via `Set-Cookie`, scoped to the
`localhost` host (or the real domain in production) — not to `inqueue`
specifically. Because cookie scoping is host-based, not origin-based, the
same cookies are sent automatically on requests to the api server on a
different port/subdomain, as long as it's the same host.

The frontend (`src/lib/axios.ts`) never reads or stores an access or refresh
token. Every request just sets `withCredentials: true` and lets the browser
attach the cookie. `useAuthStore` only persists the non-sensitive user
profile (name/avatar/etc.) to `localStorage`, purely so the UI can render an
optimistic "logged in" state on reload without waiting on a network
round-trip — the cookie, not that cached profile, is what actually gates any
real request.

**Why this matters:** a token sitting in `localStorage` is readable by any
script that runs on the page — meaning a single XSS bug anywhere in the app
(or in a dependency) can exfiltrate it. Client-side "encryption" of a
localStorage token doesn't fix this: any script that can read the encrypted
value can also reach the decryption routine sitting in the same bundle.
`httpOnly` cookies remove the token from JS-reachable memory entirely; the
worst an XSS bug can do is act as the logged-in user _while the page is
open_, not exfiltrate a credential that keeps working after the tab closes.

### Refresh

`axios.ts` installs a response interceptor on the api-server axios instance:
on a `401`, it calls `POST /v1/public/session/refresh` (no body — the
refresh cookie carries itself), and on success retries the original request.
Concurrent requests that 401 at the same time share a single in-flight
refresh via a small queue, so a burst of requests never triggers a burst of
refresh calls. If refresh itself fails, the store logs out and redirects to
`/login`.

`atlas-id`'s refresh endpoint rotates both tokens on every use and hashes the
refresh token before storing it, so a stolen refresh token stops working the
moment it's used once (either by the real client or an attacker) — reuse is
detectable and the session is revoked (`logoutReason: "security_breach"`).

### Logout

`logout()` POSTs to `/v1/public/logout`, which clears both cookies
server-side (the frontend can't clear an `httpOnly` cookie itself) and
revokes the session for that user+client pair specifically — not every
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
