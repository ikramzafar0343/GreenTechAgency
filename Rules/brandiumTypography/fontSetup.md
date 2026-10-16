# Font setup

## Required assets

Use **TWK Lausanne** normal webfonts at 250, 300, 400, and 500. The four static weights match the declarations observed on Brandium.

The ZIP does not contain font binaries. Obtain the appropriate files through [WELTKERN](https://weltkern.com/typefaces/twk-lausanne), or use the project's existing licensed assets. WELTKERN's terms specify use of the original webfonts supplied after website registration; follow the terms attached to your license.

Use a single edition of the family. Do not convert desktop files into webfonts, subset, alter internal font names, or modify font bytes as part of this setup. The proposed camelCase filenames are local path conventions; if your delivery terms require original filenames, retain them and update the loader paths consistently.

## Choose one loader

| Route | Font destination | Loader |
| --- | --- | --- |
| Framework-independent CSS | `public/fonts/twkLausanne/` or your framework's equivalent public asset directory | `fonts/fontFaces.css` |
| Next.js local font | `src/assets/fonts/twkLausanne/` | Copy `nextjs/fontConfig.ts` to `src/lib/typography/fontConfig.ts` |

For CSS, `/fonts/...` is the public URL, not `/public/fonts/...`. If your application uses a deployment base path, adapt these URLs to its existing asset handling.

For Next.js, the paths are filesystem paths relative to `fontConfig.ts`. The module intentionally fails to build if a required asset is missing; add the correct files before importing it.

## Filename mapping

| Weight | Expected project basename | Style |
| --- | --- | --- |
| 250 | `twkLausanne250.woff2` | normal |
| 300 | `twkLausanne300.woff2` | normal |
| 400 | `twkLausanne400.woff2` | normal |
| 500 | `twkLausanne500.woff2` | normal |

`font-weight: 250` must point to the 250 face. Do not rename a 300 file to 250 or map one static font file to a 100–900 range.

Authentic italics require the corresponding licensed italic face and its own style declaration. The core kit supplies normal-face loading only. Review real rich-text content before release.

## CSS loading route

Copy `fontFaces.css` into the project's global style pipeline and load it before the four typography stylesheets. It defines the family name `TWKLausanne`, which the token file uses when no Next.js variable is present.

Let the existing bundler collect these styles. For a plain HTML project, link the actual local stylesheets in order. Keep the font URLs on your own application origin.

Where the hero depends on 250, consider a single preload for that asset after checking the network waterfall:

```html
<link
  rel="preload"
  href="/fonts/twkLausanne/twkLausanne250.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Do not preload every file automatically. Do not preload Brandium's URLs. Existing asset caching policy should apply to your versioned font files.

## Fallback and metrics

The stack ends with Arial and generic sans-serif so text can remain visible while loading. This is a loading fallback, not an approved replacement design.

The reference uses ascent/descent/line-gap overrides. The kit does not copy those descriptors blindly across potentially different licensed editions. The Next.js loader uses its Arial fallback adjustment; with the CSS route, assess visible movement in the real project before adding measured metric overrides.

If the project does not have Lausanne, keep the current verified typography active while integrating the shared structure. Record the missing assets. Do not silently ship a substituted font and call the result an exact match.

## Release check

Confirm local font requests succeed, inspect the actual rendered font, and verify the target weights with normal, strong, numeric, and long-form text. Check the glyphs needed by your supported locales. Do not copy the reference's Latin-oriented `unicode-range` into a multilingual site without verifying the delivered font coverage.
