# Backend (Agency API)

Production-minded App Router backend for the luxury real estate platform.

## Stack
- Next.js Route Handlers (`src/app/api/**`)
- Edge-safe JSON store (`data/agency.json` on Node; in-memory on Workers)
- Zod validation
- Jose HS256 HttpOnly JWT sessions
- bcryptjs password hashing
- Rate limiting + activity audit log
- Soft-delete + optimistic locking on properties

## Quick start
```bash
cp .env.example .env.local
# AUTH_SECRET (required in production), SEED_ADMIN_PASSWORD (for seed), optional DEMO_OTP
npm run db:seed
npm run dev
```

Health: `GET /api/health`

## Auth
| Role | Identifier | Secret |
|------|------------|--------|
| Admin | `siteConfig.panels.demoAdminEmail` | `SEED_ADMIN_PASSWORD` (from seed) |
| Agent | `siteConfig.panels.demoAgentEmail` | same seed password |
| Client | any mobile | `DEMO_OTP` when configured |

Cookie: `agency_auth` (HttpOnly, signed JWT). Production rejects weak/missing `AUTH_SECRET`.

## API map
| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/login` | public |
| POST | `/api/auth/logout` | public |
| GET | `/api/auth/me` | session |
| POST | `/api/auth/otp` | public |
| POST | `/api/auth/onboarding` | client |
| GET | `/api/properties` | public (منتشرشده) / admin/agent |
| POST | `/api/properties` | admin/agent |
| GET | `/api/properties/:id` | public (منتشر/واگذار) / staff |
| POST | `/api/inquiries` | public |
| GET/PATCH | `/api/settings` | admin |
| GET/POST | `/api/leads` | admin/agent |
| PATCH | `/api/leads/:id` | admin/agent |
| GET | `/api/agents` | admin/agent |
| GET/POST | `/api/clients` | admin/agent |
| PATCH | `/api/clients/:id` | admin/agent |
| GET/POST/PATCH | `/api/tours` | admin/agent |
| POST | `/api/contact` | public |
| GET | `/api/stats` | admin/agent |
| GET | `/api/deals` | public (closed cards) / admin/agent (full) |
| POST | `/api/deals` | admin/agent |
| GET | `/api/health` | public |

## Layout
```
src/server/
  database/       Phase A architecture (schema, adapter, seed, queries, migrations registry)
  db/store.ts     edge-safe JSON persistence (physical I/O)
  auth/           session, password, rate-limit
  services/       properties, crm
  http/           guard, response
  validation/     zod schemas
src/app/api/      route handlers
src/scripts/      seed.ts
docs/database/    database architecture docs
```

See also: [`docs/database/DATABASE_OVERVIEW.md`](./database/DATABASE_OVERVIEW.md).

## Cloudflare note
Native SQLite/libSQL clients break Workers bundling. This backend uses a pure TypeScript JSON store so OpenNext Cloudflare builds succeed. For multi-isolate durable storage later, swap the store adapter to D1/KV/Turso without changing route contracts.
