# Parspack / Node PaaS — بدون Wrangler

## چرا `npm install` به Wrangler می‌خورد؟

`wrangler` و `@opennextjs/cloudflare` برای مسیر **Cloudflare/OpenNext** لازم‌اند، نه برای اجرای استاندارد Next.js روی Node.

قبلاً این پکیج‌ها در `devDependencies` بودند. بیشتر PaaSها (از جمله Parspack) هنگام build با `npm install` / `npm ci` **بدون** `--omit=dev` همهٔ devDependencyها را هم نصب می‌کنند؛ در نتیجه دانلود `wrangler-*.tgz` اجباری می‌شد و خطای رجیستری `500` کل نصب را می‌خواباند.

## راه‌حل در این مخزن

| پکیج | محل در `package.json` |
|------|------------------------|
| `next`, `react`, … | `dependencies` (runtime) |
| `typescript`, `tailwindcss`, … | `devDependencies` (build Node) |
| `@opennextjs/cloudflare`, `wrangler` | **`optionalDependencies`** (فقط Cloudflare) |

- با `npm ci --omit=optional` (یا `npm run ci:node`) این دو پکیج **اصلاً دانلود نمی‌شوند**.
- اگر رجیستری روی optional شکست بخورد، npm نصب را متوقف نمی‌کند (برخلاف dependency اجباری).
- مسیر Cloudflare با `npm run ci:cf` / `npm ci` کامل و سپس `npm run build` / `deploy` مثل قبل کار می‌کند.
- `wrangler.jsonc`، اسکریپت‌های `build`/`deploy`/`preview` و OpenNext حذف نشده‌اند.

## دستورات Parspack

```bash
# Install command (در تنظیمات PaaS این را بگذارید)
npm ci --omit=optional
# معادل: npm run ci:node

# Build command
npm run build:node

# Start command
node server.cjs
# یا: npm run start:node
```

### اگر رجیستری پارس‌هاب روی یک پکیج `500` داد

مثال واقعی: `nanoid-6.0.1.tgz` → `npm error E500`.

این خطا از کد پروژه نیست؛ آینهٔ npm هاست (`-/repository/npm/`) occasionally پکیج‌ها را با 500 برمی‌گرداند.

کارهایی که در مخزن انجام شده:
- Cloudflare tooling اختیاری است (`--omit=optional`)
- وابستگی `nanoid` حذف و با `src/lib/id.ts` جایگزین شده تا آن tarball لازم نباشد

اگر پکیج دیگری `500` داد:
1. یک‌بار **Rebuild** بزنید (گاهی موقتی است)
2. Install command را روی `npm ci --omit=optional` نگه دارید
3. اگر همان پکیج تکرار شد، بگویید تا جایگزین/پین شود

Environment (الزامی):

- `NODE_ENV=production`
- `AUTH_SECRET` (≥ ۳۲ کاراکتر)
- `SEED_ADMIN_PASSWORD` (≥ ۸ کاراکتر)
- `PORT` (معمولاً توسط PaaS)

Health:

```bash
HEALTHCHECK_URL=https://vorqen.ir/api/health npm run healthcheck
```

جزئیات بیشتر Node host: [`CPANEL_DEPLOY.md`](./CPANEL_DEPLOY.md)
