# Derakhshan Pro — Testing Guide

## Architecture

| Layer | Tool | Location | Purpose |
|-------|------|----------|---------|
| Unit | Vitest | `tests/unit` | Pure invariants (ownership gates, helpers) |
| Integration / API | Vitest | `tests/integration` | Route handlers + store isolation |
| Component | Vitest + Testing Library | `tests/component` | Keyboard/a11y behavior of shared UI |
| E2E | Playwright | `e2e` | Public journeys, role matrix, authenticated CRM/blog/chat, gallery lightbox, SEO |
| Coverage | Vitest V8 | `coverage/` | Critical server/API/UI measurement |

Security and CRM ownership are tested **server-side** via App Router handlers — not by mocking authorization away.

## Isolation

- Vitest sets `AGENCY_STORE_PATH` to an OS temp file (never `data/agency.json`).
- Playwright uses `.tmp/agency-e2e.json`, seeded by `e2e/global-setup.ts` → `e2e/seed.ts`.
- Store helper `buildIsolationFixture()` builds Agent A vs Agent B (+ clients, leads, deals, tours, blogs, chat).
- Property A fixture includes a multi-image gallery for lightbox E2E.
- No Cloudflare production, no real WhatsApp/Maps/Aparat/SMS for ordinary test runs.
- Auth uses `AUTH_SECRET` from env (local test default only).

## Commands

```bash
npm test                 # Vitest unit + integration + component
npm run test:unit
npm run test:integration
npm run test:component
npm run test:coverage
npm run test:e2e:install # chromium (+ headless shell if needed)
npm run test:e2e         # Playwright (seeds store, starts next dev on :3010)
npm run test:all         # coverage + e2e
npm run test:watch
```

## Factories

`tests/factories` — `createAdminUser`, `createAgentUser`, `createClientUser`, `createProperty`, `createClientRecord`, `createLead`, `createDeal`, `createTour`, `createBlogPost`, `createChatThread`, `createChatMessage`.

`tests/helpers/store.ts` — `buildIsolationFixture()`, `authCookieFor(user)`, `resetTestStore()`.

`e2e/helpers/auth.ts` — `loginAs(context, session)` cookie injection for role E2E (HttpOnly JWT, same secret as the app).

## Security philosophy

Protect business invariants with failing assertions named after the rule:

- Agent A must not access Client/Property/Deal/Tour/Blog/Lead B
- Query `?agentId=` cannot widen session scope
- Draft posts must not appear publicly or in sitemap
- Guest prices stay gated
- Client session mirror must not forge `agency_auth` JWT cookies
- Uploads require staff roles; property image replace is ownership-scoped
- Middleware role gates redirect anonymous / wrong-role panel access

## Adding a test

1. Prefer behavior (status codes, visible outcomes, ownership deny) over internals.
2. Reuse factories/fixtures; do not hard-code production phones/emails.
3. Put API/security in `tests/integration`, UI a11y in `tests/component`, journeys in `e2e/`.
4. Name asserts after the business rule (“Agent A must not update Tour B”).
5. For public draft checks after an authenticated journey, use Playwright’s cookie-less `request` fixture — `page.request` still sends the staff session and can hit preview mode.

## Troubleshooting

- **Stale store:** delete `.tmp/agency-e2e.json` / `.tmp/e2e-meta.json` and the OS temp vitest folder.
- **E2E auth:** seed runs in globalSetup; cookie secret must match `AUTH_SECRET` in `playwright.config.ts`.
- **Playwright browsers:** `npm run test:e2e:install`. Config falls back to full Chromium if headless_shell is missing.
- **Blog editor status after publish:** `revalidateBlogPaths` must invalidate `/admin/blog/[id]` and `/agent/blog/[id]` as well as list routes.
- **Coverage gaps:** prioritize `src/server/**` and `src/app/api/**` over decorative UI — do not invent empty tests to hit %.
