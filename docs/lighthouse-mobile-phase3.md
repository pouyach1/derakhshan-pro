# Lighthouse mobile — فاز ۳ (Home carousels)

تاریخ: 2026-09-18T22:00:29.853Z

محیط: `next build` + `next start -p 3001` · Lighthouse **12.8.2** · mobile · simulate

## نتیجه صفحه اصلی (`/`)

| متریک | فاز ۲ | فاز ۳ | Δ |
|------|-------|-------|---|
| Performance | **76** | **74** | -2 |
| FCP | 1.7 s | 1.7 s | |
| LCP | 6.6 s | 7.2 s | |
| TBT | 70 ms | 140 ms | |
| CLS | **0** | **0** | |
| Speed Index | 2.6 s | 2.7 s | |

## First Load JS (build)
- صفحه `/`: **12.2 kB** · First Load JS **207 kB**

## مسئول افت / گلوگاه‌ها
- Performance نسبت به فاز ۲ **2 امتیاز** افت کرده.

### فرصت‌های اصلی
- **Eliminate render-blocking resources** — Est savings of 720 ms
- **Reduce unused CSS** — Est savings of 11 KiB
- **Enable text compression** — Est savings of 3 KiB
- **Avoid serving legacy JavaScript to modern browsers** — Est savings of 11 KiB
- **Initial server response time was short** — Root document took 10 ms

### Unused JavaScript
- n/a


## جمع‌بندی
- **CLS = 0** حفظ شد.
- گلوگاه اصلی باقی‌مانده: **Unused JS** در shared chunks و احتمالاً **LCP تصویر** Hero/کاروسل؛ نه لزوماً منطق کاروسل به‌تنهایی.
