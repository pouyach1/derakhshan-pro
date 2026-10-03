# Derakhshan Pro

سایت و پنل املاک لوکس. محصول تا حدی کامل است که صاحب سایت فقط هویت دفتر را پر کند و فایل‌های نمونه را از پنل عوض کند.

## صاحب سایت فقط این‌ها را عوض کند

1. **فایل اصلی هویت سایت:** [`src/config/SITE_INFO.ts`](./src/config/SITE_INFO.ts)  
   راهنمای کوتاه: [`اطلاعات-سایت.md`](./اطلاعات-سایت.md)
2. لوگو و تصاویر در `public/images`
3. رمز ادمین/مشاور بعد از اولین ورود
4. آگهی‌های نمونه از `/admin/properties`

با ویرایش `SITE_INFO.ts` نام، تماس، آدرس، سوشال و SEO در کل سایت عوض می‌شود.

املاک، لید، مشتری، بازدید و درخواست سایت از API زنده کار می‌کنند.
برای نسخه نمایشی حرفه‌ای بعد از تنظیم `.env.local` یک‌بار `npm run db:seed` بزنید تا آرشیو املاک، مشاوران، معاملات و CRM نمونه بارگذاری شود.

## اجرا

```bash
npm install
cp .env.example .env.local
# set AUTH_SECRET, SEED_ADMIN_PASSWORD, and optional DEMO_OTP in .env.local
npm run db:seed
npm run dev
```

ورود ادمین/مشاور با ایمیل‌های `siteConfig.panels` و رمزی که در `SEED_ADMIN_PASSWORD` هنگام seed گذاشته‌اید.  
ورود مشتری فقط وقتی `DEMO_OTP` تنظیم شده باشد (تا اتصال SMS واقعی).

سلامت: `GET /api/health`

معماری دیتابیس (فاز A): `src/server/database/` و `docs/database/`

### Deploy

| مسیر | دستور | راهنما |
|------|--------|--------|
| Node / cPanel / Parspack (`vorqen.ir`) | `npm ci` → `npm run build` → Startup `server.cjs` | [`PARSPACK_DEPLOY.md`](./PARSPACK_DEPLOY.md) · [`CPANEL_DEPLOY.md`](./CPANEL_DEPLOY.md) · [`CPANEL_DEPLOY_CHECKLIST.md`](./CPANEL_DEPLOY_CHECKLIST.md) |
| Cloudflare / OpenNext | `npm run build:cf` / `npm run deploy` | OpenNext و Wrangler با `npx` اجرا می‌شوند؛ داخل `package.json` نیستند تا اعتبارسنجی هاست Node نشکند |

> روی PaaS ایرانی اگر پیام «اعتبارسنجی وابستگی‌های جاوا اسکریپت…» دیدید، این مخزن دیگر `wrangler` را در وابستگی‌ها ندارد — بعد از pull/merge یک‌بار Rebuild بزنید.
در production مقدارهای `AUTH_SECRET` و `SEED_ADMIN_PASSWORD` الزامی‌اند؛ fallbackهای دمو (`123456` / `1234`) فقط در development فعال‌اند.
## مسیرهای محصول

- `/listings` آرشیو عمومی آگهی‌ها
- `/admin/dashboard` مدیریت
- `/agent/dashboard` CRM مشاور
- `/client/dashboard` پنل موکل
- `/privacy` و `/terms`
