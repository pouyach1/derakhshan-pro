# Find Real Estate — Animation Forensics

Standardized motion forensics pack for https://findrealestate.com

## Structure

```
animations/
├── README.md
├── animation-report.md
├── animation-system.json
├── pages-inventory.json
├── hero-motion.json
├── scroll-motion.json
├── hover-interactions.json
├── navigation-motion.json
├── page-transitions.json
├── text-motion.json
├── image-motion.json
├── animation-assets.json
├── css-keyframes.json
├── remaining-gaps.json
├── property-detail-motion.json
├── animations.json          # original 146-candidate extraction (preserved)
└── assets/
    ├── lottie/
    ├── video/
    ├── svg/
    ├── gif/
    └── other/
```

## How this was produced

1. Kept original `animations.json` as initial evidence.
2. Deduplicated identical DOM transitions into animation **systems**.
3. Ran Playwright with local Chrome for scroll/hover/nav/page probes.
4. Extracted CSSOM `@keyframes`.
5. Attempted asset downloads into `assets/`.

## Temporary script

`../forensics-full-motion.cjs` — forensic runner only (does not modify the app).

## Counts (latest)

- Pages inventoried: **15**
- Animation systems: **24**
- CSS keyframes: **30**
- Original DOM candidates: **146** → ~**23** unique signatures
- Videos downloaded: **3**
- Lottie: **0**
- Explicit NOT EXTRACTED: custom cursor, WebGL/Three, Lottie, authenticated app motion, exact Lenis numeric config
