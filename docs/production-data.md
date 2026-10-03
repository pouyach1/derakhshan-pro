# Production data persistence — architecture, guarantees, and operations

Describes the **actual** implementation in this repository.
Do not treat this as a promise of D1/Postgres durability.

## Architecture

```text
HTTP Route Handler / Server Action
  → Service (crm / properties / blog / chat / …)
    → getStore() / saveStore() / resetStore()
      → Node: atomic JSON file (data/agency.json or AGENCY_STORE_PATH)
      → Cloudflare Workers: in-memory isolate only
```

Adapter boundary (future swap point, JSON today):

- `src/server/database/connection/adapter.ts`
- `src/server/database/connection/json-adapter.ts`
- Physical I/O: `src/server/db/store.ts`
- Domain shape: `src/server/database/schema/*`
- Bootstrap / seed: `src/server/db/bootstrap.ts`

Uploads are separate files under `public/uploads/{properties|blog}/…`
with URLs stored on records (not binary blobs in JSON).

## Storage modes

| Mode | Runtime | Durable across restart? |
|------|---------|-------------------------|
| `json-file` | Node / cPanel / `next start` | **Yes** (filesystem) |
| `memory` | Cloudflare Workers / OpenNext isolate | **No** — lost on cold start |

`GET /api/health` reports `persistence.mode` without filesystem paths.

## Node write guarantees (single process)

1. **Atomic replace** — write `.<basename>.<pid>.<ts>.tmp` in the same directory, then `rename` onto the target. A crash mid-write leaves the previous valid file intact.
2. **Failures throw** — `saveStore()` raises `PersistenceError` (`WRITE_FAILED`). Callers must not treat the mutation as durable if the call throws. API layer maps this to a 500 without leaking paths.
3. **Corrupt file fails closed** — malformed / empty JSON does **not** load as empty and does **not** get replaced by demo seed. Operators must restore from backup.
4. **Schema version** — `AgencyStore.schemaVersion` (currently `1`) is stamped on load/save. Missing version on older files is filled additively; no destructive rewrite.

### Not guaranteed

- Multiple Node processes writing the same file concurrently (last writer wins; can drop the other process’s in-memory mutations).
- Cross-machine / multi-region consistency.
- “Transactional” multi-document SQL semantics (there is one JSON document).

## Cloudflare / OpenNext

Workers have **no durable filesystem** for `data/agency.json` in this architecture.

- Uploads that require `fs` return `503 UPLOAD_UNAVAILABLE`.
- CRM/blog/chat state lives in isolate memory and is **not** production-durable.
- Phase 9 does **not** add D1, Durable Objects, R2, or Redis.

**Verdict for Cloudflare:** safe for static/marketing + ephemeral demos only. Durable production CRM requires a future durable adapter (see Deferred Architecture).

## Bootstrap / seed safety

| Situation | Behavior |
|-----------|----------|
| Truly empty store + seed password + non-production | Auto-seed demo document |
| Truly empty store + production | Seed **only** if `ALLOW_PRODUCTION_SEED=1` |
| Any existing users/properties/clients/… | **Never** `resetStore` from auto-bootstrap |
| Missing staff hashes on non-empty store | Repair staff rows only (`ensureStaffUsers`) |
| Corrupt JSON on disk | Throw `STORE_CORRUPT`; refuse seed wipe |
| `npm run db:seed` on non-empty store | Refuses unless `FORCE_SEED=1` |

Env related to persistence:

- `AGENCY_STORE_PATH` — override JSON path (tests / isolation)
- `SEED_ADMIN_PASSWORD` — required to seed staff
- `ALLOW_PRODUCTION_SEED=1` — explicit first-boot seed in production
- `FORCE_SEED=1` — explicit wipe via `db:seed`
- `AGENCY_STORE_BACKUP=1` — copy previous file into `<storeDir>/backups/` before each write
- `AGENCY_STORE_BACKUP_KEEP` — how many rotated backups to retain (default 5)

## Backup / recovery

### Application-level

- Optional write-time rotation via `AGENCY_STORE_BACKUP=1` (local copies only).
- Atomic write reduces corruption from crash-during-write.

### Operational responsibility (required for real production)

1. Schedule copies of `data/agency.json` (and `public/uploads/**`) off-box.
2. Test restore: stop app → replace file → restart.
3. Keep backups out of git.

See also `docs/database/BACKUP.md`.

### What “restore” means

| Action | Restores |
|--------|----------|
| Replace `agency.json` | CRM / users / blog / chat metadata |
| Restore `public/uploads` | Binary images referenced by URLs |
| Redeploy code | Application only — **not** data |
| Cloudflare cold start | **Does not** restore CRM state |

## Upload consistency

- Filenames are random hex (no user path segments) → traversal-safe.
- Bytes written via temp + rename (same directory).
- Metadata URLs are stored after a successful write in the upload handler.
- Orphan files (upload succeeded, later record deleted) and dangling URLs (file deleted manually) are **not** automatically reconciled in Phase 9 — operators should back up uploads with the JSON document.
- Property soft-delete does not delete files from disk (preserves recovery).

## Health

`GET /api/health` returns:

```json
{
  "status": "healthy|degraded",
  "persistence": {
    "mode": "json-file|memory",
    "readable": true,
    "writable": true,
    "initialized": true,
    "corrupt": false,
    "schemaVersion": 1,
    "empty": false
  }
}
```

No secrets, paths, tokens, or record bodies.

## Known limitations (honest)

1. Single-tenant JSON blob — grows with activity/chat; unbounded growth is an operational concern.
2. Multi-instance Node behind a load balancer sharing one file is **unsafe** without sticky single-writer or a real database.
3. Cloudflare persistence is memory-only.
4. No automated off-site backup — ops must configure it.
5. Upload↔record GC is manual/operational.

## What Phase 9 deliberately does NOT solve

- D1 / Durable Objects / Postgres / Redis / R2
- Distributed locking
- Multi-region replication
- Managed backup SaaS
- Full orphan-upload sweeper UI

## Future architecture (when durable Cloudflare or multi-instance is required)

1. Keep the `DatabaseAdapter` contract.
2. Introduce a durable backend (D1 or Postgres) behind the adapter.
3. Move uploads to object storage (R2/S3) with the same public URL contract if possible.
4. Migrate JSON → tables with an explicit, tested migration — never silent overwrite.
