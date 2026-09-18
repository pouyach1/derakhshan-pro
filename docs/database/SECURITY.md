# Security notes (database layer)

## Passwords

- Store only `passwordHash` (bcrypt via `src/server/auth/password.ts`).
- Never persist raw admin/agent passwords in `agency.json`.
- Never ship a default password in source. Seeding requires `SEED_ADMIN_PASSWORD`.
- `src/config/auth.ts` only exposes role/email hints for the login UI — no secrets.

## Sessions

- JWT sessions require a strong `AUTH_SECRET` (min 32 chars) in production.
- Weak / missing secrets are rejected in production; development may warn and fall back.
- Session cookie is HttpOnly; database layer does not store session tokens.

## Tenancy

- Phase A is single-tenant (one JSON document).
- Future `agencyId` must be applied consistently before multi-office production use.
- Do not serve one office’s leads/clients to another office’s agents.

## Secrets in git

- `data/*.json` is gitignored.
- Do not commit seeded password hashes or customer PII.
- Keep real `AUTH_SECRET` / `SEED_ADMIN_PASSWORD` / `DEMO_OTP` in local env only.

## OTP

- Client OTP reads `DEMO_OTP` only when explicitly set.
- Production must replace this with a real SMS provider.
