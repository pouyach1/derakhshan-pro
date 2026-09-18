# Backup & restore (JSON store)

## What to back up

Primary file on Node:

```
data/agency.json
```

This file contains users, properties, leads, clients, tours, contacts, activity, and optional settings.

## Manual backup

```bash
cp data/agency.json "data/backups/agency-$(date +%Y%m%d-%H%M%S).json"
```

Keep backups **outside** git (or in a private encrypted store).

## Restore

1. Stop the running app process if needed.
2. Replace `data/agency.json` with the backup file.
3. Restart `npm run dev` / the Worker.

## Cloudflare note

On Workers, the in-memory isolate is **not durable** across cold starts. Phase A does not add D1/KV. For production durability, plan a later adapter swap (not part of Phase A).

## Seed reset warning

`npm run db:seed` calls `resetStore` and **replaces** the document with demo data. Back up first if you have real entries.
