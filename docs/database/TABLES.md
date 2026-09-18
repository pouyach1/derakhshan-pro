# Tables / collections (Phase A)

Phase A uses TypeScript record types. The live document is a single JSON object with arrays (collections), not SQL tables.

## Live collections (`AgencyStore`)

### users
Account rows for `admin` | `agent` | `client`.  
Sensitive field: `passwordHash` (bcrypt). Raw passwords must never be stored here.

### properties
Listing rows. Includes embedded `imageUrl` + `gallery: string[]`, soft-delete, optimistic `version`.

### leads
Inbound interest from website / inquiries. May reference `propertyId`.

### clients
CRM clients scoped by `agentId`.

### tours
Scheduled viewings scoped by `agentId` + `propertyId`.

### contacts
Public contact / newsletter submissions.

### activity
Append-only audit trail (not end-user notifications).

### settings (optional object)
Operational overrides from the admin settings panel. Brand marketing copy stays in `siteConfig`.

## Planned collections (schema only — not in JSON yet)

### agencies
Root tenant for multi-office / white-label installs.

### property_images
Normalized gallery rows linked by `propertyId`.

### deals
Closed or in-progress transactions (distinct from marketing “done deals” in `siteConfig`).

### notifications
User-facing alerts (email/sms/in-app), separate from `activity`.

## Source files

Canonical TypeScript models live under:

`src/server/database/schema/<domain>/`
