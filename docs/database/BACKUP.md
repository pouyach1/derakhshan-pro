# Backup & restore (JSON store)

## What to back up

Primary file on Node:

```
data/agency.json
```

(or the path in `AGENCY_STORE_PATH`)

Also back up uploaded binaries:

```
public/uploads/
```

The JSON file contains users, properties, leads, clients, tours, deals, contacts, activity, blog posts, chat, and optional settings.

## Manual backup

```bash
mkdir -p data/backups
cp data/agency.json "data/backups/agency-$(date +%Y%m%d-%H%M%S).json"
```

Optional application-assisted rotation (same host only):

```bash
AGENCY_STORE_BACKUP=1 AGENCY_STORE_BACKUP_KEEP=10
```

Keep backups **outside** git (or in a private encrypted store). Off-box copies remain an operational requirement.

## Restore

1. Stop the running app process if needed.
2. Replace `data/agency.json` with the backup file.
3. Restore matching `public/uploads` if image URLs must resolve.
4. Restart `npm run start` / the Node process.

## Corrupt file behavior

If `agency.json` is malformed, the app **refuses to load or reseed** (`STORE_CORRUPT`). Restore from backup; do not run `db:seed` hoping to “fix” a corrupt production file.

## Seed reset warning

`npm run db:seed` **refuses** to wipe a non-empty store unless `FORCE_SEED=1`.
Always back up first if you have real entries.

## Cloudflare note

On Workers, the in-memory isolate is **not durable** across cold starts. Phase 9 does not add D1/KV. For production durability on Cloudflare, plan a later adapter swap — see `docs/production-data.md`.
