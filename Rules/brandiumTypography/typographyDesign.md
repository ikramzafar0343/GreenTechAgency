# Sitewide typography design specification

Reference: [brandium.nl](https://www.brandium.nl/). Inspection date: 9 October 2026, Asia/Karachi. Package: `brandiumTypography`.

This document defines typography for the entire project: homepage, inner pages, services, portfolio, case studies, about, insights, contact, forms, navigation, footer, and authored application screens. Apply editorial display sizes only to suitable marketing content; application controls retain compact UI roles.

## 1. Required visual direction

Use one restrained sans-serif family, **TWK Lausanne**, to create the same broad typographic character as the reference:

- Light, open-looking letterforms at substantial display sizes.
- Sentence-case headlines with tight tracking and deliberate wrapping.
- Clear hierarchy through scale, line length, and spacing.
- Small, quiet navigation and labels alongside larger editorial headings.
- Regular and medium weights used selectively for controls, figures, and emphasis.

The typography must remain cohesive across routes. A service page, a portfolio card, and the footer must use the same shared tokens, even when their text sizes differ.

Keep the project's established colors, logo artwork, page structures, imagery, and existing interaction behavior. Typography changes may alter text wrapping and natural component height; resolve collisions without restructuring unrelated sections.

## 2. Confirmed font family and weights

| Item | Verified reference finding | Implementation decision |
| --- | --- | --- |
| Main family | `TWKLausanne` / `TWKlausanne` / `twklausanne` appear as CSS spelling variations | Use one canonical CSS family, `TWKLausanne` |
| Light | Static WOFF2 face declared at 250 | Hero, short marketing body, portfolio titles |
| Heading | Static WOFF2 face declared at 300 | Section headings, labels, FAQ questions |
| Regular | Static WOFF2 face declared at 400 | Forms, metadata, numbers |
| Medium | Static WOFF2 face declared at 500 | Strong emphasis and selective active text |
| Work Sans | Loaded/configured in the page and Elementor theme | Do not introduce it as a second brand family |
| Fragment Mono | Declared in a stylesheet | Do not introduce it without an actual project requirement |

Some reference selectors request 200 or 350, while the inspected custom font-face declarations provide 250, 300, 400, and 500. A requested weight is not proof of an additional font file. The package uses the four declared faces explicitly.

The reference uses static files; do not label them as a variable font or claim that an arbitrary weight range is supported. If the project owns a different licensed edition, verify its actual weights before changing this mapping.

## 3. Asset and loading requirement

TWK Lausanne is a commercial typeface published by WELTKERN. Use the licensed webfont files supplied for your project. The ZIP contains loaders and placement instructions, not font binaries.

Expected local basenames: `twkLausanne250.woff2`, `twkLausanne300.woff2`, `twkLausanne400.woff2`, and `twkLausanne500.woff2`. These are project filename conventions, not changes to the font's internal family or outlines.

Load the family exactly once. Use either `fonts/fontFaces.css` or the optional Next.js loader; never both. Use `font-display: swap`. A temporary fallback must not be presented as a completed visual match.

Keep a 100% root font size, normally 16px. Do not adopt a 62.5% reset to make the arithmetic easier. The package assumes a normal browser root and uses rem units for readable minimums.

## 4. Reference versus project values

The live desktop inspection used a 1363 × 936 CSS-pixel viewport with a 16px root. The homepage hero measured 68.15px at weight 250 with -0.05em tracking; the main section heading measured 54.52px at weight 300 with -0.047em tracking and a 1.1 line height. Detailed evidence is in `referenceAudit.md`.

The following system is an **adaptation for your project**, not a claim that every size below is an exact Brandium value. It keeps the reference's visual relationships while capping extremely large sizes and supporting longer production copy.

## 5. Global type scale

All expressions use the default 16px root. The actual values live in `styles/typographyTokens.css`; that file is the single implementation source of truth.

| Role / class | Size | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- |
| `typeDisplay` | `clamp(4rem, 1rem + 10vw, 14rem)` | 300 | 1.02 | -0.05em |
| `typeHero` | `clamp(2.25rem, 1.25rem + 3.6vw, 6rem)` | 250 | 1.1 | -0.05em |
| `typeSectionTitle` | `clamp(2.2rem, 1.25rem + 2.6vw, 5rem)` | 300 | 1.1 | -0.047em |
| `typeHeading` | `clamp(1.5rem, 1.125rem + 1.25vw, 2.5rem)` | 300 | 1.15 | -0.03em |
| `typeCardTitle` | `clamp(1.375rem, 1.1rem + 1.15vw, 2.2rem)` | 250 | 1.2 | -0.024em |
| `typeLead` | `clamp(1.125rem, 1.05rem + 0.4vw, 1.4rem)` | 250 | 1.45 | -0.01em |
| `typeBody` | 1rem / 16px | 250 | 1.5 | 0 |
| `typeSmall` | 0.875rem / 14px | 300 | 1.5 | 0 |
| `typeMeta` | 0.8125rem / 13px | 400 | 1.4 | +0.03em |
| `typeEyebrow` | `clamp(0.9rem, 0.85rem + 0.2vw, 1.1rem)` | 300 | 1.4 | -0.01em |
| `typeNav` | 1rem / 16px | 250 | 1.4 | 0 |
| `typeButton` | `clamp(1rem, 0.94rem + 0.18vw, 1.1rem)` | 300 | 1.4 | -0.01em |
| `typeQuote` | `clamp(1.5rem, 1.125rem + 1.25vw, 2rem)` | 250 | 1.25 | -0.02em |
| `typeMetric` | `clamp(3.5rem, 1.5rem + 7vw, 8rem)` | 400 | 1.05 | -0.03em |
| `typeFaqQuestion` | `clamp(1.1rem, 1.04rem + 0.2vw, 1.2rem)` | 300 | 1.25 | -0.01em |
| `typePrice` | Same size as `typeHeading` | 400 | 1.15 | -0.02em |
| `typeProse` | 1rem / 16px | 300 | 1.65 | 0 |

The actual CSS wraps mixed-unit expressions in `calc()` for clarity.

`typeDisplay` is opt-in for very short editorial words or a short footer statement. Do not apply it to every H1, article title, long CTA, or menu item.

Use 500 for semantic `strong` and `b`. Do not make all headings bold. The base CSS disables synthetic weight generation; add real licensed faces before introducing heavier weights.

## 6. Responsive behavior

| Viewport | `typeHero` | `typeSectionTitle` | `typeCardTitle` | Body |
| --- | --- | --- | --- | --- |
| 390px | 36px | 35.2px | 22.1px | 16px |
| 768px | 47.6px | 40.0px | 26.4px | 16px |
| 1024px | 56.9px | 46.6px | 29.4px | 16px |
| 1440px | 71.8px | 57.4px | 34.2px | 16px |
| 1920px | 89.1px | 69.9px | 35.2px | 16px |

Rounded reference outputs from the proposed CSS, not live device measurements.

Below 48rem, use -0.04em for hero/display tracking, -0.03em for section headings, and -0.02em for supporting headings. Body text retains normal tracking.

- At 320–430px, allow headings to wrap naturally; do not shrink paragraphs below 16px to fit a composition.
- Use the existing layout breakpoints. Typography has one additional small-screen tracking adjustment and fluid size formulas.
- Keep text in normal document flow. Do not force a text container to match a desktop height on mobile.
- Keep input, select, and textarea text at least 16px at the normal root size.
- If the longest approved headline wraps poorly, adjust its available width or editorial line break before adding a new font size.
- Long translated content must wrap; one unbroken URL may use `overflow-wrap: anywhere` locally.
- Do not use `transform: scale()` or compressed letterforms to make text fit.

## 7. Semantic structure and role assignment

Choose the HTML element for meaning and the typography class for appearance. A visually small section label is normally a paragraph, not a heading inserted only for its default size.

Use one meaningful H1 per page as this project's convention. Nest section headings logically. A card inside an H2 section will normally use H3 even when its visual class is `typeCardTitle`.

| Project area | Required mapping |
| --- | --- |
| Header and ordinary navigation | `typeNav`; current state may use weight 400 if that is already the project pattern |
| Homepage and service hero | H1 `typeHero`; supporting paragraph `typeLead` or `typeBody` according to copy length |
| Large inner-page editorial word | H1 `typeDisplay` only if the content is sufficiently short |
| Long article or case-study title | H1 `typeHero`, never the oversized display role by default |
| Section label | Paragraph `typeEyebrow`; retain current label spelling |
| Main section title | H2 `typeSectionTitle` |
| Supporting subsection | H3 `typeHeading` |
| Project and blog cards | Appropriate H2/H3 with `typeCardTitle`; description `typeBody`; date/tag `typeMeta` |
| Services and feature lists | `typeHeading` or `typeCardTitle` for titles; `typeBody` for explanations |
| Testimonials | `typeQuote`; person's name at 400; role/company `typeSmall` |
| Figures and results | `typeMetric`; descriptive label `typeSmall` |
| Pricing | `typePrice` with tabular numerals; billing terms `typeSmall` |
| FAQs | Existing accessible trigger with `typeFaqQuestion`; answer `typeBody` or `typeProse` |
| CTA | `typeSectionTitle` plus `typeLead`; action `typeButton` |
| Footer | Headline `typeSectionTitle` or short `typeDisplay`; links `typeNav`; legal text `typeSmall` |
| Contact and quote forms | 16px regular controls; visible labels `typeSmall` at 400; errors remain legible |
| Articles, policies, service long-form | `.typeProse` wrapper; local headings follow its smaller editorial scale |
| Authored admin/application UI | Same family; body/control sizes, regular weight, and compact heading roles; keep dense layouts intact |

Preserve a dedicated monospace family for code and keyboard shortcuts. Preserve icon fonts, third-party embedded controls, and logo assets. A brand wordmark supplied as an image/SVG is not an instruction to typeset a replacement logo.

## 8. Text measure, alignment, and rhythm

| Optional measure class | Maximum inline width | Use |
| --- | --- | --- |
| `measureHero` | 22ch | A focused multi-line hero statement |
| `measureSection` | 24ch | Section headings with controlled wrapping |
| `measureLead` | 48ch | Introductory supporting paragraphs |
| `measureBody` | 65ch | General reading content |
| `measureQuote` | 40ch | Testimonial statements |

These are opt-in content measures, not global container widths. Preserve any tighter existing column. A `ch` value is based on the font's zero glyph; it does not guarantee an exact character count.

Prefer left alignment for longer text. Use centered text for short statements only when the current section calls for it. Never justify paragraphs.

Recommended spacing inside an existing component: label to title 8–16px, title to lead 20–32px, paragraph to paragraph approximately 1em, card title to description 8–12px. Use the existing spacing token system to select the nearest value. The typography files do not introduce new page-section padding.

Normal headings use balanced wrapping. Body and card text can use pretty wrapping. These are progressive enhancements: native wrapping must still look acceptable if a browser ignores them.

## 9. Color and readability

Typography inherits the project's text colors. The package contains no new brand palette, gradient text, background color, or reduced-opacity body style.

Keep body copy at full readable contrast. Use your existing accessible muted-text token for secondary information rather than copying the reference's low-opacity text treatment. If fine strokes are hard to read on an existing background, choose weight 300 for that reading context.

Retain visible link and keyboard-focus styles. Do not reset outlines. Keep the meaning of links, errors, and active states perceivable without relying solely on a weight change.

## 10. Animation compatibility

Typography adoption does not require a new animation library or a new loader sequence. Keep the current site's motion system.

For an existing line-reveal effect, preserve a single accessible text equivalent and prevent visual copies from creating repeated announcements. Do not hide the semantic heading from assistive technology without an equivalent.

If a current animation splits text into measured lines, initialize that measurement after the required font is ready and remeasure on meaningful container-width changes. Clean up observers and animation instances on route changes. Do not block the whole page while waiting for fonts.

Use transform and opacity for text entrances. Do not animate font size, tracking, width, or weight continuously to imitate the reference. Remove temporary masks after entrance where feasible so zoom and spacing overrides do not clip content.

With reduced motion, reveal text immediately. If JavaScript fails, all essential text must remain visible.

## 11. Architecture and CSS integration

Use four shared concerns: tokens, base text defaults, role classes, and long-form prose. Keep implementation files below 300 lines. Do not create a component wrapper for every heading unless the repository already has that abstraction.

Apply `.siteTypography` to the owned root once. It is a scoping class, not a new layout container. The tokens are inherited by descendants.

Import order: font loader if using CSS, then `typographyTokens.css`, `typographyBase.css`, `typographyRoles.css`, and `typographyProse.css`. Use bundler imports or the existing global style pipeline; do not add runtime remote CSS requests.

Audit old font declarations and text utilities. Remove conflicting typography only where the new system is applied. Do not accumulate `!important`, universal `*` font rules, duplicated font-face declarations, or individual pixel overrides.

The base defaults have low specificity. Existing component styles can still win; resolve those intentionally. Role classes should be the final owner of their typography, not one more competing declaration.

If Tailwind is present, retain its layout/color classes and use these camelCase typography classes. Remove contradictory `font-*`, `text-*` sizing, `leading-*`, and `tracking-*` utilities on migrated elements. Do not create a second parallel size scale.

The Next.js route is described in `nextjs/nextjsIntegration.md`. Its loader needs local font files before import; typography itself does not need a client component or JavaScript bundle.

## 12. Naming convention

| Category | Convention | Example |
| --- | --- | --- |
| Package/archive | lower camelCase | `brandiumTypography.zip` |
| Authored Markdown | lower camelCase | `typographyDesign.md` |
| Stylesheets | lower camelCase | `typographyRoles.css` |
| CSS classes | lower camelCase | `typeSectionTitle` |
| CSS custom-property names | lower camelCase after required `--` prefix | `--fontSizeHero` |
| JS/TS values/functions | lower camelCase | `brandFont` |
| Font basenames | lower camelCase plus numeric weight | `twkLausanne300.woff2` |
| React component identifiers | Framework-compatible PascalCase | `SectionHeading` if one already exists |

Preserve language syntax and framework conventions: `font-family`, `@font-face`, `aria-label`, `layout.tsx`, and `page.tsx` must not be renamed into invented syntax. Keep vendor license documents and official names intact.

## 13. Acceptance criteria

- TWK Lausanne actually renders in DevTools' rendered-font inspection after loading; a computed family name alone is insufficient for final project approval.
- The four required local assets load without 404s or duplicate loading systems.
- Headings use the specified light weights and tracking; body and controls remain readable.
- Every page type follows the role map; articles and admin screens do not inherit oversized marketing section headings accidentally.
- Current colors, logo assets, routes, section order, and intended interactions are retained.
- No horizontal overflow or cut-off characters at 320, 390, 768, 1024, 1440, and 1920 CSS pixels with real content.
- Text and controls remain usable at 200% zoom and under the project's accessibility checks.
- User text-spacing overrides do not lose content: line height 1.5, paragraph spacing 2em, tracking 0.12em, and word spacing 0.16em. These are test overrides, not required default styling.
- Long headings, accent marks, descenders, currency, email addresses, and the actual supported locales are verified.
- Rich-text emphasis and any required italics are checked; add licensed italic faces if authentic italic styling is needed.
- Existing focus states, clickable areas, and form error messages still work.
- Font-swap behavior, reduced motion, and existing text reveal behavior are reviewed once in the real project.
- Build and existing checks pass. Report the actual checks performed and any remaining asset dependency.

## 14. Implementation order

1. Read the repository's existing rules and identify its root layout, font loader, and shared typography.
2. Locate the project's licensed font assets and choose one loading strategy.
3. Add tokens and base styles without changing colors or layout.
4. Apply role classes to shared navigation, buttons, headings, cards, forms, and footer.
5. Map all route families, including CMS output, to the same roles.
6. Resolve old conflicting typography declarations.
7. Verify representative pages with the actual fonts and real copy.
8. Summarize changes, checks, and any missing fonts explicitly.

## 15. Supporting references

- [Brandium homepage](https://www.brandium.nl/): visual/source reference; exact stylesheet URLs and observations are recorded in `referenceAudit.md`.
- [TWK Lausanne](https://weltkern.com/typefaces/twk-lausanne) and [WELTKERN licensing](https://weltkern.com/licensing-terms): official font source.
- [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts) and [font API](https://nextjs.org/docs/app/api-reference/components/font): optional implementation route.
- [CSS clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp): bounded fluid sizes.
- [W3C text-spacing criterion](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html): text override verification.
