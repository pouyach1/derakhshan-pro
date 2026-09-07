# luxury-places DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 1 · Components: 10
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![luxury-places Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a warm, approachable feel. The light background emphasizes content clarity. Typography uses **Poppins** throughout — a clean, modern choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 16, 20px. The accent color **#ff6900** anchors interactive elements (buttons, links, focus rings). Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| swiper-preloader-color | `#ffffff` | background | Page background, darkest surface |
| color-background-grey | `#f0f0f0` | surface | Card and panel backgrounds |
| swiper-preloader-color | `#000000` | text-primary | Headings and body text |
| color-white-40 | `#666666` | text-muted | Captions, placeholders, secondary info |
| wp--preset--color--luminous-vivid-orange | `#ff6900` | accent | CTAs, links, focus rings, active states |
| danger | `#fa9f47` | danger | Error states, destructive actions |
| success | `#4d9e30` | success | Success states, positive indicators |
| warning | `#f6eb13` | warning | Warning states, caution indicators |
| swiper-theme-color | `#007aff` | info | Informational highlights |
| unknown | `#50b84b` | unknown | Palette color |
| unknown | `#cadb2a` | unknown | Palette color |
| unknown | `#fecd07` | unknown | Palette color |
| unknown | `#ef3a3b` | unknown | Palette color |
| color-black-40 | `#909090` | unknown | Palette color |
| wp--preset--color--cyan-bluish-gray | `#abb8c3` | unknown | Palette color |
| wp--preset--color--pale-pink | `#f78da7` | unknown | Palette color |
| wp--preset--color--vivid-red | `#cf2e2e` | unknown | Palette color |
| wp--preset--color--luminous-vivid-amber | `#fcb900` | unknown | Palette color |
| wp--preset--color--light-green-cyan | `#7bdcb5` | unknown | Palette color |
| wp--preset--color--vivid-green-cyan | `#00d084` | unknown | Palette color |

### CSS Variable Tokens

```css
--border-radius: .13rem;
--border-radius-lg: .25rem;
--color-background-grey: #F0F0F0;
--background-color: var(--color-black);
--background-color: var(--color-black);
--background-color: var(--color-white);
--background-color: var(--color-background-grey);
--header-background-color: var(--color-background-grey);
--header-background-color: transparent;
--header-background-color: var(--color-white);
--property-card-bg-bolor: transparent;
--swiper-pagination-bullet-border-radius: 0px;
--property-card-bg-bolor: var(--color-background-grey);
--property-card-bg-bolor: transparent;
--border-radius: .13rem;
--border-radius-lg: .25rem;
--color-background-grey: #F0F0F0;
--background-color: var(--color-black);
--background-color: var(--color-black);
--background-color: var(--color-white);
```


---

## 3. Typography Rules

**Font Stack:**
- **Poppins** — Heading 1, Heading 2, Heading 3, Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "Poppins";
  src: url("fonts/Poppins-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Poppins";
  src: url("fonts/Poppins-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Poppins | clamp(2.5rem,6.1111111111vw,5.5rem) | 700 |
| Heading 2 | Poppins | clamp(2rem,4.7222222222vw,4.25rem) | 700 |
| Heading 3 | Poppins | clamp(1.75rem,3.8888888889vw,3.5rem) | 700 |
| Body | Poppins | 1rem | 400 |
| Caption | Poppins | clamp(.75rem,.9722222222vw,.875rem) | 400 |

**Typographic Rules:**
- Use **Poppins** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Display (3)

**Card** — `html`
- Variants: `link`, `details`, `category`, `redirect`, `redirect-text`

**Badge** — `html`

**List** — `html`

### Data Input (2)

**Button** — `html`
- Variants: `inner`
- Animation: 

**Input** — `html`
- State: :focus, :placeholder

### Overlay (1)

**Modal** — `html`

### Media (2)

**Image** — `html`

**Icon** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 16, 20, 22, 24, 26, 32
- **Border radius:** 2rem, inherit, .5rem, 3px, 100%, 999px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

No box-shadow values detected. The design appears to use a flat visual style.

**Z-Index Scale:** `0, 1, 2, 4, 5, 10, 50, 998, 999, 1000, 9999, 10000`


---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes swiper-preloader-spin`
- `@keyframes fade-in-slide`
- `@keyframes fade-out-slide`
- `@keyframes checkmark`
- `@keyframes spin`
- `@keyframes logoLoading`
- `@keyframes logoToHeader`
- `@keyframes logoHide`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ff6900` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Use **Poppins** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use border and background shifts for elevation — not shadows
- Use border-radius from the scale: 2rem, inherit, .5rem, 3px, 100%
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use Poppins consistently
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't add box-shadow — this design system uses flat elevation
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No box-shadow on any element
- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

No breakpoints detected. Consider adding responsive breakpoints to the design system.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f0f0f0
Border: 1px solid var(--border)
Radius: 3px
Padding: 16px
Font: Poppins
No shadows — use borders and surface colors for depth.
```

### Build a Button

```
Primary: bg #ff6900, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 3px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ff6900
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f0f0f0
Label: #666666 (muted, 12px, uppercase)
Value: #000000 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid var(--border)
Focus: border-color #ff6900
Label: #666666 12px
Spacing: 16px between fields
Radius: 3px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Poppins, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: flat, surface shifts
```
