# Next.js integration

This route is for an existing App Router project. Keep its current layout, metadata, providers, localization, and CSS architecture. Do not generate a replacement application.

## File placement

| Package item | Destination |
| --- | --- |
| `nextjs/fontConfig.ts` | `src/lib/typography/fontConfig.ts` |
| `styles/typographyTokens.css` | `src/styles/typography/typographyTokens.css` |
| `styles/typographyBase.css` | `src/styles/typography/typographyBase.css` |
| `styles/typographyRoles.css` | `src/styles/typography/typographyRoles.css` |
| `styles/typographyProse.css` | `src/styles/typography/typographyProse.css` |
| Your four licensed fonts | `src/assets/fonts/twkLausanne/` |

The loader's `../../assets/fonts/...` paths resolve from `src/lib/typography/` to `src/assets/fonts/`. If your repository has a different structure, adjust all four paths together.

## Merge into the existing root layout

After adding the licensed files, add these imports to the layout that already owns your global styles. The path aliases assume `@/` resolves to `src/`; use the repository's actual alias otherwise.

```tsx
import { brandFont } from '@/lib/typography/fontConfig';
import '@/styles/typography/typographyTokens.css';
import '@/styles/typography/typographyBase.css';
import '@/styles/typography/typographyRoles.css';
import '@/styles/typography/typographyProse.css';
```

Merge `brandFont.variable` into the existing `html` class list and `siteTypography` into the existing `body` class list. Keep every existing required class. For a localized route shell, place the font variable on the existing ancestor and `siteTypography` on the owned shell, including owned portal roots where applicable.

Do not render a second `<html>` or `<body>`. Do not call the loader in multiple layouts/components. Do not add `use client` for typography.

The token file resolves `--fontBrand` automatically. Use the `.variable` export; applying only `.className` would not provide this token binding.

## Font-loading choices

The loader declares one family with four static faces, uses `display: 'swap'`, and enables an Arial metric-adjusted fallback. It sets `preload: false`, so every declared weight is not automatically prioritized. Verify initial rendering in the actual project; enabling preload on this grouped call applies to all four files.

Do not also import `fonts/fontFaces.css`. The Next.js loader owns the font-face output for this route. Do not add manual links to the unused public-font paths or to the original reference website.

## Existing CSS and Tailwind

Keep the repository's established cascade layers. If it uses Tailwind, the package's role classes can be used directly alongside layout and color utilities. Remove conflicting type utilities as elements are migrated; changing import order alone does not resolve every cascade conflict.

A service section heading can remain a semantic H2 and receive `typeSectionTitle`. A project card can remain an H3 and receive `typeCardTitle`. Scope long-form HTML with `typeProse`.

Do not add parallel Tailwind font-size tokens with slightly different values. Use the shared CSS custom properties if an existing component API needs token access.

## Verification

Run the repository's current build and checks after the real fonts are in place. Inspect a hero, card grid, form, article, FAQ, and footer at desktop and mobile widths. Verify rendered-font identity and loading behavior in the browser.

This package was validated as an integration kit; a Next.js build against your unseen repository and licensed fonts has not been performed.

Official references: [font optimization](https://nextjs.org/docs/app/getting-started/fonts), [font API](https://nextjs.org/docs/app/api-reference/components/font).
