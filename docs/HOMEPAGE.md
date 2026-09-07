# صفحهٔ Home — از بالا تا پایین

فایل: `tref.digitaldesignnyc.co/index.html`

این فایل خروجی رندر وردپرس است (یک صفحهٔ HTML کامل)، نه قالب PHP. ترتیب DOM همان ترتیبی است که کاربر می‌بیند.

## اسکلت کلی

```text
<html>
  <head>   فونت/سئو/استایل/فاوآیکون
  <body class="is-loader">
    .loader          پوشش تمام‌صفحهٔ ورود
    #wrapper
      header.header  منوی ثابت بالا
      section.banner اسلایدر تمام‌صفحه + تیتر
      section.main-wrap
        .about-team  معرفی صندوق + عکس
        .slogan      جملهٔ مدل کسب‌وکار
        .info        سرمایه‌گذاری + رویکرد
      section.join   فرم Contact Form 7
      footer.footer  منو، دیسکلیمر، کپی‌رایت
    اسکریپت‌ها (تقریباً همه ریموت)
```

کلاس `is-loader` روی `body` اسکرول را قفل می‌کند تا لودر تمام شود. اسکریپت تم (`all.js`) باید `loader` را animate/hide کند و این کلاس را بردارد. چون `all.js` لوکال نیست، آفلاین لودر ممکن است روی صفحه بماند.

## `<head>` چه کار می‌کند

| قطعه | نقش |
| --- | --- |
| لینک `allbd78.css` | تنها استایل تم که لوکال است |
| Rank Math | title، og:image، JSON-LD — سایت `noindex` است (staging) |
| استایل‌های inline وردپرس | `classic-theme-styles` و `global-styles` (بلاک ادیتور؛ روی این تم کلاسیک اثر کمی دارند) |
| Contact Form 7 CSS | ریموت |
| CSS ادمین‌بار | رنگ مشکی + نارنجی `#F35422` برای wp-admin (در فرانت دیده نمی‌شود مگر لاگین باشی) |
| `#wp-custom-css` | پیام خطای CF7 را مخفی می‌کند: `.wpcf7-response-output {display:none;}` |
| UserWay / acsbapp | ویجت دسترسی‌پذیری؛ فوتر: «Web Accessibility by DD.NYC®» |

## 1. Loader

کلاس‌ها: `.loader` `.loader-bg` `.loader-box` `.line` `.line-inner` `.loader-key`

متن:

- Unlock the True Potential of your
- Multi-Family Real Estate Investment

پس‌زمینه از `images/media/slide1.jpeg` (موبایل: `slide1-mob.jpg`). روی آن `key-bg.svg` scale می‌شود. کلید تزئینی `key.svg` است.

وضعیت‌های CSS:

| کلاس | معنی |
| --- | --- |
| (پیش‌فرض) | لودر دیده می‌شود |
| `.loader.animate` | پس‌زمینه بزرگ می‌شود؛ متن و کلید به پایین می‌روند |
| `.loader.hide` | `display: none` |

بدون `all.js` این کلاس‌ها اضافه نمی‌شوند.

## 2. Header

`position: fixed`. لوگو وسط، دو منوی وردپرس چپ و راست.

| منوی وردپرس | آیتم‌ها |
| --- | --- |
| `menu-header-left-menu` | Home · About · Investments |
| `menu-header-right-menu` | Team · Contact |
| تلفن | `949-416-8733` |

`.mob-nav-icon` همبرگر است؛ تا بریک‌پوینت تبلت `display: none` است. آیتم فعلی کلاس وردپرسی `current-menu-item` دارد و رنگ `--c2` می‌گیرد.

همهٔ لینک‌های منو به دامنهٔ زنده می‌روند، نه فایل لوکال.

## 3. Banner

سه `.banner-slide` داخل `.banner-slider`. هر اسلاید `picture` دارد:

- موبایل `max-width: 768px` → `slideN-mob.jpg`
- دسکتاپ → `slideN.jpeg`

روی اسلاید، `.banner-main` تیتر و CTA را می‌گذارد:

- `h1`: The Real Estate Fund Expert Approach
- `.subheading`: Unlock the True Potential…
- `.button` → صفحهٔ Investments

اسلایدر با **Slick** کار می‌کند (اسکریپت ریموت). فلش‌ها از `arrow.svg` / `arrow-hover.svg` استایل می‌شوند.

## 4. Main wrap — سه بلوک محتوا

### About (`.about-team`)

سه ستون:

1. کلید + تیتر + ساب‌هدینگ + متن کوتاه (کلاس `mob-hidden`: روی دسکتاپ مخفی، از `1023px` به پایین دیده می‌شود)
2. عکس `main1.jpeg` با `.img-float`
3. متن کامل + لینک `.link-flash` به About

کلاس `.reveal` یعنی تیتر با `translateY` از پایین می‌آید وقتی `.animate` اضافه شود (باز هم کار `all.js` + GSAP/ScrollTrigger).

### Slogan (`.slogan`)

یک جملهٔ بزرگ با فونت NanumMyeongjo. CSS برای افکت خط‌به‌خط (`.slogan-line` `.slogan-cover`) آماده است؛ در این HTML فقط `.slogan-text` آمده، پس افکت splitlines روی این صفحه اعمال نشده مگر JS آن را بسازد.

### Investments (`.info`)

- `.info-bg` عکس پس‌زمینهٔ سمت راست
- `.info-top` تیتر بخش
- `.line-wrap` / `.line-dash` خط عمودی که با `.animate` پر می‌شود
- `.info-block` متن + لینک
- `.info-img` عکس دوم
- `.invest-info` رویکرد سرمایه‌گذاری + عکس `main4.png`

## 5. فرم Join (Contact Form 7)

فرم وردپرس با id پست `34`. فیلدها:

| name | نوع | اجباری؟ |
| --- | --- | --- |
| `text-100` | full name | خیر |
| `email-251` | email | بله |
| `tel-591` | phone | خیر |
| `text-101` | message | خیر |

بعد از ارسال موفق، یک اسکریپت inline (همین فایل HTML) فرم را مخفی و `.thanks` را نشان می‌دهد. خود ارسال به REST زندهٔ CF7 می‌رود؛ آفلاین کار نمی‌کند.

## 6. Footer

- لوگوی دوباره
- `menu-footer-menu`: همان پنج صفحه
- دو پاراگراف حقوقی (عدم پیشنهاد اوراق + forward-looking)
- Copyright 2026 · Privacy · Terms
- «Created with ♡ by DD.NYC®»

## اسکریپت‌های ته صفحه — ترتیب و نقش

این‌ها همه URL مطلق به سایت یا CDN هستند مگر CSS تم:

| ترتیب | فایل | کار |
| --- | --- | --- |
| 1 | `slick.css` | استایل اسلایدر |
| 2 | `jquery-2.2.4.min.js` | وابستگی قدیمی تم |
| 3 | `slick.js` | اسلایدر بنر |
| 4 | GSAP 3.3.2 | انیمیشن |
| 5 | ScrollTrigger | انیمیشن هنگام اسکرول |
| 6 | `jquery.splitlines.js` | شکستن متن شعار به خط |
| 7 | **`all.js`** | منطق تم: لودر، منوی موبایل، reveal، slogan |
| 8 | لیسنر `wpcf7mailsent` | نمایش Thank you |
| 9 | speculationrules | prefetch لینک‌های داخلی وردپرس |
| 10 | CF7 `hooks` / `i18n` / `swv` / `index.js` | اعتبارسنجی و AJAX فرم |
| 11 | Cloudflare challenge | ضدبات روی هاست زنده |

`all.js` قلب رفتار صفحه است و در این dump نیست. از روی کلاس‌های CSS می‌توان فهمید چه APIای از HTML انتظار دارد:

| کلاس / وضعیت | احتمالاً `all.js` چه می‌کند |
| --- | --- |
| `body.is-loader` → برداشتن | پایان لودر |
| `.loader.animate` سپس `.hide` | انیمیشن خروج لودر |
| `.reveal.animate` | تیترها وارد می‌شوند |
| `.line-dash.animate` | خط عمودی کشیده می‌شود |
| `.banner-block.vis` | بلوک تیتر بنر ظاهر می‌شود |
| `.mob-nav-icon.active` | باز/بسته منوی موبایل |
| `.header` هنگام اسکرول | احتمالاً کوچک/مات شدن هدر |
| `.slogan-text.active` | پرکردن شعار |

## کلاس‌های کمکی که در HTML می‌آیند

| کلاس | معنی |
| --- | --- |
| `.holder` | پدینگ افقی صفحه (`--p1`) |
| `.button` | دکمهٔ outline کرم |
| `.link-flash` | لینک با خط زیر که از دو طرف جابه‌جا می‌شود |
| `.img-float` | overflow hidden برای پارالکس ملایم تصویر (`img` ارتفاع 120%) |
| `.reveal` | ماسک انیمیشن ورود متن |
| `.text-wrap` / `.text-inner` | متن از پایین اسلاید می‌شود |
| `.key-wrap` / `.key` | آیکون کلید تزئینی |
| `.mob-hidden` / `.mob-hide` | جابه‌جایی متن بین دسکتاپ و موبایل |
| `.banner-float` | اسلاید با overflow برای افکت شناور |

## وابستگی به اینترنت

اگر فایل Home را بدون نت باز کنی:

- رنگ، تایپ، لودر و چیدمان از CSS لوکال می‌آید
- لوگو، اسلایدهای بنر، عکس‌های محتوا خالی می‌مانند
- اسلایدر، لودر، منوی موبایل و reveal کار نمی‌کنند
- فرم ارسال نمی‌شود
