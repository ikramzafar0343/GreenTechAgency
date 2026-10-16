# Navigation mega menu — implementation notes

**Date:** 8 October 2026  
**Reference screenshots:** Digital Gravity Services / Industry menus (layout authority)  
**Scope:** Existing global header only

## Implementation map

| Concern | Path |
| --- | --- |
| Header shell | `Frontend/src/features/header/components/HeaderInteractive.tsx` |
| Desktop triggers | `Frontend/src/features/header/components/DesktopNavigation.tsx` |
| Mega panel | `Frontend/src/features/header/components/MegaMenuPanel.tsx` |
| Link list / proof | `MegaMenuLinkList.tsx`, `MegaMenuProof.tsx` |
| Hover controller | `Frontend/src/features/header/hooks/useMegaMenuController.ts` |
| Compact drawer | `Frontend/src/features/header/components/MobileNavigation.tsx` |
| Nav records | `Frontend/src/features/navigation/model/navLinks.ts` |
| Mega content | `Frontend/src/features/navigation/model/megaMenuContent.ts` |
| Tokens / font | `Frontend/src/styles/tokens.css`, `--font-nourd` |
| Proof logos | `Frontend/public/brands/logos/*` via `brandLogos.ts` |
| Service destinations | `Frontend/src/features/services/model/serviceItems.ts` |

## Brand mapping

- Panel: `--nav-bg-solid`, border `--nav-border`
- Accent dots / row underline: `--brand-cyan`
- Muted proof heading: `--nav-muted`
- Font: `--font-nourd` (existing)

## Deviations / blockers

1. **No Industry records** in the repository — Industry mega menu is not implemented. Only **Services** opens the screenshot-style panel.
2. Proof heading uses approved brand copy (“Stories worth telling, brands worth building”), not the source agency’s rating claim.
3. Proof grid uses the first 16 unique approved brand logos (not Digital Gravity client marks).

## Interaction contract (desktop ≥1200px, fine pointer)

- Open intent 80ms · switch 60ms · close 180ms
- Panel fade 250ms · close 200ms · row accent 500ms · chevron 4px / 250ms
- One active menu ID; hover bridge across the header–panel gap
- Label link navigates; adjacent disclosure toggles; Escape returns focus
