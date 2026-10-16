# Brandium typography reference audit

Reference URL: https://www.brandium.nl/

Inspected 9 October 2026 in Asia/Karachi (8 October 2026 UTC). Evidence consists of the live page, downloaded public HTML/CSS, a rendered browser inspection, and computed styles at a 1363 × 936 CSS-pixel viewport. Root size was 16px.

This file records observations. Proposed sitewide decisions are in `typographyDesign.md`.

## Font evidence

The primary stylesheet declares normal static WOFF2 faces named `TWKLausanne`, at weights 250, 300, 400, and 500. Their source basenames are `TWKLausanne-250.woff2`, `TWKLausanne-300.woff2`, `TWKLausanne-400.woff2`, and `TWKLausanne-500.woff2`.

No font binaries were downloaded or included in this package.

Sampled heading, paragraph, navigation, and project-title elements computed to a Lausanne family spelling. The browser reported font loading complete and its font availability check for Lausanne 250 succeeded. This supports the CSS identification; the package does not include a per-glyph DevTools rendered-font capture.

Work Sans is configured in theme tokens and a Google Fonts stylesheet is linked. Fragment Mono has font-face declarations. Neither appeared as the computed family of the sampled primary text. The CTA's outer anchor has an unrelated family declaration, but its visible label has its own Lausanne declaration. Identify typography at the text-bearing element, not only its wrapper.

The body element itself reported a default serif family, while its text descendants are explicitly styled with Lausanne. The supplied base CSS consolidates the intended family on the site root instead of reproducing this inconsistency.

## Measured desktop samples

No reference marketing copy is reproduced here; role names identify the inspected elements.

| Element / reference selector | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- |
| Homepage H1, `.heading__main` | 68.15px | 250 | `normal` | -3.4075px / -0.05em |
| Hero paragraph, `p.content-inner` | 16px | 250 | 24px / 1.5 | `normal` |
| Section H2, `.heading__2` | 54.52px | 300 | 59.972px / 1.1 | -2.56244px / -0.047em |
| Section eyebrow, `h4.subtitle` | 17.6px | 300 | 24.64px / 1.4 | -0.176px / -0.01em |
| Small philosophy paragraph | 14.4px | 250 | 23.4px / 1.625 | `normal` |
| Main navigation anchor | 16px | 250 | 24px / 1.5 | `normal` |
| Header CTA label, `.btn-link__active` | 17.6px | 250 | 17.6px / 1 | -0.36px, inherited |
| Project title, `.project__title` | 21.808px | 250 | `normal` | `normal` |
| Service-column H3 | 16px | 250 | 24px / 1.5 | `normal` |
| Journal card H2, `.layout-grid__card-title` | 35.2px | 250 | 42.24px / 1.2 | -0.8448px / -0.024em |
| Journal metadata, `.layout-grid__card-subtitle` | 12px | requested 200 | 13.2px / 1.1 | +0.6px / +0.05em |
| Impact-card paragraph | 22.4px | requested 200 | 32px | -0.32px |

`normal` line height is deliberately not converted to an invented pixel value. A requested 200 does not prove a 200 file exists; the declared font-face set is recorded above.

## Source-defined responsive rules

The mobile entries below were read from CSS. They were not measured in a mobile browser during this audit.

| Reference rule | Published behavior |
| --- | --- |
| Hero desktop | `clamp(5vw, 2.8vw, 2.8rem)`, 250, tracking -0.05em, normal line height |
| Hero at max-width 980px | `clamp(9vw, 2.8vw, 2.8rem)`, 250, tracking -0.045em |
| Main H2 at min-width 990px | `clamp(4vw, 2.8vw, 2.8rem)`, 300, tracking -0.047em, line height 1.1 |
| Main H2 at max-width 990px | 2.2rem, 300, tracking -0.03em, normal line height |
| Eyebrow at max-width 990px | 0.9rem, 300, tracking -0.01em, line height 1.4 |
| Project title | Desktop starts at 1rem; small-screen rule starts at 1.1rem; fluid term 1.6vw; maximum 1.8rem |

The hero's preferred value is below its minimum; at the inspected width, its 5vw minimum controls the output. Some reference expressions place the minimum above the stated maximum at large widths. CSS gives the minimum precedence; this is not a syntax error or a real upper cap.

The production adaptation therefore uses a conventional rem minimum, mixed rem/vw preferred value, and larger rem maximum. It also avoids copying the reference's 980px/990px breakpoint discontinuities into the project.

## Deliberate adaptation decisions

- Use one canonical family and explicit weight mapping.
- Use a shared responsive type scale across all project routes.
- Keep body text at 16px and metadata at 13px in the supplied roles.
- Specify stable unitless heading line heights rather than assuming `normal` is identical across editions.
- Keep the project's existing color tokens; do not copy low-opacity paragraphs.
- Use readable article and application roles rather than applying marketing display sizes everywhere.
- Keep commercial font acquisition separate from this reusable CSS package.

## Primary source URLs

Observed public resources, accessed during the audit:

1. [Homepage and inline typography rules](https://www.brandium.nl/)
2. [Main stylesheet](https://www.brandium.nl/wp-content/cache/min/1/styles-brandium-v1.5.css?ver=1791491163)
3. [Hero and project styles](https://www.brandium.nl/wp-content/cache/min/1/assets/css/intro-1.0.css?ver=1791491163)
4. [Navigation and footer styles](https://www.brandium.nl/wp-content/cache/min/1/assets/css/navi-v1.3.css?ver=1791491163)
5. [Shared component typography](https://www.brandium.nl/wp-content/cache/min/1/assets/css/utilities-v1.2.css?ver=1791491163)
6. [Theme typography configuration](https://www.brandium.nl/wp-content/uploads/elementor/css/post-70.css?ver=1791335083)
7. [Official TWK Lausanne page](https://weltkern.com/typefaces/twk-lausanne)
8. [Official font licensing terms](https://weltkern.com/licensing-terms)

The HTML and CSS were retrieved directly when the web text reader could not display CSS resources. Versioned stylesheet URLs may change when Brandium rebuilds its cache. This is a point-in-time audit of the homepage and its linked styles, not an assertion about every page on the domain.
