# Derakhshan Pro

سایت و پنل املاک لوکس. محصول تا حدی کامل است که صاحب سایت فقط هویت دفتر را پر کند و فایل‌های نمونه را از پنل عوض کند.

## صاحب سایت فقط این‌ها را عوض کند

1. بلوک `OWNER_FILL` در `src/config/siteConfig.ts` (نام، تلفن، ایمیل، آدرس، واتساپ، سوشال، SEO)
2. لوگو و تصاویر در `public/images`
3. رمز ادمین/مشاور بعد از اولین ورود
4. آگهی‌های نمونه از `/admin/properties`

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

## مسیرهای محصول

- `/listings` آرشیو عمومی آگهی‌ها
- `/admin/dashboard` مدیریت
- `/agent/dashboard` CRM مشاور
- `/client/dashboard` پنل موکل
- `/privacy` و `/terms`
