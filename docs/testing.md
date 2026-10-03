# Derakhshan Pro — Testing Guide

## Architecture

| Layer | Tool | Location | Purpose |
|-------|------|----------|---------|
| Unit | Vitest | `tests/unit` | Pure invariants (ownership gates, helpers) |
| Integration / API | Vitest | `tests/integration` | Route handlers + store isolation |
| Component | Vitest + Testing Library | `tests/component` | Keyboard/a11y behavior of shared UI |
| E2E | Playwright | `e2e` | Public journeys, role gates, SEO endpoints |
| Coverage | Vitest V8 | `coverage/` | Critical server/API/UI measurement |

Security and CRM ownership are tested **server-side** via App Router handlers — not by mocking authorization away.

## Isolation

- Tests set `AGENCY_STORE_PATH` to a temp file (never `data/agency.json`).
- Store helper `resetStore` / `buildIsolationFixture()` builds Agent A vs Agent B fixtures.
- No Cloudflare production, no real WhatsApp/Maps/Aparat calls required for the Vitest suite.
- Auth uses `AUTH_SECRET` from env (test default is local-only).

## Commands

```bash
npm test                 # Vitest unit + integration + component
npm run test:unit
npm run test:integration
npm run test:component
npm run test:coverage
npm run test:e2e:install # chromium once
npm run test:e2e         # Playwright (starts local next dev on :3010)
npm run test:all         # coverage + e2e
```

## Factories

`tests/factories` — `createAgentUser`, `createProperty`, `createClientRecord`, `createLead`, `createDeal`, `createTour`, `createBlogPost`, `createChatThread`, …

`tests/helpers/store.ts` — `buildIsolationFixture()`, `authCookieFor(user)`.

## Security philosophy

Protect business invariants with failing assertions named after the rule:

- Agent A must not access Client/Property/Deal/Tour/Blog B
- Draft posts must not appear publicly or in sitemap
- Guest prices stay gated
- Session `agentId` wins over query/body spoofing

## Troubleshooting

- **Stale store:** delete `.tmp/agency-e2e.json` and the OS temp vitest folder.
- **E2E login redirects:** ensure seed password env matches (`SEED_ADMIN_PASSWORD`).
- **Playwright browsers:** `npm run test:e2e:install`.
- **Coverage gaps:** prioritize `src/server/**` and `src/app/api/**` over decorative UI.
