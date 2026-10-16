# Validation notes

## Verified for this package

- The reference page's public HTML, font-face declarations, and linked typography styles were inspected.
- Desktop computed styles were sampled at 1363 × 936 CSS pixels, with a 16px root.
- Mobile reference values were read from published media rules; they are labeled as source-defined values rather than measured screenshots.
- All authored package filenames and folder names follow lower camelCase.
- Every implementation file is below 300 lines.
- CSS custom-property references resolve to package tokens, apart from the documented optional Next.js `--fontBrand` binding.
- CSS block delimiters and Markdown code fences were checked for balance; full browser CSS validation was not performed.
- The documented Next.js asset paths resolve to `src/assets/fonts/twkLausanne/` from the specified loader destination.
- The responsive size table was checked against the supplied formulas at the listed widths.
- The archive contains one top-level `brandiumTypography` directory and only the intended package files.
- ZIP entry integrity and byte-for-byte consistency with the source files were checked.

## Project-dependent verification

The user's repository and licensed font binaries were not supplied. No application was changed, no Next.js production build was run, and the proposed system has not been rendered with the user's real content and assets.

Before release, supply the four actual fonts and perform the acceptance checks in `typographyDesign.md`. CSS structure checks do not establish final font rendering, accessibility conformance, route-wide migration, or pixel-level visual equivalence.

## Contents intentionally absent

No commercial font binaries, copies of Brandium's full stylesheets, site imagery, placeholder font files, build output, dependency directories, or deployment configuration are bundled. The archive contains the original typography specification and integration files written for this task.
