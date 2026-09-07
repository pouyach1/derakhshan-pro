# Derakhshan Pro — نقشهٔ استاندارد پوشه

این ریپو **سورس وردپرس نیست**. یک کپی استاتیک (mirror) است که با **HTTrack** از سایت زندهٔ [The Real Estate Fund](https://tref.digitaldesignnyc.co/) گرفته شده.

هیچ فایل HTML / CSS / JS اصلی در این ریپو تغییر داده نشده. این سند فقط برای این است که بفهمی **هر فایل چیست، صفحه چطور ساخته شده، و چه چیزی اینجا نیست**.

شروع از اینجا:

1. [`docs/STRUCTURE.md`](docs/STRUCTURE.md) — نقشهٔ پوشه‌ها و فایل‌ها
2. [`docs/HOMEPAGE.md`](docs/HOMEPAGE.md) — صفحهٔ اصلی از بالا تا پایین
3. [`docs/CSS.md`](docs/CSS.md) — استایل‌ها، رنگ‌ها، و کلاس‌های انیمیشن

---

## در یک نگاه

| چیز | واقعیت |
| --- | --- |
| نوع پروژه | dump استاتیک HTTrack از یک تم وردپرس به نام `tref` |
| استودیو سازنده | [DD.NYC](https://dd.nyc/) |
| صفحهٔ واقعی سایت | `tref.digitaldesignnyc.co/index.html` |
| فایل `index.html` ریشه | ایندکس خود HTTrack است؛ سایت نیست |
| جاوااسکریپت تم | **دانلود نشده** (`all.js` روی سرور زنده می‌ماند) |
| قالب PHP وردپرس | **وجود ندارد**؛ فقط HTML رندر‌شده |

```
مرورگر
  → /index.html          (ایندکس HTTrack، فوری رفرش می‌شود)
    → tref.digitaldesignnyc.co/index.html   (صفحهٔ Home)
         ├── CSS محلی:  assets/css/allbd78.css
         ├── فونت محلی: assets/fonts/*
         ├── چند SVG/JPEG محلی
         └── بقیهٔ تصویر / JS / فرم  → URLهای زندهٔ سایت
```

## چطور مرور کنی

فایل ریشه را باز کن؛ بعد از صفر ثانیه به صفحهٔ Home می‌رود:

```text
index.html  →  tref.digitaldesignnyc.co/index.html
```

برای دیدن استایل واقعی، همان فایل Home را در مرورگر باز کن. لوگو، اسلایدر، و اسکریپت‌ها تا وقتی اینترنت به دامنهٔ اصلی وصل باشد کار می‌کنند، چون بیشترشان لوکال نیستند.
