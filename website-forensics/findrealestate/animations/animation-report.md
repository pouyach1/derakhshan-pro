# FIND Real Estate — Animation Report

Source: https://findrealestate.com  
Generated: 2026-09-09T10:56:41.624Z  
Method: Playwright + local Google Chrome, CSSOM keyframes, scroll/hover/nav probes  
Initial evidence: `animations.json` (146 DOM candidates → ~23 unique signatures)

## Libraries / runtime signals

```json
{
  "gsap": false,
  "ScrollTrigger": false,
  "framerMotion": "unconfirmed-global (transform/opacity/will-change patterns; no window.Motion)",
  "anime": false,
  "lenis": true,
  "swiper": true,
  "three": false,
  "webAnimations": true
}
```

## Motion hierarchy summary

| ID | Level | Name | Category | Trigger | Duration | Easing/Tech | Confidence |
|----|-------|------|----------|---------|----------|-------------|------------|
| global-lenis-smooth-scroll | 1 | Lenis-like smooth scrolling | global | wheel/touch scroll |  |  | high |
| global-loading-line | 1 | YouTube-style top loading line | page-transition / loading | route change / fetch |  | CSS keyframes | high |
| header-scroll-bg-transform | 2 | Sticky header background/transform on scroll | navigation | scroll | 0.3s | ease / ease-in-out | high |
| header-content-color-transition | 3 | Header content color/background transition | navigation |  | 1s | ease-in-out | high |
| nav-label-transform-reveal | 4 | Nav label transform reveal | micro-interaction |  | 0.9s | cubic-bezier(0.16, 1, 0.3, 1) | high |
| nav-arrow-rotate | 4 | Header nav arrow transform | micro-interaction |  | 0.3s | ease | high |
| drop-menu-appear | 3 | Dropdown menu appear | navigation |  |  |  | high |
| burger-menu-collapse | 3 | Burger accordion slideUp/slideDown | navigation | data-state open/closed | 0.3s | ease-out | high |
| agent-join-modal-system | 3 | agent-join-modal overlay + content + collapse | modal |  |  | Radix Dialog/Collapsible + CSS keyframes | high |
| contact-us-modal-system | 3 | contact-us-modal overlay + content + collapse | modal |  |  | Radix Dialog/Collapsible + CSS keyframes | high |
| find-properties-modal-system | 3 | find-properties-modal overlay + content + collapse | modal |  |  | Radix Dialog/Collapsible + CSS keyframes | high |
| hero-scroll-parallax-house | 2 | Hero house scale/translateY scrub | hero / scroll | scroll |  |  | high |
| hero-clouds-drift | 2 | Hero clouds translateX drift | hero | time/scroll |  |  | high |
| hero-smoke-rise | 2 | Hero smoke translateY | hero | scroll/init |  |  | high |
| hero-content-fade-scale | 2 | Hero content opacity/scale on scroll | hero / scroll |  |  |  | high |
| hero-video-mask-scale | 2 | Hero masked video scale(1.8) | hero / image |  |  |  | high |
| section-rewired-list-reveal | 2 | Rewired list items reveal (y:70 → 0, opacity 0→1) | scroll reveal | IntersectionObserver / scroll |  |  | high |
| arrows-section-parallax | 2 | Arrows section scale/opacity/translate | scroll |  |  |  | medium |
| services-bg-hover-scale | 3 | Services item background scale 1.05 + svg slide | hover / component |  |  |  | medium |
| swiper-carousel | 3 | Swiper carousel + bullet micro-rotate | component |  |  | Swiper | high |
| footer-scale-parallax | 2 | Footer content scale/translateY scrub | scroll |  |  |  | high |
| tooltip-appear | 4 | App tooltip fade appear |  |  |  |  | high |
| skeleton-pulse | 4 | Skeleton loading pulse |  |  |  |  | high |

## Per-system details

### Lenis-like smooth scrolling

- **ID:** global-lenis-smooth-scroll
- **Level:** 1
- **Category:** global
- **Trigger:** wheel/touch scroll
- **Initial / Final:** {} → {}
- **Properties:** []
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** Lenis (detected via html.lenis / runtime)
- **Confidence:** high
- **Notes:** Document root uses Lenis class patterns; continuous scroll interpolation observed.

### YouTube-style top loading line

- **ID:** global-loading-line
- **Level:** 1
- **Category:** page-transition / loading
- **Trigger:** route change / fetch
- **Initial / Final:** {"width":"0%"} → {"width":"100%"}
- **Properties:** ["loading-line_youtubeLoading","loading-line_youtubeLoadingSlow","loading-line_youtubeCompleting"]
- **Duration:** n/a
- **Easing:** CSS keyframes
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Sticky header background/transform on scroll

- **ID:** header-scroll-bg-transform
- **Level:** 2
- **Category:** navigation
- **Trigger:** scroll
- **Initial / Final:** {} → {}
- **Properties:** ["background-color","transform"]
- **Duration:** 0.3s
- **Easing:** ease / ease-in-out
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Header content color/background transition

- **ID:** header-content-color-transition
- **Level:** 3
- **Category:** navigation
- **Trigger:** n/a
- **Initial / Final:** {} → {}
- **Properties:** ["background-color","color"]
- **Duration:** 1s
- **Easing:** ease-in-out
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Nav label transform reveal

- **ID:** nav-label-transform-reveal
- **Level:** 4
- **Category:** micro-interaction
- **Trigger:** n/a
- **Initial / Final:** {} → {}
- **Properties:** ["transform"]
- **Duration:** 0.9s
- **Easing:** cubic-bezier(0.16, 1, 0.3, 1)
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Header nav arrow transform

- **ID:** nav-arrow-rotate
- **Level:** 4
- **Category:** micro-interaction
- **Trigger:** n/a
- **Initial / Final:** {} → {}
- **Properties:** ["transform"]
- **Duration:** 0.3s
- **Easing:** ease
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Dropdown menu appear

- **ID:** drop-menu-appear
- **Level:** 3
- **Category:** navigation
- **Trigger:** n/a
- **Initial / Final:** {"opacity":0,"transform":"translateY(5%)"} → {"opacity":1,"transform":"translateY(0)"}
- **Properties:** ["drop-menu_appear"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Burger accordion slideUp/slideDown

- **ID:** burger-menu-collapse
- **Level:** 3
- **Category:** navigation
- **Trigger:** data-state open/closed
- **Initial / Final:** {"height":0,"opacity":0} → {"height":"var(--radix-collapsible-content-height)","opacity":1}
- **Properties:** ["burger-menu_slideDown","burger-menu_slideUp"]
- **Duration:** 0.3s
- **Easing:** ease-out
- **Technology:** Radix collapsible + CSS keyframes
- **Confidence:** high
- **Notes:** 

### agent-join-modal overlay + content + collapse

- **ID:** agent-join-modal-system
- **Level:** 3
- **Category:** modal
- **Trigger:** n/a
- **Initial / Final:** {"opacity":0,"transform":"translate(-50%, -48%) scale(0.96)"} → {"opacity":1,"transform":"translate(-50%, -50%) scale(1)"}
- **Properties:** ["agent-join-modal_overlayShow","agent-join-modal_contentShow","agent-join-modal_slideDown","agent-join-modal_slideUp"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** Radix Dialog/Collapsible + CSS keyframes
- **Confidence:** high
- **Notes:** 

### contact-us-modal overlay + content + collapse

- **ID:** contact-us-modal-system
- **Level:** 3
- **Category:** modal
- **Trigger:** n/a
- **Initial / Final:** {"opacity":0,"transform":"translate(-50%, -48%) scale(0.96)"} → {"opacity":1,"transform":"translate(-50%, -50%) scale(1)"}
- **Properties:** ["contact-us-modal_overlayShow","contact-us-modal_contentShow","contact-us-modal_slideDown","contact-us-modal_slideUp"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** Radix Dialog/Collapsible + CSS keyframes
- **Confidence:** high
- **Notes:** 

### find-properties-modal overlay + content + collapse

- **ID:** find-properties-modal-system
- **Level:** 3
- **Category:** modal
- **Trigger:** n/a
- **Initial / Final:** {"opacity":0,"transform":"translate(-50%, -48%) scale(0.96)"} → {"opacity":1,"transform":"translate(-50%, -50%) scale(1)"}
- **Properties:** ["find-properties-modal_overlayShow","find-properties-modal_contentShow","find-properties-modal_slideDown","find-properties-modal_slideUp"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** Radix Dialog/Collapsible + CSS keyframes
- **Confidence:** high
- **Notes:** 

### Hero house scale/translateY scrub

- **ID:** hero-scroll-parallax-house
- **Level:** 2
- **Category:** hero / scroll
- **Trigger:** scroll
- **Initial / Final:** {} → {}
- **Properties:** ["transform (scale + translateY)"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** Observed continuous transform changes while scrolling through hero; not a CSS keyframe.

### Hero clouds translateX drift

- **ID:** hero-clouds-drift
- **Level:** 2
- **Category:** hero
- **Trigger:** time/scroll
- **Initial / Final:** {} → {}
- **Properties:** ["transform translateX"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Hero smoke translateY

- **ID:** hero-smoke-rise
- **Level:** 2
- **Category:** hero
- **Trigger:** scroll/init
- **Initial / Final:** {} → {}
- **Properties:** ["transform translateY"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Hero content opacity/scale on scroll

- **ID:** hero-content-fade-scale
- **Level:** 2
- **Category:** hero / scroll
- **Trigger:** n/a
- **Initial / Final:** {} → {}
- **Properties:** ["opacity","transform scale"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Hero masked video scale(1.8)

- **ID:** hero-video-mask-scale
- **Level:** 2
- **Category:** hero / image
- **Trigger:** n/a
- **Initial / Final:** {} → {}
- **Properties:** ["transform scale"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Rewired list items reveal (y:70 → 0, opacity 0→1)

- **ID:** section-rewired-list-reveal
- **Level:** 2
- **Category:** scroll reveal
- **Trigger:** IntersectionObserver / scroll
- **Initial / Final:** {"y":70,"opacity":0} → {"y":0,"opacity":1}
- **Properties:** []
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Arrows section scale/opacity/translate

- **ID:** arrows-section-parallax
- **Level:** 2
- **Category:** scroll
- **Trigger:** n/a
- **Initial / Final:** {"scale":0.8,"opacity":0.1,"tx":-25.95} → {}
- **Properties:** []
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** medium
- **Notes:** 

### Services item background scale 1.05 + svg slide

- **ID:** services-bg-hover-scale
- **Level:** 3
- **Category:** hover / component
- **Trigger:** n/a
- **Initial / Final:** {"scale":1.05,"opacity":0,"svgTx":-18} → {"scale":1,"opacity":1,"svgTx":0}
- **Properties:** []
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** medium
- **Notes:** 

### Swiper carousel + bullet micro-rotate

- **ID:** swiper-carousel
- **Level:** 3
- **Category:** component
- **Trigger:** n/a
- **Initial / Final:** {} → {}
- **Properties:** []
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** Swiper
- **Confidence:** high
- **Notes:** 

### Footer content scale/translateY scrub

- **ID:** footer-scale-parallax
- **Level:** 2
- **Category:** scroll
- **Trigger:** n/a
- **Initial / Final:** {"scale":0.98,"ty":-304,"opacity":0} → {}
- **Properties:** []
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### App tooltip fade appear

- **ID:** tooltip-appear
- **Level:** 4
- **Category:** n/a
- **Trigger:** n/a
- **Initial / Final:** {"opacity":0} → {"opacity":1}
- **Properties:** ["app-tooltip_appear"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 

### Skeleton loading pulse

- **ID:** skeleton-pulse
- **Level:** 4
- **Category:** n/a
- **Trigger:** n/a
- **Initial / Final:** {} → {}
- **Properties:** ["skeleton_skeleton-pulse"]
- **Duration:** n/a
- **Easing:** n/a
- **Technology:** n/a
- **Confidence:** high
- **Notes:** 


## CSS @keyframes discovered (30)

- `app-tooltip_appear__uwULo` (2 frames)
- `skeleton_skeleton-pulse__DdvlB` (2 frames)
- `agent-join-modal_slideDown__e4uyC` (2 frames)
- `agent-join-modal_slideUp__xI_aK` (2 frames)
- `agent-join-modal_overlayShow__K1dY2` (2 frames)
- `agent-join-modal_contentShow__0G70k` (2 frames)
- `search-input_spin__Wklti` (2 frames)
- `form-search-input_spin__dM4_a` (2 frames)
- `drop-menu_appear__iEaKs` (2 frames)
- `burger-menu_slideDown__ReXzg` (2 frames)
- `burger-menu_slideUp__L9EMs` (2 frames)
- `loading-line_youtubeLoading__zpf5Y` (5 frames)
- `loading-line_youtubeLoadingSlow__nR50v` (3 frames)
- `loading-line_youtubeCompleting__31EzQ` (2 frames)
- `find-properties-modal_slideDown__8m2_b` (2 frames)
- `find-properties-modal_slideUp__OqMUQ` (2 frames)
- `find-properties-modal_overlayShow__AJ0ph` (2 frames)
- `find-properties-modal_contentShow__8JsZO` (2 frames)
- `swiper-preloader-spin` (2 frames)
- `contact-us-modal_slideDown__lVYgV` (2 frames)
- `contact-us-modal_slideUp__7zyfW` (2 frames)
- `contact-us-modal_overlayShow__LNgm0` (2 frames)
- `contact-us-modal_contentShow__fw1K9` (2 frames)
- `go2264125279` (2 frames)
- `go3020080000` (2 frames)
- `go463499852` (2 frames)
- `go1268368563` (2 frames)
- `go1310225428` (2 frames)
- `go651618207` (3 frames)
- `go901347462` (2 frames)

## Remaining / not fully extracted

See `remaining-gaps.json`.

## Quality checklist

- [x] Homepage deep scroll 0–100%
- [x] Hero scrub stages
- [x] Hover probes
- [x] Desktop + mobile + tablet navigation
- [x] Multi-page inventory
- [x] Network/DOM media assets download attempt
- [x] Deduplicate DOM candidates into systems
- [x] No application source code modified

## Counts summary

| Metric | Count |
|--------|------:|
| Pages inventoried | 15 |
| Animation systems (deduped) | 24 |
| CSS `@keyframes` | 30 |
| Original DOM candidates (`animations.json`) | 146 |
| Unique candidate signatures (approx) | 23 |
| Hover probes with visual change | 13 |
| Downloaded video assets | 3 |
| Lottie assets | 0 |
| Property detail pages sampled | 1 |
| Viewports used | 5 |

## Property detail (supplemental)

- Sample URL: `https://findrealestate.com/properties/3071551`
- Evidence: `property-detail-motion.json`
- Runtime: Lenis=true, Swiper=true, canvas=0, images=24
- Gallery swipers: 1
- Hover visual changes: 5

## NOT EXTRACTED (explicit)

1. Custom / magnetic cursor math — not observed
2. WebGL / Three.js marketing scenes — not observed on public routes
3. Lottie JSON assets — not observed
4. Authenticated `app.findrealestate.com` motion — behind sign-in
5. Exact numeric Lenis / Framer timeline configs from minified bundles — behavioral evidence only

### Property detail gallery / Swiper

- **ID:** property-gallery-swiper
- **Level:** 3
- **Category:** component
- **Trigger:** drag / pagination / navigation
- **Technology:** Swiper
- **Confidence:** high
- **Evidence:** https://findrealestate.com/properties/3071551
