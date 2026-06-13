# Public Landing Page Overrides

> **PROJECT:** ATCCR Platform
> **Generated:** 2026-06-13 04:09:14
> **Page Type:** Landing / Marketing

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** 1. Hero (date/location/countdown), 2. Speakers grid, 3. Agenda/schedule, 4. Sponsors, 5. Register CTA

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** ATCCR medical congress palette per `docs/05_UI_UX_GUIDELINES.md` and DEC-015 — **not** the generated MASTER sky-blue palette.
- **Primary (navy):** `#0F2B5B` — hero background, footer, brand headers.
- **Secondary / accent (teal):** `#0D9488` — CTAs, highlights, focus rings.
- **Background:** `#FFFFFF` / `#F4F6F8` alternating sections.
- **Note:** `MASTER.md` generated palette is complementary reference only; runtime tokens come from `globals.css`.

### Component Overrides

- Avoid: Unoptimized full-size images
- Avoid: No visual feedback on current location

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Badge hover effects, metric pulse animations, certificate carousel, smooth stat reveal
- Performance: Use appropriate size and format (WebP)
- Navigation: Highlight active nav item with color/underline
- CTA Placement: Register CTA sticky + After speakers + Bottom
