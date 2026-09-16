# Backend (Agency API)

Production-grade App Router backend for the luxury real estate platform.

## Stack
- Next.js Route Handlers (`src/app/api/**`)
- Drizzle ORM + LibSQL/SQLite (`data/agency.db`)
- Zod validation
- Jose HS256 HttpOnly JWT sessions
- bcrypt password hashing
- Rate limiting + activity audit log
- Soft-delete + optimistic locking on properties

## Quick start
```bash
cp .env.example .env.local
npm run db:seed
npm run dev
```

Health: `GET /api/health`

## Auth
| Role | Identifier | Secret |
|------|------------|--------|
| Admin | `admin@derakhshan.pro` | `123456` |
| Agent | `agent@derakhshan.pro` | `123456` |
| Client | any mobile | OTP `1234` |

Cookie: `agency_auth` (HttpOnly, signed JWT)

## API map
| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/login` | public |
| POST | `/api/auth/logout` | public |
| GET | `/api/auth/me` | session |
| POST | `/api/auth/otp` | public |
| POST | `/api/auth/onboarding` | client |
| GET/POST | `/api/properties` | admin/agent |
| GET/PATCH/DELETE | `/api/properties/:id` | admin/agent (+ public GET) |
| GET/POST | `/api/leads` | admin/agent |
| PATCH | `/api/leads/:id` | admin/agent |
| GET | `/api/agents` | admin/agent |
| GET/POST | `/api/clients` | admin/agent |
| GET/POST/PATCH | `/api/tours` | admin/agent |
| POST | `/api/contact` | public |
| GET | `/api/stats` | admin/agent |
| GET | `/api/health` | public |

## Layout
```
src/server/
  db/          schema, client, migrate
  auth/        session, password, rate-limit
  services/    properties, crm
  http/        guard, response
  validation/  zod schemas
src/app/api/   route handlers
src/scripts/   seed.ts
```

## Production notes
- Set a strong `AUTH_SECRET`
- Point `DATABASE_URL` to Turso/LibSQL (or migrate to Cloudflare D1)
- Replace demo OTP with an SMS provider in `/api/auth/otp`
