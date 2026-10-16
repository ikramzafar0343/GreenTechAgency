# GreenTech adaptation note

This project uses the Brandium typography **system** (tokens, roles, measures, tracking) from `brandiumTypography.zip`.

The licensed webfont family in use is **Nourd**, not TWK Lausanne:

| Brandium weight token | Nourd face |
|-----------------------|------------|
| 250 / 300 | `nourd_light.ttf` |
| 400 | `nourd_regular.ttf` |
| 500 | `nourd_medium.ttf` |

Implementation lives under `Frontend/src/styles/typography/` and `Frontend/src/shared/lib/fonts.ts`. Scope class: `siteTypography` on the document body.
