# Public Registration Page Overrides

> **PROJECT:** ATCCR Platform
> **Generated:** 2026-06-17 22:23:36
> **Page Type:** General

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 768px form column (`max-w-3xl`) on registration; `max-w-2xl` on success confirmation.
- **Layout:** Multi-section card form — participant info, ticket category, optional preferences, consent.
- **Sections:** Header → future-steps notice → form sections → submit.

### Color Overrides

- **Strategy:** ATCCR medical congress palette per `docs/05_UI_UX_GUIDELINES.md` and DEC-015.
- **Primary (navy):** `#0F2B5B` — headers, public chrome.
- **Secondary / accent (teal):** `#0D9488` — primary submit CTA, focus rings.
- **Note:** Runtime tokens from `globals.css`; MASTER generated palette is reference only.

### Component Overrides

- Avoid: Silent success
- Avoid: No indication of progress
- Avoid: Delete without confirmation

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Haptic feedback (vibration), voice guidance, focus indicators (4px+ ring), motion options, alt content, semantic
- Feedback: Brief success message
- Feedback: Step indicators or progress bar
- Interaction: Confirm before delete/irreversible actions
- CTA Placement: Register CTA sticky + After speakers + Bottom
