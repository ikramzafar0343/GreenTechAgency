# Brandium logo marquee — recreation guide

Reference: [Brandium](https://www.brandium.nl/), the **Family and Brands** section in your screenshot. Inspected 6 October 2026.

This guide covers the heading, logo layout, entrance animation, continuous movement, scroll interaction, responsive behavior, and original logo assets. Values marked **observed** come from the live page and its public styles/scripts. Values marked **recommended** are integration choices for your website.

## 1. The section to recreate

Use a white, full-width section with a compact centered eyebrow, a large two-line heading, and two horizontally moving rows of black logos. The spacious layout and opposing movement create the effect; there are no visible logo cards, borders, shadows, or separators.

Reference copy:

```text
✦ Family and Brands

Stories worth telling,
brands worth building
```

The heading remains stationary after its entrance. The logo rows continue moving. Logos are clipped cleanly at the left and right viewport edges; the reference has no gradient fade at the edges.

The black cursor mark and Windows activation watermark in your screenshot are not part of the section.

## 2. Layout and typography

The following desktop measurements were observed at a 1363 CSS-pixel viewport. Responsive units explain the slightly larger spacing in your screenshot.

| Element | Observed reference | Recreation guidance |
|---|---|---|
| Background | White | Use `#fff` across the complete section. |
| Text and logos | Black | Use `#000`; preserve the supplied logo pixels. |
| Font | `twklausanne`, weight 300 | Use TWK Lausanne if your project has a licensed copy. Otherwise use your existing neutral sans-serif and adjust wrapping. Fonts are not included in the asset pack. |
| Eyebrow | 17.6px, line-height 1.4, tracking −0.01em | Center it; keep the star on the same line. |
| Eyebrow → heading | 8px | Keep the relationship compact. |
| Heading | 54.52px, line-height 1.1, tracking −0.047em | Desktop size effectively equals `4vw`; approximately 63px at 1575px wide. |
| Heading alignment | Centered, two lines | Break after the comma at desktop widths. Allow additional wrapping on narrow screens. |
| Heading → marquee wrapper | No separate large gap | The first row's cell padding and margins create the visual whitespace. |
| Logo cell | 160px wide; 32px inner padding | With border-box sizing, the image content is at most 96px wide. |
| Cell margins | `2vw` vertically, `3vw` horizontally | Horizontal center-to-center spacing is `160px + 6vw`. |
| Row height | Approximately 176px | Two touching row wrappers, with whitespace inside each row. |
| Row count | Two | Keep both rows full width. |
| Visible logos | Roughly 5–6 per row | Partial logos at both edges are intentional. |

At 1575px wide, the observed sizing produces approximately 255px between logo centers and 184px between row centers. This closely matches your screenshot.

**Recommended section spacing:** start with 80–100px above the eyebrow and 64–96px below the rows on desktop, then adjust to the neighboring sections. These outer paddings are integration values, not a measured standalone section height. Avoid a fixed height or `100vh`.

### CSS scaffold

This is an independently written layout scaffold, using the reference measurements. Render the two row groups from the asset manifest described below. The animation controller supplies transforms on `.brand-scroll-layer` and `.brand-track`.

```css
.brand-family {
  --family-font: "TWK Lausanne", Arial, sans-serif;
  --logo-cell: 10rem;
  --logo-padding: 2rem;
  --logo-margin-x: 3vw;
  --logo-margin-y: 2vw;
  background: #fff;
  color: #000;
  padding-block: clamp(4rem, 6vw, 6.25rem) 5rem;
}

.brand-family *,
.brand-family *::before,
.brand-family *::after { box-sizing: border-box; }

.brand-heading {
  width: 94%;
  margin-inline: auto;
  text-align: center;
  font-family: var(--family-font);
}

.brand-eyebrow {
  margin: 0 0 .5rem;
  font-size: 1.1rem;
  line-height: 1.4;
  font-weight: 300;
  letter-spacing: -.01em;
}

.brand-title {
  margin: 0;
  font-size: 4vw;
  line-height: 1.1;
  font-weight: 300;
  letter-spacing: -.047em;
}

.brand-title-line { display: block; }
.brand-title-mask { overflow: hidden; }

.brand-row {
  width: 100%;
  overflow: hidden;
}

.brand-scroll-layer {
  width: 120%;
  margin-left: -10%;
  will-change: transform;
}

.brand-track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.brand-group {
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  list-style: none;
  margin: 0;
  padding: 0;
}

.brand-logo {
  flex: 0 0 var(--logo-cell);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--logo-padding);
  margin: var(--logo-margin-y) var(--logo-margin-x);
}

.brand-logo img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

@media (max-width: 990px) {
  .brand-title {
    font-size: 2.2rem;
    letter-spacing: -.03em;
    line-height: 1.15;
  }
  .brand-eyebrow { font-size: .9rem; }
  .brand-heading { width: 95%; }
}

@media (max-width: 479px) {
  .brand-family { padding-block: 3.5rem; }
}
```

The scaffold uses the reference's mobile heading size and logo cell width. Its mobile line-height of 1.15 and outer padding are recommended values. Keep the section outside any narrow page container; constrain only its heading. This avoids a breakout using `100vw`, which can introduce horizontal page overflow when a scrollbar is present.

## 3. Heading entrance

The reference combines three effects. The finished appearance is black text; the lime green is a brief entrance accent.

| Layer | Observed animation |
|---|---|
| Eyebrow | Words rise from `translateY(110%)` to zero through an overflow mask; 1.5s per word, 0.2s stagger. Starts when its top reaches 90% of the viewport height. |
| Heading lines | `yPercent: 100`, `rotateX: -105`, `skewY: -2`, `scale: .8`, hidden → zero translation/rotation/skew, scale 1, visible. Uses `power4.out`, a 0.1s delay and 0.07s line stagger. |
| Heading characters | Hidden gray `#ddd` → visible lime `#d2ff00` over 0.5s → black over 0.5s. Characters begin 0.01s apart, using linear color interpolation. |

The heading starts when its top reaches **89% of the viewport height**. Its color sequence runs once. The eyebrow's custom curve is equivalent to `cubic-bezier(.9, .1, .1, 1)`.

For the exact synchronized heading timing, let `N` be the number of animated characters and `L` the number of rendered lines:

```text
characterSequence = 1.0 + 0.01 × (N − 1) seconds
lineDuration = max(0.1, characterSequence + 0.25 − 0.1 − 0.07 × (L − 1))
```

**Implementation guidance:** wait for your chosen font before measuring/splitting text. Use one coordinated controller for the line and character effects so separate split operations do not destroy each other's elements. After the reveal, keep the title visible and recalculate wrapping on resize without replaying it. If you omit the brief green character sweep, describe the result as an adapted version of the reference.

Render the full heading as one accessible `h2`. Decorative character/line wrappers must not cause repeated or fragmented screen-reader announcements. Use a paragraph for the eyebrow rather than adding an extra heading level.

## 4. Continuous logo movement

There are **25 source logo images in each row**, arranged in a different order. Each original sequence is duplicated twice, producing **three equal groups per row**. The same artwork repeats, but the repeated copies must stay invisible to assistive technology.

### Observed motion settings

| Setting | Reference value |
|---|---|
| Upper row configured direction | Right |
| Lower row configured direction | Left |
| Base speed setting | 25 |
| Repeated copies | Original + 2 copies |
| Loop easing | Linear |
| Scroll movement setting | 10 |
| Scroll layer width | 120% |
| Scroll layer left margin | −10% |
| Initial loop progress | 10% |

The speed value **25 is not a fixed 25-second loop**. The reference calculates one sequence's duration from its measured width:

```text
G = width of one complete logo group, including every cell margin
W = viewport width

multiplier = 0.25 when W < 479
             0.5 when 479 ≤ W < 991
             1.0 when W ≥ 991

duration = 25 × (G / W) × multiplier
```

At the inspected 1363px viewport, `G ≈ 6044px`, so one loop takes approximately **111 seconds**, moving at approximately **55px per second**. Applying `25s` to the whole 25-logo group would make it much too fast.

### Seamless loop implementation

1. Render a complete sequence with fixed cell sizing. Give images their intrinsic `width` and `height` attributes from the manifest so loading cannot change the row geometry.
2. Measure one sequence after layout. It must be wider than the visible row plus the horizontal scroll allowance. The supplied 25-logo sequence comfortably meets this requirement.
3. Append two identical visual copies. Keep the spacing between groups identical to the spacing between ordinary items.
4. Animate the shared track transform at constant speed. A loop reset moves exactly **one group width**, never the width of all three groups.
5. Recalculate on viewport/container resize and preserve normalized progress. Clean up animation loops, observers, and duplicate groups on unmount.

Do not animate `left`, use a CSS transition on every frame, or update React state on each animation frame. GSAP or a single `requestAnimationFrame` controller can drive transforms directly. The reference uses GSAP and ScrollTrigger; its text effects also use SplitText and CustomEase.

## 5. How scrolling changes the motion

Two independent transforms are required: one for continuous looping, another for the scroll position. Applying both to the same element will cause one animation to overwrite the other.

| Behavior | Upper row | Lower row |
|---|---|---|
| After scrolling down through the section | Moves right | Moves left |
| After scrolling up through the section | Moves left | Moves right |
| Additional scroll displacement | −10vw → +10vw | +10vw → −10vw |

The movement retains the last direction when the user stops scrolling. Scroll displacement progresses from the row's top entering the viewport bottom to its bottom leaving the viewport top. The reference uses immediate scroll scrubbing with no easing on this displacement.

The initial page-load phase can differ from your screenshot because the sequence is already moving and changes direction with scrolling. Judge the recreation by spacing and movement, not by which exact logo occupies a particular coordinate.

An independent implementation can use this animation model:

```text
phase = normalized loop position, between 0 and 1
direction = +1 for right, −1 for left
phase = modulo(phase + direction × elapsedSeconds / duration, 1)

trackX = −G + phase × G

p = clamp((viewportHeight − rowViewportTop) /
          (viewportHeight + rowHeight), 0, 1)

upperScrollX = (−0.10 + 0.20 × p) × viewportWidth
lowerScrollX = (+0.10 − 0.20 × p) × viewportWidth
```

Start the upper row at `phase = .1`, and offset the second row with its own sequence. Use a positive modulo operation so moving left never produces a negative phase. Apply `trackX` to the track and `ScrollX` to its outer scroll layer. Three identical groups make a one-group wrap visually continuous.

## 6. Responsive and accessible behavior

For a close match, keep the logo cells 160px wide across breakpoints and allow fewer logos to be visible on mobile. The source uses the same `2vw 3vw` cell margins. Maintain both rows and avoid shrinking all logos just to fit more on a phone.

The following are **recommended additions for your implementation**:

- Provide a small keyboard-accessible **Pause logos / Play logos** button. Pausing must stop both the loop and scroll displacement. Hover-only pause is not a substitute for a control.
- Respect `prefers-reduced-motion`: skip all entrance transforms and green sweeps, show the final black heading immediately, and replace the moving rows with one static responsive grid of the source assets.
- Give each original logo a meaningful name. Set visual copies to `aria-hidden="true"` with empty image alternatives. Since the same assets appear in both rows, expose one accessible sequence of names rather than reading them twice.
- The reference logos are noninteractive. Keep them as images unless you have useful, approved destinations to link to. Do not create focusable links inside hidden copies.
- Pause animation while offscreen or while the document is hidden. Resume without a large time jump.
- Keep content visible when JavaScript fails. Apply initial hidden animation states only after successful initialization.
- Preserve visible keyboard focus and stop page-level horizontal overflow.

## 7. Original logo assets and sharpness

The accompanying `brandium-logo-assets.zip` contains **25 transparent PNG files downloaded directly from the image URLs used in this section**, plus a manifest and both row orders. The PNG bytes are unchanged.

These are the source images used by Brandium, not screenshot crops. Their native widths range from **270px to 2560px**. The section did not provide SVG versions of these particular images, so the pack does not claim they are vectors or universal print-resolution originals.

The reference displays the full PNG canvas at about **96 CSS pixels wide**. Even a 270px file provides approximately **2.8 image pixels per CSS pixel** at that size, which is sufficient for a sharp 2× display. For a strict 3× target, keep those smaller files at or below 90 CSS pixels, or replace them with a genuine larger/vector brand asset.

Use this rule when enlarging:

```text
maximum CSS width = native pixel width / target device-pixel ratio
```

Preserve internal transparent padding for the closest match. Do not stretch logos to equal heights, auto-trace them into approximate SVGs, artificially upscale them, or apply a blanket opacity/grayscale filter. Their differing shapes and visual sizes are part of the original composition.

Copy the PNGs into your own project's public asset folder and reference those local files. Use the manifest URLs for provenance rather than hotlinking the production website to Brandium.

These are Brandium's reference logos. Only present them as your clients or partners when that relationship is real; use your own client assets for a client-credibility claim.

### Pack contents

| Path | Purpose |
|---|---|
| `logos/*.png` | 25 original transparent images |
| `manifest.json` | Original URL, native dimensions, byte size, checksum, and display notes |
| `manifest.csv` | The same asset inventory in spreadsheet-friendly form |
| `row-order.json` | The two original sequence orders |
| `README.md` | Asset-use and quality notes |
| `brandium-logos-design.md` | This guide |

## 8. Acceptance checklist

- The white section has a centered eyebrow and a light-weight, tightly tracked two-line heading.
- Both logo rows span the viewport; roughly six logos per row are visible on a wide desktop screen.
- Logos have generous whitespace and no visible card treatment.
- Both rows move continuously at a calm speed; scrolling reverses their directions together while keeping them opposed.
- The additional ±10vw scroll movement is applied to a separate wrapper.
- Observe at least one complete loop or temporarily increase playback speed: there must be no seam, blank area, or logo jump.
- Resize to approximately 1440px, 768px, and 390px widths; no page-level horizontal scrollbar appears and the heading remains readable.
- Reduced-motion mode, the pause button, keyboard focus, and image alternatives work.
- Images remain sharp at the intended display size and load from your own project assets.

## 9. Prompt to hand to a developer or coding assistant

> Recreate the Brandium Family and Brands section using this guide and the supplied asset pack. Use a white full-width section, a centered star eyebrow, a two-line light-weight black heading, and two spacious rows of original black PNG logos. Use 160px cells with 32px padding and 2vw/3vw margins. Preserve the two orders in row-order.json. Repeat each group three times and animate by one measured group width with a linear loop; derive duration from the documented speed formula. Make the rows move oppositely, reverse them with scroll direction, and apply the additional ±10vw scroll displacement on separate wrappers. Reproduce the masked eyebrow rise and the heading's line rotation/scale reveal with its brief lime-to-black character sweep. Include responsive wrapping, a pause control, a static reduced-motion grid, accessible original names, and hidden visual duplicates. Use local assets from the pack, preserve their proportions, and follow the guide's quality limits. Integrate this as one section in the existing site without changing its header or other sections.

## Reference sources

- [Brandium homepage](https://www.brandium.nl/): section copy, image URLs, both original row orders, and inline marquee initialization.
- [Global animation script](https://www.brandium.nl/wp-content/cache/min/1/assets/js/global-1.11.js?ver=1791226075): eyebrow and heading entrance values.
- [Brandium styles](https://www.brandium.nl/wp-content/cache/min/1/styles-brandium-v1.4.css?ver=1791226641) and the homepage's inline CSS: typography and marquee layout.
- [Homepage layout CSS](https://www.brandium.nl/wp-content/uploads/elementor/css/post-12024.css?ver=1791227610): heading container widths and responsive layout.
- Your supplied screenshot: final composition, whitespace, and two-row appearance. The guide uses live measurements for motion settings that a still screenshot cannot show.
