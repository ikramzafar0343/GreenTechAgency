# Brandium typography package

A sitewide typography specification based on a live inspection of [Brandium](https://www.brandium.nl/), with original, reusable CSS for your project.

**Start with `typographyDesign.md`.** It defines the visual rules, role mapping, responsive behavior, and implementation acceptance criteria.

## Confirmed font

Brandium's sampled primary text uses **TWK Lausanne**. Its main stylesheet declares static normal faces at **250, 300, 400, and 500**. The visual character comes from light weight, large sentence-case headings, tight heading tracking, and controlled line lengths.

The reference also declares Work Sans and Fragment Mono, but those declarations do not establish either as the main font used by the sampled headings and body text.

## Package contents

| File | Purpose |
| --- | --- |
| `typographyDesign.md` | Main design and implementation specification |
| `referenceAudit.md` | Verified observations, measurements, and source URLs |
| `fontSetup.md` | Asset placement, naming, loading, and licensing notes |
| `cursorPrompt.md` | Ready-to-use implementation instruction for your repository |
| `styles/typographyTokens.css` | Shared font sizes, weights, spacing, and measures |
| `styles/typographyBase.css` | Scoped text and form defaults |
| `styles/typographyRoles.css` | Reusable semantic typography classes |
| `styles/typographyProse.css` | Article and rich-text typography |
| `fonts/fontFaces.css` | Framework-independent local font loader |
| `fonts/fontFiles.md` | Exact expected font filenames |
| `nextjs/fontConfig.ts` | Optional Next.js local font loader |
| `nextjs/nextjsIntegration.md` | App Router integration instructions |
| `validationNotes.md` | What was verified and what remains project-dependent |

## Install

1. Extract this ZIP before using it in your project.
2. Obtain or locate your licensed TWK Lausanne webfonts. **Font binaries are not included.**
3. Read `fontSetup.md`; choose one font-loading method.
4. Copy the four files in `styles/` into your project's shared style directory.
5. Load them once, in the order tokens → base → roles → prose.
6. Apply `siteTypography` to the owned site shell or body.
7. Map existing text to the roles in `typographyDesign.md`; integrate through `cursorPrompt.md`.

The package is an integration kit, not a replacement application. It includes no dependency installation, page implementation, or automatic deployment.

## Naming

All authored folder names, filenames, CSS classes, and custom-property names use lower camelCase. CSS syntax, HTML attributes, official typeface names, and framework-reserved filenames keep their required spelling. Extensions remain lowercase.

## Important distinction

`referenceAudit.md` records Brandium's implementation. The supplied CSS is a deliberate adaptation for consistent use across your project. It preserves the reference's typographic direction while using bounded responsive sizes and readable UI defaults.

Exact appearance depends on installing the authentic licensed fonts, the text you use, available column widths, and the font version. Arial is only a loading/missing-font fallback; it is not a visual substitute for approval.
