# Lighthouse mobile — فاز ۲ iOS feel

تاریخ اجرا: 2026-09-18T14:45:22.290Z

محیط: `next build` + `next start -p 3001` (production، نه `next dev`)

ابزار: Lighthouse **12.8.2** · form-factor **mobile** · viewport **390×844** · throttling **simulate**

## نتایج

| صفحه | Performance | FCP | LCP | TBT | CLS | Speed Index |
|------|-------------|-----|-----|-----|-----|-------------|
| `/listings` | **84** | 0.9 s | 4.6 s | 40 ms | **0** | 2.0 s |
| `/` (خانه) | **76** | 1.7 s | 6.6 s | 70 ms | **0** | 2.6 s |

## نکات
- **CLS = 0** روی آرشیو موبایل — اسکلتون و قاب تصویر با aspect-ratio از جابه‌جایی جلوگیری می‌کنند.
- امتیاز Performance تحت تأثیر سایز JS کلاینت (framer-motion + virtualizer + gesture) و تصاویر است؛ مسیر دسکتاپ دست‌نخورده مانده.
- گزارش HTML خام: artifacts `listings-mobile-prod.report.html` و `home-mobile-prod.report.html`.
