# Migrations (Phase A)

This folder holds the **registry** for future schema migrations.

## Rules for Phase A

- No migration may mutate `data/agency.json`.
- `MIGRATIONS` in `registry.ts` stays empty until Phase B is approved.
- Do not add SQL engines or run automatic upgrades here.

## Planned (not executed)

1. Add optional `agencyId` to operational records (default single agency).
2. Extract `PropertyRecord.gallery[]` into `property_images`.
3. Introduce `deals` / `notifications` collections when product needs them.
