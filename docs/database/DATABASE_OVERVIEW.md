# Database overview (Phase A)

## Current persistence

Derakhshan Pro stores operational CRM data in an **edge-safe JSON document**:

- Node / local: `data/agency.json`
- Cloudflare Workers: in-memory isolate (seeded on demand)

There is **no SQL engine** installed in Phase A.

## Architecture layout

```
src/server/database/
  connection/     adapter contract + JSON adapter
  schema/         TypeScript domain models
  migrations/     registry only (empty until Phase B)
  seed/           seed entrypoints (wraps existing bootstrap)
  queries/        read helpers over the adapter
```

Legacy physical I/O remains in `src/server/db/store.ts` so existing imports keep working.

## Design goals

1. One logical place per domain (users, properties, leads, …).
2. Adapter boundary so JSON can later be replaced by D1/SQLite/Postgres.
3. No product behavior change in Phase A.
4. Multi-tenant (`agencies`) and normalized images/deals/notifications are **modeled** but not persisted yet.

## What is live vs planned

| Domain | In `agency.json` today | Schema folder |
|--------|------------------------|---------------|
| users | yes | yes |
| properties | yes (`gallery[]` embedded) | yes |
| property_images | no (planned) | yes |
| clients | yes | yes |
| leads | yes | yes |
| tours | yes | yes |
| contacts | yes | yes (support type) |
| activity | yes | yes |
| settings | optional object | yes |
| agencies | no (planned) | yes |
| deals | no (planned) | yes |
| notifications | no (planned) | yes |

## Related docs

- `TABLES.md` — field-level notes
- `RELATIONSHIPS.md` — how entities connect
- `SECURITY.md` — secrets and tenancy rules
- `BACKUP.md` — how to back up the JSON store
- `docs/BACKEND.md` — HTTP API map (unchanged)
