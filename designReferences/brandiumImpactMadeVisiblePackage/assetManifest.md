# Asset Manifest and Naming Rules

## Included in this ZIP (reference ONLY)

| Filename | What it contains | Allowed use |
|---|---|---|
| `referenceOnly/impactSectionReference.png` | Original user-provided screenshot (1591×635) | Visual audit/comparison, **not** production |
| `referenceOnly/impactGeometryOverlay.png` | Annotated screenshot with measured card boundaries | Debug/layout calibration only |
| `referenceOnly/card01MintPhotoReference.png` | Visible partial screenshot crop of mint photo | Inspection only |
| `referenceOnly/card02DarkMetricReference.png` | Screenshot crop of black KPI | Inspection only |
| `referenceOnly/card03PortraitResultReference.png` | Screenshot crop of portrait outcome | Inspection only |
| `referenceOnly/card04NeutralCtaReference.png` | Partial screenshot crop of CTA | Inspection only |

**No Brandium-origin individual original photo assets or fonts are bundled.** The screenshot was supplied by the user; do not use crops as live website media. No external asset download is necessary to use the documented CSS/TSX.

## Assets supplied by our own project

- `impactCreativePhoto.webp`: owned/licensed image for tall visual card 01. Master ≥1200px width; portrait crop.
- `impactOutcomePhoto.webp`: owned/licensed case-study image for tall result card 03. Master ≥1200px width.
- Additional cards can be image-free; the text/metric/CTA cards are just HTML and CSS.
- Existing project fonts only; no third-party font files.
- Icon: use a simple inline SVG arrow (included in TSX component, no external library).

## Naming convention

- React components: PascalCase **symbol names** (e.g., `ImpactCard`), filenames camelCase (e.g., `impactCard.tsx`).
- CSS Modules: `impactMadeVisible.module.css`.
- Props/types: `impact.types.ts` (or rename to match existing codebase conventions).
- CMS records: stable `camelCase` keys.
- Owned photos: descriptive camelCase asset names with optimized image extension.
- Source material stored in `referenceOnly/`, never imported from production bundles.

## Next.js image guidance

Use Next.js `<Image fill sizes="(max-width: 767px) 84vw, (max-width: 1023px) 380px, 459px" />`. The parent must be positioned and have fixed/min card height. Avoid CLS and mismatched aspect ratios; retain `object-fit: cover`; configure `object-position` per media. Allow only actual configured remote media domains in `next.config`.
