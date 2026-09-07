# Done Deals

گرید کارت‌های نمونه‌کار مطابق [rioproperty.co.za/done-deals](https://www.rioproperty.co.za/done-deals).

## فایل‌ها

| فایل | نقش |
| --- | --- |
| `index.html` | دمو با HTML استاتیک + CSS دقیق Webflow |
| `css/done-deals.css` | توکن‌ها، گرید ۱۲/۸/۲، overlay، هاور |
| `components/DoneDeals.jsx` | همان مارکاپ برای React |
| `components/DoneDeals.tailwind.jsx` | همان ظاهر با Tailwind utilities |

```bash
python3 -m http.server 4173
```

`http://localhost:4173/done-deals/`

## کلاس‌های اصلی

```
.work_main_container.u-container
  .work_main_collection_list.u-grid-custom.u-gap-4
    .work_main_collection_item
      .done-deals_component_inner.u-flex-grow.u-position-relative.u-overflow-clip
        .done-deals_component_overlay_bg
      .done-deals_component_bottom   /* flex; space-between; RETAIL · LEASED */
```

## گرید

- Desktop: `--_column-count---value: 12` → هر کارت `span 4` → ۳ ستون
- Tablet `< 991px`: `8` → ۲ ستون
- Mobile `< 767px`: `2` → ۱ ستون
- Gap: `var(--_spacing---space--4-4rem)` = `4rem`
- Radius: `var(--radius--main)` = `1rem`

Media queries و Container Queries (`@container work`) هر دو ستون‌ها را عوض می‌کنند.

## Hover

- تصویر `scale(1.05)` در ۱ ثانیه با `cubic-bezier(.625, .05, 0, 1)`
- overlay از `opacity: 0` به `1` با `linear-gradient(#0000 50%, #000000bf)` و `inset: 0%`
- برچسب‌های پایین Flexbox، رنگ `#333`، `uppercase`
