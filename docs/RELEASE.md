# Release readiness — Phase 10 freeze

**Status:** FROZEN for the intended Node / cPanel production deployment model.

**Verdict:** GO WITH OPERATIONAL LIMITATIONS

**Audit date:** 2026-10-03  
**Baseline:** Phases 1–9 on `main` (through Phase 9 reliability `#140`)

## Intended production deployment

- **Primary:** Node / cPanel (`build:node` / `server.cjs` / single process)
- **Not intended for durable CRM:** Cloudflare Workers / OpenNext isolates (marketing/demo only)

## Validation snapshot (freeze audit)

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS |
| `npm test` | PASS (110) |
| `npx playwright test` | PASS (25) |
| Role/a11y E2E re-run | PASS (6) |
| `npx next build` | PASS |
| `npm run build` (OpenNext) | PASS |
| `npm run lint` | Not configured (interactive Next lint prompt) — informational |

## Operational limitations (explicit)

1. Single-process Node file store — do not run multiple writers against one `agency.json`.
2. Off-box backups of `data/agency.json` + `public/uploads` are operator responsibility.
3. Cloudflare CRM persistence is memory-only; uploads unavailable there.
4. Leave `NEXT_PUBLIC_DEMO_*` empty on customer deploys.
5. Production empty-store seed requires `ALLOW_PRODUCTION_SEED=1`; destructive seed requires `FORCE_SEED=1`.

## Deploy checklist

1. Set strong `AUTH_SECRET` (≥32, not placeholder).
2. Set `SEED_ADMIN_PASSWORD` (≥8) for bootstrap/staff recovery.
3. Leave demo public env vars empty unless intentionally showcasing.
4. Ensure `data/` and `public/uploads/` are writable by the Node process.
5. Schedule off-box backups.
6. Confirm one Node process (or sticky single writer).
7. Run `GET /api/health` — expect `status: healthy`, `persistence.corrupt: false`.
8. Do not point Cloudflare at this stack expecting durable CRM.

## Post-release work

Belongs on a separate roadmap (P2/P3): multi-instance DB adapter, Cloudflare durable backend, upload GC, admin client `agentId` default cleanup, ESLint CLI migration.

## Freeze rule

No further feature work belongs in this release track. Future changes require a new phase/roadmap.
