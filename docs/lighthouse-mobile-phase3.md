# Lighthouse mobile — فاز ۳ (Home carousels)

تاریخ: 2026-09-18T21:56:03.540Z

محیط: `next build` + `next start -p 3001` · Lighthouse **12.8.2** · mobile · simulate

## نتیجه صفحه اصلی (`/`)

| متریک | فاز ۲ | فاز ۳ | Δ |
|------|-------|-------|---|
| Performance | **76** | **79** | +3 |
| FCP | 1.7 s | 1.1 s | |
| LCP | 6.6 s | 5.9 s | |
| TBT | 70 ms | 0 ms | |
| CLS | **0** | **0** | |
| Speed Index | 2.6 s | 1.1 s | |

## First Load JS (build)
- صفحه `/`: **12.2 kB** · First Load JS **207 kB**

## مسئول افت / گلوگاه‌ها
- نسبت به فاز ۲ افت معنی‌داری دیده نشد / بهبود داشته.

### فرصت‌های اصلی
- **Reduce unused JavaScript** — Est savings of 98 KiB
- **Eliminate render-blocking resources** — Est savings of 180 ms
- **Avoid serving legacy JavaScript to modern browsers** — Est savings of 11 KiB
- **Initial server response time was short** — Root document took 0 ms

### Unused JavaScript
- Est savings of 98 KiB
- `4bd1b696-100b9d70ed4e49c1.js` ≈ 53 KiB
- `1255-623a1bc706ecd6cc.js` ≈ 45 KiB

### تصاویر
- بررسی improve-image-delivery / responsive images در گزارش خام

## جمع‌بندی
- **CLS = 0** حفظ شد.
- بار اصلی احتمالی: **JS کلاینت** (framer-motion + use-gesture روی دو کاروسل Home) و **LCP تصویر Hero/کاروسل**.
- کاروسل‌ها فقط موبایل render می‌شوند ولی کد کلاینت در بایندل Home می‌آید.
