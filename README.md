# Derakhshan Pro — RIO Property

Production rebuild of [RIO Property](https://www.rioproperty.co.za/) from forensic extraction in `website-forensics/rioproperty/`.

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 3
- TypeScript
- **Backend:** Drizzle ORM + LibSQL/SQLite, Zod, Jose JWT, bcrypt

## Commands

```bash
npm install
cp .env.example .env.local
npm run db:seed
npm run dev
npm run build
```

## Backend

See [`docs/BACKEND.md`](docs/BACKEND.md) for the Agency API (auth, properties, leads, CRM, contact, stats).

Quick health check: `GET /api/health`

## Source of truth

Brand copy lives in `src/config/siteConfig.ts`. Visual tokens and layout are derived from `website-forensics/rioproperty/`.
