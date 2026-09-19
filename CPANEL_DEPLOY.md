# Deploy روی cPanel (Node.js) — vorqen.ir

این راهنما مسیر **Node/cPanel** را توضیح می‌دهد. مسیر Cloudflare/OpenNext همچنان با `npm run build` / `npm run deploy` کار می‌کند و حذف نشده است.

## پیش‌نیازها

| مورد | مقدار |
|------|--------|
| Node.js | **22** (حداقل `>=20.9.0`) |
| دامنه | `https://vorqen.ir` |
| Startup file | **`server.cjs`** (هرگز `index.js` ریشه را انتخاب نکنید) |
| Persistence | `data/agency.json` (تک‌فرآیندی) |
| Process count | **۱** instance |

## Application root

پوشهٔ پروژه روی هاست، مثلاً:

```text
/home/USER/derakhshan-pro
```

یا مسیر Application root که در **Setup Node.js App** تنظیم می‌کنید. Document root قدیمی `public_html` نباید فایل‌های استاتیک سایت قبلی را سرو کند؛ کل دامنه باید به اپ Node پروکسی شود.

## Environment variables (الزامی در production)

در cPanel → Node.js App → Environment Variables:

| Key | توضیح |
|-----|--------|
| `NODE_ENV` | `production` |
| `PORT` | معمولاً توسط cPanel خودکار ست می‌شود — دستی عوض نکنید |
| `AUTH_SECRET` | رشته تصادفی **حداقل ۳۲ کاراکتر** (نه `change-me` / `replace-with`) |
| `SEED_ADMIN_PASSWORD` | رمز اولیه ادمین/مشاور — **حداقل ۸ کاراکتر** |

اختیاری (برای دامنه واقعی خالی بگذارید):

| Key | توضیح |
|-----|--------|
| `DEMO_OTP` | فقط اگر عمداً OTP دمو می‌خواهید |
| `NEXT_PUBLIC_DEMO_OTP` | نمایش OTP روی فرم لاگین |
| `NEXT_PUBLIC_DEMO_STAFF_PASSWORD` | نمایش رمز روی فرم لاگین |
| `DEMO_STAFF_PASSWORD` | alias خصوصی برای seed |

بدون `AUTH_SECRET` و `SEED_ADMIN_PASSWORD` معتبر، `server.cjs` و instrumentation **استارت را قطع** می‌کنند.

تولید نمونهٔ secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## دستورات نصب / build / start

### گزینه A — build روی سرور (اگر RAM کافی است)

```bash
cd /home/USER/derakhshan-pro
npm ci
cp .env.example .env.local   # یا فقط envهای cPanel را پر کنید
# AUTH_SECRET و SEED_ADMIN_PASSWORD را تنظیم کنید
SEED_ADMIN_PASSWORD='...' npm run db:seed
npm run build:node
# در cPanel: Restart؛ Startup File = server.cjs
```

### گزینه B — build لوکال، آپلود artifact (پیشنهادی)

روی ماشین build:

```bash
npm ci
export AUTH_SECRET='...'          # فقط برای تست لوکال
export SEED_ADMIN_PASSWORD='...'
SEED_ADMIN_PASSWORD="$SEED_ADMIN_PASSWORD" npm run db:seed
npm run build:node
chmod +x scripts/cpanel-pack.sh
./scripts/cpanel-pack.sh
```

روی هاست:

```bash
# آرشیو را باز کنید، سپس:
npm ci --omit=dev
# data/agency.json را از seed لوکال کپی کنید (یا دوباره db:seed با tsx/devDeps)
# envها را در cPanel ست کنید
# Restart با Startup File = server.cjs
```

### Start / Restart

- Startup File: `server.cjs`
- دستور معادل دستی: `npm run start:node` یا `node server.cjs`
- بعد از تغییر env یا کد: **Stop → Start** یا دکمه Restart در Node.js App

`npm run build` را برای cPanel استفاده نکنید — آن مسیر Cloudflare/OpenNext است.

| مسیر | دستور |
|------|--------|
| Node / cPanel | `npm run build:node` سپس `node server.cjs` |
| Cloudflare | `npm run build` / `npm run deploy` |

## Permissions برای `data/`

```bash
mkdir -p data
chmod u+rwX data
# بعد از seed:
chmod u+rw data/agency.json
```

اپ باید بتواند `data/agency.json` را بخواند و بنویسد. بدون این، CRM بعد از ری‌استارت خالی یا فقط‌خواندنی می‌شود.

فرض فعلی: **یک process**. چند instance همزمان روی یک JSON خطرناک است.

## Domain و SSL

1. DNS `vorqen.ir` (و در صورت نیاز `www`) را به IP هاست بدهید.
2. در cPanel، دامنه را به Node App وصل کنید.
3. AutoSSL / Let's Encrypt را برای `vorqen.ir` فعال کنید.
4. Force HTTPS روشن باشد (کوکی نشست در production با `Secure` است).
5. اگر Cloudflare Proxy جلوی دامنه است: SSL mode = **Full (strict)**؛ از Flexible استفاده نکنید.
6. Canonical در کد: `https://vorqen.ir` (`src/config/siteConfig.ts`).

## Health check

بعد از Start:

```bash
# روی سرور / لوکال
HEALTHCHECK_URL=http://127.0.0.1:$PORT/api/health npm run healthcheck

# از بیرون
HEALTHCHECK_URL=https://vorqen.ir/api/health npm run healthcheck

# یا ساده
curl -fsS https://vorqen.ir/api/health
```

پاسخ سالم باید شامل `"status":"healthy"` باشد.

صفحات سریع برای smoke test:

- `https://vorqen.ir/`
- `https://vorqen.ir/listings`
- `https://vorqen.ir/login`
- `https://vorqen.ir/api/health`
- `https://vorqen.ir/api/properties`

ورود ادمین: ایمیل `admin@vorqen.ir` با همان `SEED_ADMIN_PASSWORD` که هنگام seed گذاشته‌اید.

## فایل‌هایی که نباید روی هاست بروند

- `website-forensics/`
- `extract-*.js`
- `index.js` (اسکرپر Playwright)
- `hero-video.mp4` ریشه
- `.open-next/`
- `.wrangler/`
- `.env` / `.env.local` داخل git
- `node_modules` قدیمی از ماشین دیگر (ترجیحاً `npm ci` روی هاست)

اسکریپت `scripts/cpanel-pack.sh` این‌ها را از آرشیو حذف می‌کند.

## Troubleshooting

| مشکل | علت محتمل | کار |
|------|-----------|-----|
| App استارت نمی‌شود؛ لاگ درباره AUTH_SECRET | secret ضعیف/خالی | secret قوی ≥۳۲ کاراکتر بگذارید |
| Refusing SEED_ADMIN_PASSWORD | env خالی | حداقل ۸ کاراکتر ست کنید |
| `Cannot find module 'next'` | deps نصب نشده | `npm ci` یا `npm ci --omit=dev` |
| سایت قبلی هنوز باز است | proxy/document root | دامنه را فقط به Node App ببندید |
| لاگین کار نمی‌کند بدون HTTPS | کوکی Secure | SSL را درست کنید |
| داده بعد از restart پاک می‌شود | `data/` قابل نوشتن نیست یا seed دوباره | permission و بکاپ `agency.json` |
| OOM هنگام build | RAM کم هاست | گزینه B (build لوکال) |
| Startup روی `index.js` | اشتباه | حتماً `server.cjs` |
| اشتباهی `npm run build` زده‌اید | خروجی Cloudflare | برای cPanel دوباره `npm run build:node` |

## بکاپ

```bash
mkdir -p data/backups
cp data/agency.json "data/backups/agency-$(date +%Y%m%d-%H%M%S).json"
```

`npm run db:seed` کل `agency.json` را با داده دمو جایگزین می‌کند — قبلش بکاپ بگیرید.

## چک‌لیست سریع اپراتور

نسخهٔ فقط‌کاربر: [`CPANEL_DEPLOY_CHECKLIST.md`](./CPANEL_DEPLOY_CHECKLIST.md)
