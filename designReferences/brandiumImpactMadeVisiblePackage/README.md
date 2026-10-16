# Brandium Impact Made Visible — Implementation Handoff

A production-minded reconstruction spec for the asymmetric horizontal outcome-card section at https://www.brandium.nl/, matched to the screenshot supplied by the user.

## Open these first

1. `design.md` — master strict design specification and pixel measurement targets.
2. `specs/cardByCard.md` — all eight card treatments, including the screenshot's four visible cards.
3. `specs/motionAndResponsive.md` — desktop rail, mobile swipe, reduced motion and QA.
4. `specs/adminContentSchema.md` — production data mapping and truth checks.
5. `cursorInstructions.md` — ready-to-paste instruction for Cursor.
6. `assetManifest.md` — assets, rights, crop, naming.

## Actual code also included

`src/components/impactMadeVisible/` contains a small CSS Modules + Next.js App Router implementation skeleton that **renders live props supplied by your project**. It does not contain false case-study statistics or copied brand photography. Adapt path aliases to your current app; keep it in your existing feature structure where possible.

## Reference screenshots

Open `referenceOnly/impactGeometryOverlay.png` to see precise positions from the provided reference frame. Crops of individual cards are strictly for internal visual comparison, not for use as production images.

## Installing into a repository

Unzip under `designReferences/brandiumImpactMadeVisiblePackage/` (or your repo's established reference folder). Pass `cursorInstructions.md` and `design.md` to Cursor. Do NOT place `referenceOnly/` in `/public` or copy unlicensed Brandium photography into your live site.

You need your own high-quality card images and actual metrics to make this section fully production ready. The card/component styling itself needs no external JS slider package or external font downloads.

## Precision disclosure

Reference website content and screenshot geometry were audited. The exact runtime movement (scroll-triggered vs marquee), its internal implementation, exact image URLs and font file names were not verifiable through available still/source-text inspection. Recommended animation parameters in the spec are explicitly approximate, not falsely reverse-engineered values.
