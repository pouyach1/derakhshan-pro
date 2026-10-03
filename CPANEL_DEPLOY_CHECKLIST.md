# چک‌لیست کارهای شما داخل cPanel — vorqen.ir

فقط کارهایی که باید **خودتان در پنل هاست** انجام دهید. آماده‌سازی کد در مخزن انجام شده است.

## ۱) Node.js App

- [ ] **Setup Node.js App** را باز کنید
- [ ] نسخه Node را روی **22** بگذارید (حداقل 20.9+)
- [ ] Application root را روی پوشه پروژه تنظیم کنید
- [ ] Application URL را روی `vorqen.ir` بگذارید
- [ ] **Application startup file = `server.cjs`**
- [ ] هرگز scraper یا فایل دیگر را به‌عنوان startup انتخاب نکنید
- [ ] Application mode = `production`

## ۲) Environment Variables

- [ ] `NODE_ENV=production`
- [ ] `AUTH_SECRET` = رشته تصادفی حداقل ۳۲ کاراکتر
- [ ] `SEED_ADMIN_PASSWORD` = رمز ادمین حداقل ۸ کاراکتر
- [ ] `NEXT_PUBLIC_DEMO_STAFF_PASSWORD` را خالی بگذارید
- [ ] `NEXT_PUBLIC_DEMO_OTP` را خالی بگذارید
- [ ] `DEMO_OTP` را خالی بگذارید (مگر عمداً OTP دمو بخواهید)
- [ ] `PORT` را دستکاری نکنید (خود cPanel می‌گذارد)
- [ ] `HOSTNAME` را برای listen ست نکنید (در صورت نیاز فقط `HOST=0.0.0.0`)

## ۳) فایل‌ها روی هاست

- [ ] کد پروژه را آپلود کنید (بدون `website-forensics` و بدون `.open-next`)
- [ ] در Application root: `npm ci` (یا `npm run ci:node`)
- [ ] اگر build لوکال کرده‌اید، پوشه `.next` را هم آپلود کنید
- [ ] اگر روی هاست build می‌کنید: `npm run build` (یا `npm run build:node`)
- [ ] یک‌بار seed (اگر `data/agency.json` ندارید):
  - با envهای پرشده: `SEED_ADMIN_PASSWORD='...' npm run db:seed`
  - یا فایل `data/agency.json` آماده را آپلود کنید
- [ ] مطمئن شوید پوشه `data/` قابل نوشتن است

## ۴) Domain و SSL

- [ ] DNS دامنه `vorqen.ir` به این هاست اشاره کند
- [ ] سایت قبلی همان دامنه را Stop / جدا کنید تا تداخل نباشد
- [ ] دامنه را به همین Node App وصل کنید
- [ ] AutoSSL / Let's Encrypt را برای `vorqen.ir` فعال کنید
- [ ] Force HTTPS روشن باشد
- [ ] اگر Cloudflare Proxy دارید: SSL = **Full (strict)**

## ۵) Start و تست

- [ ] اپ را Start / Restart کنید
- [ ] لاگ را چک کنید: باید `Ready on http://...` از `server.cjs` دیده شود
- [ ] `https://vorqen.ir/api/health` → `"healthy"`
- [ ] `https://vorqen.ir/` باز شود
- [ ] `https://vorqen.ir/listings` باز شود
- [ ] `https://vorqen.ir/login` → ورود با `admin@vorqen.ir` و `SEED_ADMIN_PASSWORD`
- [ ] یک API مثل `https://vorqen.ir/api/properties` پاسخ JSON بدهد

## ۶) بعد از لانچ

- [ ] بکاپ cron برای `data/agency.json` بگذارید
- [ ] رمز ادمین را از پنل عوض کنید
- [ ] مطمئن شوید فقط **یک** process برای اپ فعال است

## اگر استارت نشد / `Refusing production start` / `Unexpected server response: 400`

لاگ اگر گفت `AUTH_SECRET` یا `SEED_ADMIN_PASSWORD` — همین دو تا در پنل خالی‌اند.

1. در Environment Variables بگذارید:  
   `AUTH_SECRET` (≥۳۲) و `SEED_ADMIN_PASSWORD` (≥۸) و `NODE_ENV=production`  
   یا در Application root: `npm run env:bootstrap`
2. Startup file را روی `server.cjs` بگذارید (نه `next start` دستی)  
3. مطمئن شوید `HOSTNAME` برای bind ست نشده  
4. Stop → Start؛ لاگ باید `Ready on http://0.0.0.0:…` یا پیام auto-bootstrap را نشان دهد  
5. جزئیات: [`PARSPACK_DEPLOY.md`](./PARSPACK_DEPLOY.md) · [`CPANEL_DEPLOY.md`](./CPANEL_DEPLOY.md)
