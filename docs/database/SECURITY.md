# Security notes (database layer)

## Passwords

- Store only `passwordHash` (bcrypt via `src/server/auth/password.ts`).
- Never persist raw admin/agent passwords in `agency.json`.
- `src/config/auth.ts` still has demo plaintext for UI role hints only — not the persistence source of truth.

## Sessions

- JWT sessions use `AUTH_SECRET` (see `.env.example`).
- Session cookie is HttpOnly; database layer does not store session tokens.

## Tenancy

- Phase A is single-tenant (one JSON document).
- Future `agencyId` must be applied consistently before multi-office production use.
- Do not serve one office’s leads/clients to another office’s agents.

## Secrets in git

- `data/*.json` is gitignored.
- Do not commit seeded password hashes or customer PII.

## OTP

- `DEMO_OTP` is for development only. Production must replace with a real SMS provider; that is outside Phase A.
