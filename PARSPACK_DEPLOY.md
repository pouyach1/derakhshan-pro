# Parspack / Node PaaS — بدون Wrangler

## چرا اعتبارسنجی وابستگی خطا می‌داد؟

پنل‌های Node ایرانی (مثل Parspack) معمولاً قبل از build، `package.json` / `package-lock.json` را **اعتبارسنجی** می‌کنند و بعد `npm install` می‌زنند.

اگر در وابستگی‌ها پکیج‌های سنگین Cloudflare (`wrangler`, `@opennextjs/cloudflare`) باشد — حتی به‌صورت `optionalDependencies` — آینهٔ npm هاست اغلب روی دانلود `wrangler-*.tgz` خطای `500` می‌دهد و پیام زیر را نشان می‌دهد:

> اعتبارسنجی وابستگی‌های جاوا اسکریپت با خطا مواجه شد…

## راه‌حل در این مخزن

| پکیج | وضعیت |
|------|--------|
| `next`, `react`, … | در `dependencies` |
| `typescript`, `tailwindcss`, … | در `devDependencies` |
| `@opennextjs/cloudflare`, `wrangler` | **دیگر در package.json نیستند** — فقط با `npx` در اسکریپت‌های Cloudflare |

- مسیر Node دیگر اصلاً نام Wrangler را در فایل‌های پکیج‌منیجر نمی‌بیند.
- `npm run build` = `build:node` (standalone Next برای `server.cjs`).
- Cloudflare در صورت نیاز: `npm run build:cf` / `npm run deploy` (از طریق `npx`).

همچنین فیلدهای `packageManager` و `overrides` که بعضی پنل‌ها را گیج می‌کنند حذف شده‌اند.

## دستورات Parspack / cPanel

در تنظیمات اپ:

```bash
# Install
npm ci
# یا: npm run ci:node

# Build
npm run build
# معادل: npm run build:node

# Start
node server.cjs
# یا: npm run start:node
```

Startup file باید **`server.cjs`** باشد.
فیلد `main` و اسکریپت‌های `start` / `start:node` در `package.json` هم به همین فایل اشاره می‌کنند.

### اگر لاگ گفت `Refusing production start` / `AUTH_SECRET` / `SEED_ADMIN_PASSWORD`

اپ عمداً بدون این دو متغیر بالا نمی‌آید. در لاگ شما دقیقاً همین است.

**راه ۱ — پنل (سریع‌ترین):** در Environment Variables بگذارید:

```text
NODE_ENV=production
AUTH_SECRET=...حداقل ۳۲ کاراکتر تصادفی...
SEED_ADMIN_PASSWORD=...حداقل ۸ کاراکتر...
```

تولید `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

بعد **Stop → Start**. Startup File = `server.cjs` (نه دستور دستی `next start`).

**راه ۲ — یک‌بار روی سرور:**

```bash
node scripts/bootstrap-production-env.cjs
# یا: npm run env:bootstrap
```

فایل `data/production.env` ساخته می‌شود؛ Restart کنید.

**راه ۳ — بعد از این فیکس:** اگر secretها خالی باشند، خود `server.cjs` / instrumentation یک‌بار `data/production.env` می‌سازد و استارت را ادامه می‌دهد. رمز ادمین در لاگ چاپ می‌شود — ذخیره کنید.

### اگر بعد از ۱۰۰٪ ساخت این خطا آمد

```text
Error: Unexpected server response: 400
```

این معمولاً خطای خود Next نیست — پنل (WebSocket ترمینال/لاگ) وقتی پروسه بعد از build بالا نمی‌آید یا روی آدرس اشتباه listen می‌کند، همان پیام را سه بار تکرار می‌کند.

| علت | کار |
|-----|-----|
| Startup اشتباه (اسکریپت قدیمی ریشه یا scraper) | Startup File = **`server.cjs`** |
| `AUTH_SECRET` خالی/ضعیف یا `SEED_ADMIN_PASSWORD` کوتاه | envهای الزامی را پر کنید یا `npm run env:bootstrap` |
| پنل هنوز `next start` قدیمی می‌زند | کد جدید را pull کنید؛ `package.json` → `"start": "node server.cjs"` |
| bind روی `HOSTNAME` لینوکس | `HOSTNAME` را برای listen ست نکنید؛ پیش‌فرض `0.0.0.0` درست است |
| `node_modules` ناقص بعد از build | در Application root: `npm ci` سپس Restart |
| پورت اشغال | Stop کامل → Start؛ فقط یک instance |

بعد از Restart لاگ باید شامل این باشد:

```text
[server.cjs] Ready on http://0.0.0.0:PORT
```

سپس `https://YOUR_DOMAIN/api/health` را چک کنید.

### اگر رجیستری پارس‌هاب روی یک پکیج `500` داد

مثال قدیمی: `nanoid-*.tgz` → در مخزن با `src/lib/id.ts` جایگزین شده است.

کارها:
1. یک‌بار **Rebuild** بزنید (گاهی موقتی است)
2. Install را روی `npm ci` نگه دارید
3. اگر همان پکیج تکرار شد، نام پکیج را بفرستید تا پین/جایگزین شود

Environment (الزامی):

- `NODE_ENV=production`
- `AUTH_SECRET` (≥ ۳۲ کاراکتر، نه `change-me` / `replace-with`)
- `SEED_ADMIN_PASSWORD` (≥ ۸ کاراکتر)
- `PORT` (معمولاً توسط PaaS — دستی عوض نکنید)

Health:

```bash
HEALTHCHECK_URL=https://vorqen.ir/api/health npm run healthcheck
```

جزئیات بیشتر Node host: [`CPANEL_DEPLOY.md`](./CPANEL_DEPLOY.md)
