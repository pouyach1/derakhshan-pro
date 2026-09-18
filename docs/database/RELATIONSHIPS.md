# Relationships (Phase A)

## Live document relationships

```
users (role=agent) ── agentId ──► used by properties.agentId
                               └► clients.agentId
                               └► tours.agentId
                               └► leads.assignedAgentId

properties ──◄── leads.propertyId
           ──◄── tours.propertyId

users (role=client) may hold clientProfile (embedded JSON)
```

Notes:

- There is **no** `agencies` foreign key in the live JSON yet (single-tenant implied).
- Property images are **not** a separate collection; they are `properties.gallery[]`.
- Marketing portfolio items in `siteConfig.properties` are **not** the same as CRM `properties` or future `deals`.

## Target relationships (after Phase B+, not applied)

```
agencies 1 ─── * users
agencies 1 ─── * properties
properties 1 ─── * property_images
properties 1 ─── * leads
properties 1 ─── * tours
properties 1 ─── * deals
users 1 ─── * notifications
users (agent) 1 ─── * clients
```

## Integrity rules (logical)

- Soft-deleted properties should not appear in public listings.
- Agent-scoped queries must filter by `agentId` / `assignedAgentId`.
- Do not duplicate brand phone/email into every row; prefer `settings` + `siteConfig`.
