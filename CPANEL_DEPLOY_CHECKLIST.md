# چک‌لیست کارهای شما داخل cPanel — vorqen.ir

فقط کارهایی که باید **خودتان در پنل هاست** انجام دهید. آماده‌سازی کد در مخزن انجام شده است.

## ۱) Node.js App

- [ ] **Setup Node.js App** را باز کنید
- [ ] نسخه Node را روی **22** بگذارید (حداقل 20.9+)
- [ ] Application root را روی پوشه پروژه تنظیم کنید
- [ ] Application URL را روی `vorqen.ir` بگذارید
- [ ] **Application startup file = `server.cjs`**
- [ ] هرگز `index.js` را به‌عنوان startup انتخاب نکنید
- [ ] Application mode = `production`

## ۲) Environment Variables

- [ ] `NODE_ENV=production`
- [ ] `AUTH_SECRET` = رشته تصادفی حداقل ۳۲ کاراکتر
- [ ] `SEED_ADMIN_PASSWORD` = رمز ادمین حداقل ۸ کاراکتر
- [ ] `NEXT_PUBLIC_DEMO_STAFF_PASSWORD` را خالی بگذارید
- [ ] `NEXT_PUBLIC_DEMO_OTP` را خالی بگذارید
- [ ] `DEMO_OTP` را خالی بگذارید (مگر عمداً OTP دمو بخواهید)
- [ ] `PORT` را دستکاری نکنید (خود cPanel می‌گذارد)

## ۳) فایل‌ها روی هاست

- [ ] کد پروژه را آپلود کنید (بدون `website-forensics` و بدون `.open-next`)
- [ ] در Application root: `npm ci --omit=optional` (یا `npm run ci:node`) — Wrangler دانلود نمی‌شود
- [ ] اگر build لوکال کرده‌اید، پوشه `.next` را هم آپلود کنید
- [ ] اگر روی هاست build می‌کنید: `npm run build:node`
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

## اگر استارت نشد

1. Startup file را دوباره روی `server.cjs` چک کنید  
2. لاگ را برای خطای `AUTH_SECRET` / `SEED_ADMIN_PASSWORD` بخوانید  
3. `node -v` داخل اپ را با نسخه Selector مقایسه کنید  
4. حق نوشتن `data/` را چک کنید  
5. جزئیات بیشتر: [`CPANEL_DEPLOY.md`](./CPANEL_DEPLOY.md)
