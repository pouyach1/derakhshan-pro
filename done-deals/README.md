# Done Deals

گرید کارت‌های نمونه‌کار، با همان کلاس‌ها و توکن‌های [rioproperty.co.za/done-deals](https://www.rioproperty.co.za/done-deals).

## اجرا

فایل `done-deals/index.html` را در مرورگر باز کن، یا از ریشهٔ این پوشه:

```bash
python3 -m http.server 4173
```

بعد برو به `http://localhost:4173/done-deals/`.

## ساختار کلاس‌ها

```
.work_main_container.u-container
  .work_main_collection_list.u-grid-custom.u-gap-4
    .work_main_collection_item            /* span 4 از ۱۲ ستون */
      .done-deals_component
        .done-deals_component_inner       /* عکس + overlay */
          .done-deals_component_image_wrap
          .done-deals_component_overlay
            .done-deals_component_overlay_bg
            .done-deals_component_overlay_text_wrap
        .done-deals_component_bottom      /* RETAIL · LEASED */
```

## گرید

| عرض | ستون گرید | کارت در هر ردیف |
| --- | --- | --- |
| Desktop | `--_column-count---value: 12` | ۳ (`span 4`) |
| Tablet `< 991px` | `8` | ۲ |
| Mobile `< 767px` | `2` | ۱ (`span 2`) |

فاصله: `var(--_spacing---space--4-4rem)` = `4rem`.  
گوشهٔ کارت: `var(--radius--main)` = `1rem`.

## Hover

- تصویر `scale(1.05)` با `cubic-bezier(.625, .05, 0, 1)` در ۱ ثانیه
- overlay از `opacity: 0` به `1` با گرادیان `linear-gradient(#0000 50%, #000000bf)`
- متن روی عکس از پایین می‌آید
- برچسب‌های پایین با Flexbox `space-between`؛ روی هاور متن زرد می‌شود

استایل در `css/done-deals.css`. نسخهٔ React: `components/DoneDeals.jsx` (همان کلاس‌ها را import کن، Tailwind لازم نیست).
