# Impact Made Visible — Exact-Look Design Specification

**Reference:** https://www.brandium.nl/  
**Reference section:** `✦ Impact made visible`  
**Source screenshot:** `referenceOnly/impactSectionReference.png` (user-supplied)  
**Implementation target:** existing production Next.js/React project, using its current design tokens and typography  
**Spec version:** 1.0 • 2026-10-09

> **Fidelity note:** Page text and visual geometry were checked against the Brandium homepage and the supplied 1591 × 635 screenshot. Motion behavior, easing, original CSS declarations, animation timings, and image source files cannot be conclusively recovered from a still screenshot or text rendition of a website. Motion values below are deliberate reproduction targets—not claims about Brandium's internal code.

## 0. Non-negotiable Cursor instruction

Build the **same visual composition**: a full-bleed, horizontally extending strip of differently sized, TOP-ALIGNED, rounded editorial cards with a clean white canvas. **DO NOT turn this into** a generic testimonial slider, a uniform bento grid, a swiper with bullets, or a standard three-column layout. Keep the exact visual hierarchy shown in the reference. Respect my application's current font, palette, spacing tokens, page structure, navigation and production rules. Do not modify unrelated sections. Create no fake statistics, case studies, placeholder graphics, invented reviews, temporary architecture, demo data, or duplicated utilities.

## 1. What is actually visible (reference-backed)

The live homepage labels the section **Impact made visible** and uses this title: **From bold ideas to results that truly matter**. Its introduction explains that creative identity and digital experiences translate into measurable impact. It includes a metrics card `+346% contact requests / after bold brand identity`, a photographic proof card `Brand repositioning unlocked €165M in growth with a +480% uplift`, and a conversion card ending in **Work with us**. These are reference-only examples, never our company's claims.

In the user's screenshot, the row at 1591px viewport width shows:

| Reference object | Approx. x / y | Reference footprint | Appearance |
|---|---|---|---|
| Mint photographic card (partially clipped at viewport left) | x=0…377 / y=77…629 | visible 377×552; inferred full card ~459×552 | Mint backdrop; two hands; editorial black text near top-left |
| Dark statistic card | x=394…852 / y=77…332 | **459×255** | #1b1b1b black; 2 lines at top-left; lower ~65% empty |
| Portrait result card | x=868…1327 / y=77…629 | **459×552** | Edge-to-edge cropped blue-toned image; white caption bottom-left |
| Neutral conversion card (clipped at right) | x=1344…1590 / y=77…434 | visible 247×357; expected ~459×358 | #f3f3f3 neutral; text top-left; underlined arrow link near bottom |

**Critical measurements:** horizontal gap ~16px; corner radius ~10px; dark card top padding ~32px; image caption inset ~32px; every card starts at y≈77; card heights are intentionally unequal. The small black dot near the top-left of the screenshot is **not** part of the cards; do not recreate it.

### 1.1 Visual rules

1. Outer page area is light, uncluttered and free of drop shadows.
2. Desktop carousel/card rail extends to the viewport edges; it is not boxed into the headline container.
3. Use one horizontally continuous row; no card stacking inside the rail on desktop.
4. All card tops align; **do not** center-align short cards vertically or stretch short cards to the tall-card height.
5. Each card has its own intrinsic height class: `tall`, `medium`, or `compact`.
6. Photo cards use `object-fit: cover` with deliberate art-directed `object-position` per image.
7. Type is neutral editorial sans serif, inherited from the project. Do not download Brandium fonts or replace site-wide typography.
8. Avoid gradients, glow, glass effects, card outlines, shadow, tilting, overscale hovers, and scale-on-scroll.
9. Maintain generous negative space inside dark metrics and neutral CTAs.
10. When the rail exits the viewport, there must be **no horizontal page overflow**.

## 2. Section hierarchy

```text
impactSection                         section[aria-labelledby]
├── sectionIntro                      max-width editorial container
│   ├── eyebrow                       optional small ✦ + label
│   ├── heading                       h2, large editorial heading
│   └── description                   concise paragraph, not a massive block
└── fullBleedViewport                 width: 100vw / clipped overflow
    └── marqueeTrack                  flex, max-content, single horizontal row
        ├── primaryGroup              seven/eight unique cards from CMS in configured order
        │   ├── imageCardTall          hands / own project photo
        │   ├── metricCardCompact      hard metric + supporting statement
        │   ├── imageCardTall          outcome project image + bottom caption
        │   ├── ctaCardMedium         brand promise + underlined action
        │   ├── heritageCard           concise brand history / capability
        │   ├── locationCard           editorial geographic statement
        │   ├── launchedBrandsCard     real count only
        │   └── teamCard              multi-disciplinary capabilities
        └── decorativeRepeatGroup      exact repeated cards, aria-hidden, untabbable
```

**Note:** The home page text extraction repeats a sequence of seven statements, supporting a repeated rail pattern. The eighth *mint hands* visual is visible in the screenshot, while its complete overlay wording cannot be verified there. Treat eight as a configurable recommended set, not a verified count of distinct source cards.

## 3. Geometry and responsive tokens

| Token | Desktop target | Adaptation |
|---|---:|---|
| `--impactCardWidth` | `459px` | `clamp(320px, 28.9vw, 459px)` for large desktop |
| `--impactGap` | `16px` | `12px` on mobile |
| `--impactCardRadius` | `10px` | 10px all widths |
| `--impactHeightTall` | `552px` | 460px on mobile |
| `--impactHeightMedium` | `358px` | 340px on mobile |
| `--impactHeightCompact` | `256px` | 240px on mobile |
| `--impactCardInset` | `32px` | 24px on mobile |
| `--impactCanvas` | inherited page background / white | site token |
| `--impactMetricBg` | visually `#1b1b1b` | optionally map to existing near-black brand token |
| `--impactSurfaceMuted` | visually `#f3f3f3` | optionally map to existing muted surface token |
| `--impactTextDark` | visually `#222222` | existing text token |
| `--impactTextLight` | `#ffffff` | accessible contrast |

**Tablet, 768–1023px:** card width 360–400px; tall 500px; compact 248px; medium 350px; preserve asymmetry and horizontal presentation.  
**Mobile, ≤767px:** card width `min(84vw, 360px)`, heights 460 / 340 / 240; manually swipe with native overflow and proximity/mandatory snapping; do not force desktop autoplay on touch.  
**Reduced motion:** a manually horizontally scrollable rail with no moving transforms.

The CSS implementation in `src/components/impactMadeVisible/impactMadeVisible.module.css` codifies this. When the real project has established tokens, map CSS custom properties on the enclosing section rather than hardcoding a new brand design system.

## 4. Eight individually specified cards

See **`specs/cardByCard.md`** for a separate visual, content, positioning, hover, accessibility and responsive contract for every card type, including screenshot-matched cards 01–04 and complementary cards 05–08 from Brandium's extracted live content.

**Cards 01–04 must match the screenshot composition and sequence** if you want the referenced visible frame. Cards 05–08 support the same visual language and can vary with approved CMS content. Every visible claim or figure must have a genuine, user-provided source.

## 5. Heading and introductory content

- Eyebrow: short text such as `Impact made visible`, set small with subtle icon (optional); no need to use Brandium trademark.
- H2: expressive, multiline editorial scale, line-height approximately `0.98–1.08`; prefer existing heading font.
- Description: approximately 2–4 short sentences, left aligned, max width ~780px. Use the project's actual services, results and outcomes.
- Body after heading to rail: `clamp(40px, 5vw, 80px)`; do not wedge the cards directly under the heading.
- Intro container: existing site's horizontal gutter / content max width; **rail itself is full bleed**.
- Heading copy must be semantic (`h2`), not baked into an image. Use descriptive text for accessibility/SEO/AEO; avoid keyword stuffing.

## 6. Strict behavior and motion

1. Desktop suggested effect: **continuous linear horizontal movement** of one repeated row, from right to left; a reasonable reproduction target is ~`58px/second`. This is an approximation, not a recovered Brandium measurement.
2. Seamlessness: render TWO identical groups, each with equal card sequence and right-edge gap, animate `translateX(-50%)` on the combined track. No visible reset jump.
3. Pause while the pointer hovers the section's rail or keyboard focus is inside it.
4. Pause while offscreen via IntersectionObserver to reduce wasted work.
5. Do not auto-scroll on mobile; expose touch momentum swipe and scroll snap.
6. When `prefers-reduced-motion: reduce`, autoplay MUST stop and native horizontal scrolling MUST work.
7. Never rotate or elevate the cards, add 3D stacking, or hide captions on hover.
8. Image hover is a subtle optional crop zoom ≤1.025 over 500–650ms, **only** if the project already uses this interaction. Exact static reference uses no required zoom.
9. No automatic metric count-up unless your site's existing motion vocabulary calls for it; reference shows stable text values.
10. No arrows, dots, pagination, indicators or progress bars in the screenshot; do not introduce them.

**Interaction caveat:** Desktop autoplay is a plausible reconstruction from the duplicated textual sequence; not independently verified as the real site's exact interaction. If live side-by-side comparison reveals scroll-linked dragging instead of continuous autoplay, preserve the exact card styling and replace only the rail transport mechanism.

Read `specs/motionAndResponsive.md` for motion QA and edge cases.

## 7. Image asset contract

- User's screenshot is provided in `referenceOnly/` and cropped into four individual inspection references.
- Those crops are **inspection / internal design references only**; NEVER ship the screenshots as production card backgrounds.
- Replace with owned or properly licensed photos uploaded to the existing project media system.
- Preferred photograph formats: AVIF/WebP; practical master ≥`1200 × 1450` for portrait crops, ≥`1200 × 1000` for broad detail shots, with responsive delivery by Next/Image.
- Photographer's crop should keep the subject away from the caption safe area (bottom 90–140px).
- No forced transparent PNGs for photographic cards; no opaque screenshot as a shortcut.
- Define genuine descriptive alt text for meaningful images; omit redundancy when caption is an equivalent description.
- Each card image requires an `objectPosition` or safe default (`center`).
- Register actual remote image hosts in Next.js `images.remotePatterns` only when required. Do not use `unoptimized` as a blanket workaround.

See `assetManifest.md` for the full asset list and recommended naming.

## 8. Existing project integration — immutable boundaries

- Discover **existing project routing, page section composition, design tokens, media library, CMS and motion packages first**.
- Add the section at the user-specified landing-page position; don't reorder existing sections.
- Reuse existing font families and heading scale unless it breaks reference proportions.
- Reuse `next/image` and `next/link` according to the installed Next.js version and current architecture.
- Only create `src/components/impactMadeVisible` **if no compatible feature-based folder exists**; move files into the project's established feature structure where appropriate.
- Scope styles to the component; never edit site-wide `h1`, `p`, `a`, `img`, `body` or `*` rules.
- Prefer simple CSS for the marquee over adding Swiper, GSAP or Framer Motion solely for this effect.
- Keep all cards configurable through real data; do not embed example marketing results in code.
- Reuse existing admin-managed media and case study entities if they exist; do not build a parallel fake admin subsystem.
- Maintain stable record keys, validate paths/URLs, protect user-supplied media, and avoid layout shifts.
- Follow codebase's production rules: no temp TODO implementation, no hidden fallbacks, DRY, KISS, focused components, SOLID where applicable, <300 lines per source file.

## 9. Data source and editorial truth

If there is already a CMS/admin panel, load a **published** `impactSection` record with a sorted list of `impactCards` carrying `id`, `kind`, `size`, `order`, `isPublished`, accessible content, optional image, and optional CTA. Show only real approved metrics and studies. If a reference card has no real matching content, omit that card rather than fabricating statistics. Rebalance sequence and maintain alternating card heights rather than filling with generic placeholders. See `specs/adminContentSchema.md`.

## 10. Hard acceptance criteria for Cursor

- [ ] Heading and intro are present, semantic and consistent with current site fonts.
- [ ] At 1591×635, rail shows ~459px cards, 16px gaps and top-aligned mixed heights.
- [ ] Compact metric card looks ~459×256, dark with top-left 32px content.
- [ ] Tall photographic result card looks ~459×552, caption white at bottom-left 32px.
- [ ] CTA card looks ~459×358, neutral surface, underlined text-arrow at bottom.
- [ ] Cards are flat with 10px rounded corners; no outlines, no shadows.
- [ ] No layout stretching: compact cards stay compact and the whitespace below is white.
- [ ] Horizontal rail reaches screen edges; document itself cannot scroll sideways.
- [ ] Text never disappears beneath images; color contrast remains accessible.
- [ ] Full-bleed images fill card and crop intentionally without distortion.
- [ ] Infinite desktop loop has no seam, if motion mode is enabled.
- [ ] Mobile is swipeable and reduced-motion works without animation.
- [ ] Cloned cards are `aria-hidden` and duplicate links are untabbable.
- [ ] Reuse site colors / typography and real CMS data; no fake results or reused Brandium images.
- [ ] Tests: 375, 390, 768, 1024, 1440 and 1591px; mouse, touch and keyboard.
- [ ] All screenshots visually compare against reference before marking task complete.

## 11. Install / handoff

1. Put this whole `brandiumImpactMadeVisiblePackage` folder at the **project root under `designReferences/`**, retaining names and references.
2. Give Cursor `cursorInstructions.md`, this `design.md`, and the `referenceOnly/impactSectionReference.png` file.
3. Let Cursor inspect existing CSS tokens, section architecture, data model and motion dependencies; do not copy source files without adapting path aliases.
4. Copy/adapt the `src/components/impactMadeVisible/` files to the appropriate feature folder if the existing stack is Next.js App Router. These are dependency-light **reference components**, not a claim to replace your project's architecture.
5. Supply your **real approved photo assets** and metrics through admin/CMS.
6. Run typecheck, lint, build, Lighthouse/performance pass and visual regression checks; compare side by side to original screen.

Read the accompanying docs before changing behavior. If a reference asset, verified metric or CMS field is unavailable, stop and flag that specific item instead of inserting a fabricated substitute.
