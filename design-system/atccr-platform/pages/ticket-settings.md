# Ticket Settings Page Overrides

> **PROJECT:** ATCCR Platform
> **Generated:** 2026-06-17 09:22:50
> **Page Type:** Dashboard / Data View

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

- **Strategy:** ATCCR medical congress palette per `docs/05_UI_UX_GUIDELINES.md` and DEC-015 — **not** the generated MASTER teal palette.
- **Primary (navy):** `#0F2B5B` — page headers, table headings.
- **Secondary / accent (teal):** `#0D9488` — primary actions, active badges, focus rings.
- **Background:** `#FFFFFF` / `#F4F6F8` card and muted sections.
- **Note:** Runtime tokens come from `globals.css`; MASTER generated palette is reference only.

### Component Overrides

- **Layout:** Card sections for ticket types; nested cards for registration options.
- **Table:** Responsive — stacked cards on mobile, table on `md+`.
- Avoid: Text input for everything
- Avoid: Validate only on submit

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Badge hover effects, metric pulse animations, certificate carousel, smooth stat reveal
- Forms: Use email tel number url etc
- Forms: Validate on blur for most fields
- CTA Placement: Register CTA sticky + After speakers + Bottom
