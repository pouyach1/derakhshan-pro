# نقشهٔ پوشه‌ها

هر فایل این ریپو یا مال **ابزار HTTrack** است یا مال **سایت TREF**. کد تم را دست نزده‌ایم؛ فقط چیدمان را نام‌گذاری کرده‌ایم.

## درخت واقعی (همین ریپو)

```text
/
├── README.md                          راهنمای ورود (اضافه شده)
├── docs/                              همین مستندات (اضافه شده)
│
├── index.html                         ایندکس HTTrack — سایت نیست
├── backblue.gif                       گرافیک UI خود HTTrack
├── fade.gif                           گرافیک UI خود HTTrack
├── cookies.txt                        کوکی نشست دانلود (Cloudflare)
├── hts-log.txt                        لاگ دانلود
├── hts-cache/                         کش آپدیت HTTrack
│   ├── readme.txt
│   ├── winprofile.ini                 تنظیمات پروژهٔ WinHTTrack
│   ├── new.txt / new.lst / new.zip    فهرست فایل‌های دانلودشده
│   └── doit.log
│
└── tref.digitaldesignnyc.co/          === سایت ===
    ├── index.html                     تنها صفحهٔ HTML دانلودشده (Home)
    └── wp-content/themes/tref/assets/
        ├── css/allbd78.css            استایل اصلی تم (نام اصلی: all.css)
        ├── fonts/                     Jost + NanumMyeongjo
        └── images/
            ├── key.svg                آیکون کلید (رنگ --c2)
            ├── key-bg.svg             پس‌زمینهٔ لودر
            ├── arrow.svg              فلش اسلایدر
            ├── arrow-hover.svg
            └── media/
                ├── slide1.jpeg        تصویر لودر دسکتاپ
                └── slide1-mob.jpg     تصویر لودر موبایل
```

## دو لایه را قاطی نکن

| لایه | نقش | آیا سایت است؟ |
| --- | --- | --- |
| ریشهٔ ریپو (`index.html`, `hts-*`, `cookies.txt`) | ابزار کپی‌کننده | خیر |
| `tref.digitaldesignnyc.co/` | خروجی رندر‌شدهٔ وردپرس | بله — همین را بخوان |

`index.html` ریشه فقط یک جدول لینک است و این خط را دارد:

```html
<meta HTTP-EQUIV="Refresh" CONTENT="0; URL=tref.digitaldesignnyc.co/index.html">
```

یعنی فوری می‌رود سراغ Home.

## چرا اسم CSS `allbd78.css` است؟

روی سایت زنده فایل این است:

```text
/wp-content/themes/tref/assets/css/all.css?v=20240126-0002
```

HTTrack برای query string یک پسوند هش می‌گذارد تا فایل لوکال یکتا باشد. پس:

| روی سرور | در این پوشه |
| --- | --- |
| `all.css?v=20240126-0002` | `allbd78.css` |

داخل HTML هم همین نام لوکال لینک شده است. محتوای فایل همان `all.css` تم است.

## فونت‌ها

تم دو خانواده دارد. هر کدام چند فرمت برای مرورگرهای قدیمی است (`eot`, `woff2`, `woff`, `ttf`).

| خانواده | وزن | کاربرد |
| --- | --- | --- |
| **Jost** | Light `300` و Regular | متن، منو، فرم، دکمه |
| **NanumMyeongjo** | Regular | تیترها (`h1`, `h2`) و شعار |

فایل‌های `*d41d.eot` کپی همان `.eot` هستند؛ HTTrack برای `font.eot?` (query خالی IE) یک فایل جدا ساخته.

## فایل‌های HTTrack (دست نزن مگر بخواهی mirror را دور بریزی)

| فایل | معنی |
| --- | --- |
| `hts-log.txt` | زمان دانلود، فیلترها، یک warning |
| `hts-cache/winprofile.ini` | تنظیمات: فقط Home، `FollowRobotsTxt=2` |
| `hts-cache/new.txt` | لیست URL → مسیر لوکال |
| `cookies.txt` | کوکی Cloudflare از لحظهٔ دانلود |

لاگ صریح می‌گوید:

```text
Warning: Link https://tref.digitaldesignnyc.co/ not scanned (follow robots meta tag)
```

صفحهٔ Home متای `noindex, nofollow` دارد. به همین خاطر HTTrack **صفحات دیگر و بیشتر assetها را دنبال نکرد**. فقط CSS و چیزهایی که خود CSS صدا می‌زند (فونت و چند تصویر تم) آمده‌اند.

## چه چیزی اینجا نیست (ولی در HTML به آن اشاره شده)

صفحهٔ Home هنوز به دامنهٔ زنده وصل است. این‌ها **لوکال نیستند**:

| مورد | مسیر زنده |
| --- | --- |
| اسکریپت تم | `.../themes/tref/assets/js/all.js` |
| jQuery 2.2.4 | `.../themes/tref/assets/js/jquery-2.2.4.min.js` |
| Slick slider | `.../js/slick.js` و `.../css/slick.css` |
| GSAP + ScrollTrigger | CDN: `cdnjs.cloudflare.com` |
| jquery.splitlines | `.../js/jquery.splitlines.js` |
| Contact Form 7 | پلاگین وردپرس + REST API |
| لوگو | `.../wp-content/uploads/2024/01/REF-LOGO-PRIMARY-SOFT-WHITE.svg` |
| اسلایدها و عکس‌های محتوا | `.../wp-content/uploads/2023/12/*.jpeg` |
| صفحات About / Investments / Team / Contact | لینک‌های منو؛ HTMLشان دانلود نشده |
| قالب PHP (`header.php`, `front-page.php`, …) | اصلاً در dump نیست |

پس این پوشه برای **خواندن ساختار صفحه و CSS** مناسب است، نه برای اجرای آفلاین کامل یا توسعهٔ تم وردپرس.

## صفحات واقعی سایت (فقط در CSS و منو دیده می‌شوند)

تم برای این صفحات استایل دارد، حتی اگر HTMLشان اینجا نباشد:

| URL سایت | بلوک CSS مربوط |
| --- | --- |
| `/` Home | `.banner` `.main-wrap` `.join` |
| `/about/` | `.about-top` `.about-team` `.history` |
| `/investments/` | `.invest-top` `.invest-form` `.invest-info` |
| `/team/` | `.team` `.box` |
| `/contact/` | `.contacts` `.join-form` |
| `/privacy-policy/` و `/terms-and-conditions/` | `.content-privacy` |
| صفحهٔ 404 | `.page-404` |

منبع این جدول: کامنت‌های داخلی خود `allbd78.css` — تم از قبل بخش‌بندی شده بود.
