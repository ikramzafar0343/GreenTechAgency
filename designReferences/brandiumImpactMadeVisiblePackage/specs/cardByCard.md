# Card-by-Card Specification — Impact Made Visible

This is the strict card contract referenced by `../design.md`. The **first four** cards are based on the user's screenshot. Cards **five to eight** are additional editorial variants suggested by text appearing in the live page; their exact visual geometry is NOT visible in the supplied cropped screenshot, so they inherit the measured design system instead of claiming a pixel-perfect source layout.

## Shared anatomy — ALL cards

| Detail | Rule |
|---|---|
| Root | `article`, optionally with a distinct inside link |
| Width | desktop reference `459px`, mobile `min(84vw, 360px)` |
| Top alignment | `align-self: flex-start`, all cards same y start |
| Corner radius | `10px` |
| Gap to next | desktop 16px, mobile 12px |
| Overflow | hidden, with image scaled/cropped beneath copy |
| Shadow/stroke | none |
| Content inset | 32px desktop, 24px mobile |
| Typography | current site's sans and weights; reference looks like clean geometric sans |
| Hover | preserve card rectangle; no dramatic scale/rotation |
| Text sizing | key copy ~22–24px desktop, line-height 1.3–1.4, tracking -0.02…-0.04em |
| Interaction | only clickable if a real destination exists; visible focus ring on actual links |
| Metadata | persistent `id`, `kind`, `size`, `sortOrder`, `isPublished` |
| Empty content | remove card if not publishable; never show generic filler |

## Card 01 — Mint photographic / creative execution

**Screenshot file:** `../referenceOnly/card01MintPhotoReference.png`  
**Reference footprint:** approximately `459×552` before left-edge clipping.  
**Role:** visual / emotional lead-in preceding a proof statistic.

**Layers (back to front):** mint image, human hands reaching toward each other, small dark editorial text in upper-left. The left clipping is produced naturally by the moving full-bleed rail: **do not permanently crop the card to 377px wide**.

**Design lock:** muted mint background ~`#d8eee6` (visible reference only), no border or shadow; tall 552px; subject image covers entire card; approximately 10px corners. Keep photo unobstructed at the central hand intersection. If overlay text is used, keep it in a bounded upper-left region with a legible dark foreground.

**Content guidance:** only use licensed/owned photography with relevant text drawn from our real service/case-study; reference fragments in screenshot are incomplete, do not invent their exact original wording. Recommended content fields: `image.src`, `image.alt`, `image.objectPosition`, `heading?`, `supportingCopy?`, `href?`.

**Motion:** moves as a unit with rail; no independent reveal required. Optional tiny image zoom on hover only if established elsewhere in the app. Mobile crop must preserve recognizable hand interaction.

**Accessibility:** meaningful photo receives genuine alt; overlay heading remains real HTML; no clickability unless it is a genuine work/case-study link.

## Card 02 — Dark compact KPI

**Screenshot file:** `../referenceOnly/card02DarkMetricReference.png`  
**Exact visible reference:** x≈394..852, y≈77..332 → `459×255`.

**Content hierarchy:**

- Line 1: `+346% contact requests` in bright white, approximately 22px, medium weight.
- Line 2: `after bold brand identity` in gray, approximately 22px, medium weight.

**Reference wording describes Brandium, NOT us.** Replace both fields with a verified statistic and its short context.

**Design lock:** near-black `#1b1b1b` background, color white for primary, desaturated gray `#919191` secondary. Top-left inset ~32px; line gap ~0–3px; text block occupies top ~70px. Keep most of the card empty. No logo, badge, counters, progress bar, icon or call-to-action.

**Height:** `256px`, never tall. **No vertical centering.** Responsive size 240px on mobile.

**Motion:** static words; if whole rail moves, move as one card. Avoid number count-up that creates digit width jumps.

**Accessibility:** use clear HTML e.g. `<strong>` and `<span>`; if the metric is dynamic/updated, SSR latest approved value, not a flashing screen-reader live region.

## Card 03 — Tall photographic result proof

**Screenshot file:** `../referenceOnly/card03PortraitResultReference.png`  
**Exact visible reference:** x≈868..1327, y≈77..629 → `459×552`.

**Visual:** full-bleed blue-toned close portrait. Face oriented toward the **right**, edge of hair close to upper frame, denim jacket across lower half; text floats above lower-left jacket region.

**Text:** `Brand repositioning unlocked €165M in growth with a +480% uplift` (Brandium reference only); approximately 22px / 1.4 line-height, white; lower-left 32px; bottom 34–42px; lines wrap within ~400px.

**Design lock:** root `position: relative`; `<Image fill sizes>` as covering image; image layer `inset:0`; caption layer absolutely positioned at `left: 32px; right: 32px; bottom: 32px`; `z-index:1`; `color:white`; `text-shadow: none` unless a subtle accessible darkening is required on the owned photo. Do not place caption in a black floating box.

**Image safe area:** reserve lower-left ~150px for text; choose photography where caption remains legible naturally. Do not imitate brand-owned model/photo in production without rights. Content fields: image, caption, `captionContrast`/optional ultra-subtle bottom gradient if required, optional case-study URL.

**Motion:** same rail; no parallax, face morph, opacity flicker, video or 3D.

**Accessibility:** real caption text, descriptive image alt; if card is linked, the accessible name should express project/outcome rather than image file name.

## Card 04 — Neutral editorial conversion card

**Screenshot file:** `../referenceOnly/card04NeutralCtaReference.png`  
**Visible reference:** x≈1344..1590 (cut at screen right), y≈77..434; inferred `459×358` full card.

**Text at top:** `From canals to continents. We shape brands and build businesses that are ready to scale.` (Brandium reference only).  
**CTA at bottom:** `Work with us` plus clean right arrow, underlined with a single thin rule.

**Design lock:** background `#f3f3f3`; charcoal text `#2b2b2b`; inset ~32px; paragraph top aligned; link anchored bottom with flex column/`margin-top:auto`; link `display:flex`, arrow aligned right; underline visually extends under full CTA row (or at least label+arrow); no pill shape, button fill, solid border or shadow.

**Text sizing:** lead 22–24px, CTA 22px; CTA underline ~1px. `margin-top` large to preserve 100px+ breathing room. Target height 358px. CTA must route to the site's **existing** `/contact`, consultation or equivalent actual route; never create a fake path.

**Hover:** underline may subtly animate from left to right; arrow can translate 3–5px right. Duration 200–300ms; keep calm. **Keyboard focus:** visible outline/underline regardless of hover.

**Mobile:** no cropping or line truncation. If text grows, allow `min-height` instead of clipping.

## Card 05 — Heritage / longevity statement

**Reference content available on page:** `Making brands iconic and websites unforgettable since ...` (year shown elsewhere as 2014).

**Reference treatment:** exact photograph/color/footprint not visible in user screenshot. Use a `statement` card, `medium` or `tall`, with sparse large typographic messaging, small secondary detail at lower edge. If user has own verified founding year, show it; otherwise omit year.

**Suggested appearance within family:** `medium` / 358px, light brand surface, 32px inset, dark ink text. Do not invent a founder story.

**Accessibility:** informative readable sentence, no gratuitous animation.

## Card 06 — Global reach / location

**Reference content:** `Designed in Amsterdam, scaled globally`.

**For our project:** replace with accurate operating geography and service coverage; never state a physical office in a location that cannot be substantiated.

**Suggested appearance:** `tall` or `medium` photographic/statement card; concise line breaks, confident typographic hierarchy, 32px inset. Avoid pretending to own Amsterdam photography or a foreign location.

**Responsive:** keep line breaks natural with CSS; avoid hard `<br>` for fixed desktop-only breaks.

## Card 07 — Launched brand count

**Reference content:** `85+ brands succesfully launched since 2014` (source spelling retained here for audit only).

**For our project:** real verified count only; if unavailable, use qualitative proof statement without a number.

**Suggested appearance:** `metric` card `compact`, possibly alternate light/dark surface, 22–24px size, large blank lower region. Never turn the number into a giant 96px dashboard counter—the measured black KPI card uses restrained typography.

**Interaction:** number remains stable as rail moves.

## Card 08 — Multidisciplinary team

**Reference content:** `Multi-disciplinary team blending branding, design, and tech seamlessly`.

**For our project:** accurate service statement. If a photography-backed version is desired, source approved candid/team photography; otherwise make it a neutral `statement` card.

**Suggested appearance:** `medium`, black or neutral as alternating rhythm, text aligned top-left; lower whitespace gives variety.

**Do not** generate fictitious team portraits or credentials.

## Sequencing rules

1. Match screenshot order for the visible sequence: **01 mint photo → 02 black stat → 03 blue result → 04 neutral CTA**.
2. Keep 05–08 after the visible sequence or order as real CMS content requires.
3. Preserve alternating light/dark/photo surfaces and mixed height rhythm.
4. Two consecutive `compact` metric cards look wrong; insert media/CTA/story between them.
5. When a card is removed due to missing verified data, re-evaluate rhythm; never show an empty gray placeholder.
6. The repeated second group is decorative and must be identical visually to group one.

## Measured screenshot caveats

This screenshot is a **mid-carousel viewport**, not an image of the entire section including its title. Full image source URLs, DOM nesting, hover state, responsive breakpoints and scroll interaction were **not** observable from the still image. The dimensions above are precise visual reconstruction targets, not a claim of the site's authored CSS.
