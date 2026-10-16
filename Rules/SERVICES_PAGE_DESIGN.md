# Services hub — Revision 2 notes

**Route:** `/services`  
**Reference composition:** Digital Gravity `/services` (layout + motion only)

## Brand mapping

- Fonts: `--font-nourd` only (no Poppins).
- Colors: near-black navy canvas (`#020b12`), `--brand-cyan` accents, light ink.
- Header M8: shared `SiteHeader` already uses 900ms + `cubic-bezier(0.135, 0.9, 0.15, 1)`.
- Contact: `/contact` (no quote dialog in repo).
- Content: 16 real `SERVICE_ITEMS` across 5 groups (no ERP).

## Composition match (screenshot)

| Region | Spec |
| --- | --- |
| Hero | Centered SERVICES eyebrow + one headline + cyan horizon glow |
| Group header | Dotted cyan label (`. DEVELOPMENT`) + large centered title |
| Stage | 3 columns: copy + CTA · 375×421 media · specialties |
| CTA | Solid cyan pill, label **View Details**, travelling border (M6) |
| Outline | Giant uppercase stroke label behind stage |
| Titles | Development / IT / Advertising and Creative / Emerging Tech / Digital Marketing |

## Motion (M1–M8)

| ID | Status in code |
| --- | --- |
| M1 Hero 100px/1000ms | `ServicesHero` + hub CSS |
| M2 Group/stage entrances | `useRevealOnce` + stage animations |
| M3 Image wipe | `ServiceMediaWipe` (cyan backing → unclip) |
| M4 Fade 300ms + autoplay 6s + Pause/Play | `useServiceCarousel` |
| M5 Outline marquee &lt;1200px | hub CSS `outlineMarquee` |
| M6 CTA travelling border | `serviceStage` conic mask |
| M7 Specialty lift/underline | hover + focus |
| M8 Header capsule | existing shared header |

## Blockers

1. **No approved service photography** — wipe runs on brand CSS frame (`imageSrc: null`).
2. Browser recording of M1–M8 not captured in CI — verify locally at `/services`.
3. No quote dialog — contact CTA uses `/contact`.
