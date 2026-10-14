# VORQEN Portfolio Assets — املاک درخشان

پک اسکرین‌شات واقعی از سایت (دسکتاپ + موبایل) با واترمارک لوگو **VORQEN** تا قابل استفادهٔ آزاد توسط دیگران نباشد.

## پک ۱۰ تایی (واترمارک‌شده)

مسیر: [`plates/pack-10/`](./plates/pack-10/)

| # | دسکتاپ | موبایل | بخش |
|---|--------|--------|-----|
| 01 | `desk-01-home-vorqen.png` | `mobile-01-home-vorqen.png` | صفحهٔ اصلی / اینترو |
| 02 | `desk-02-listings-vorqen.png` | `mobile-02-listings-vorqen.png` | آرشیو املاک |
| 03 | `desk-03-contact-vorqen.png` | `mobile-03-contact-vorqen.png` | تماس با ما |
| 04 | `desk-04-services-vorqen.png` | `mobile-04-services-vorqen.png` | خدمات |
| 05 | `desk-05-meet-team-vorqen.png` | `mobile-05-meet-team-vorqen.png` | تیم مشاوران |
| 06 | `desk-06-admin-dashboard-vorqen.png` | `mobile-06-admin-dashboard-vorqen.png` | پنل مدیر — داشبورد |
| 07 | `desk-07-admin-properties-vorqen.png` | `mobile-07-admin-properties-vorqen.png` | پنل مدیر — املاک |
| 08 | `desk-08-admin-clients-vorqen.png` | `mobile-08-admin-clients-vorqen.png` | پنل مدیر — مشتریان |
| 09 | `desk-09-agent-dashboard-vorqen.png` | `mobile-09-agent-dashboard-vorqen.png` | پنل مشاور — داشبورد |
| 10 | `desk-10-agent-clients-vorqen.png` | `mobile-10-agent-clients-vorqen.png` | پنل مشاور — مشتریان |

همهٔ نسخه‌های واترمارک‌شده: [`plates/watermarked/`](./plates/watermarked/)  
خام بدون واترمارک (فقط برای ری‌اکسپورت): [`plates/raw/`](./plates/raw/)

### حفاظت برند روی هر فریم
- لوگوی VORQEN گوشهٔ پایین‌راست (پس‌زمینهٔ تیره)
- لوگوی نیمه‌شفاف گوشهٔ بالاچپ
- نوشتهٔ مورب `VORQEN · PORTFOLIO · NOT FOR REUSE` روی وسط تصویر

## کاور و شوریل

| فایل | مشخصات |
|------|--------|
| [`showcase-4k.png`](./showcase-4k.png) | کاور 4K |
| [`showreel-1080p.mp4`](./showreel-1080p.mp4) | شوریل ~1080p |
| [`brand/vorqen-primary-logo.jpg`](./brand/vorqen-primary-logo.jpg) | لوگوی اصلی |

## بازتولید اسکرین‌شات‌ها

```bash
npm run dev -- --port 3000 --hostname 0.0.0.0
SEED_ADMIN_PASSWORD=12345678 node portfolio-assets/_render/capture-watermarked.mjs
```

خروجی در `plates/raw/`، `plates/watermarked/` و `plates/pack-10/`.
