# How We Do It — Curved Timeline Section

**Visual reference:** https://premiercs.com/how-we-do-it

## Repository application (GreenTech Agency)

In this storefront, the curved timeline **visual pattern** is applied to the **Our Work / Portfolio** section (`#our-work`, `Frontend/src/features/portfolio/`), not to How We Work.

- **Our Work (Portfolio):** curved S-timeline (photo + SVG path + active/ghost copy + Prev/Next).
- **How We Work:** cursor-reactive dotted background only — see [DOT_FIELD_BACKGROUND_DESIGN.md](DOT_FIELD_BACKGROUND_DESIGN.md). Keep the existing ProcessBoard interaction.

Do not import Premier branding, photographs, or copy. Use GreenTech tokens and approved (or explicitly temporary demo) portfolio assets.

## Anatomy

```text
section
  header (eyebrow, H2, description) — centered
  stage
    media (square cover, ~12px radius)
    curve (SVG viewBox 0 0 120 360, S-path, 3 markers)
    content (ghost prev title / active time+title+body / ghost next title)
  nav (Previous | N / total | Next)
```

## Interaction summary

- Explicit Previous/Next; optional horizontal swipe; no autoplay; no wheel/scroll hijack.
- Default index 0; no wrap; disable ends; hide nav when one step.
- GSAP (or CSS) transitions ~500–650ms; reduced-motion = instant/opacity only.
- Data-driven steps from portfolio `model/` until CMS exists.

## Full specification

Follow the pasted implementation brief used to create this feature: geometry, responsive breakpoints (~1100 / 768 / 600), accessibility, and the 300-line file cap in [NEXTJS_FRONTEND_PRODUCTION_RULES.md](NEXTJS_FRONTEND_PRODUCTION_RULES.md).
