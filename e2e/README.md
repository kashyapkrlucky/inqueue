# E2E tests

Run with `npm run test:e2e` (or `npm run test:e2e:ui` for the interactive runner).

These specs drive the real app through a real browser — routing, the Zustand
stores, the actual rendered DOM — but stub the auth server (atlas-id, :3000)
and api server (atlas-apps, :3001) at the network boundary with
`page.route()` (see `mockBackend.ts`), instead of requiring those services to
be running.

That's a deliberate trade-off, not an oversight:

- CI runners have no way to reach `localhost:3000`/`:3001`, so a spec that
  depended on the real backend simply couldn't run there.
- It keeps the suite fast and deterministic — no shared dev database state
  leaking between runs.
- The cost: these specs don't verify the real request/response contract with
  atlas-id/atlas-apps. If either backend's API shape changes, these tests
  won't catch it.

If/when a real backend becomes available in CI (e.g. via docker-compose or a
staging environment), add a second Playwright project that skips
`mockBackend()` and points `baseURL`/the backend URLs at that environment,
so both a fast mocked suite and a slower full-stack contract suite exist
side by side.
