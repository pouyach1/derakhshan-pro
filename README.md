# Derakhshan Pro

سایت و پنل املاک لوکس. محصول تا حدی کامل است که صاحب سایت فقط هویت دفتر را پر کند و فایل‌های نمونه را از پنل عوض کند.

## صاحب سایت فقط این‌ها را عوض کند

1. بلوک `OWNER_FILL` در `src/config/siteConfig.ts` (نام، تلفن، ایمیل، آدرس، واتساپ، سوشال، SEO)
2. لوگو و تصاویر در `public/images`
3. رمز ادمین/مشاور بعد از اولین ورود
4. آگهی‌های نمونه از `/admin/properties`

املاک، لید، مشتری، بازدید و درخواست سایت از API زنده کار می‌کنند.

## اجرا

```bash
npm install
cp .env.example .env.local
npm run db:seed
npm run dev
```

ورود آزمایشی: `admin@derakhshan.pro` / `123456`  
مشاور: `agent@derakhshan.pro` / `123456`  
مشتری: هر موبایل + OTP `1234`

سلامت: `GET /api/health`

معماری دیتابیس (فاز A): `src/server/database/` و `docs/database/`

## مسیرهای محصول

- `/listings` آرشیو عمومی آگهی‌ها
- `/admin/dashboard` مدیریت
- `/agent/dashboard` CRM مشاور
- `/client/dashboard` پنل موکل
- `/privacy` و `/terms`
