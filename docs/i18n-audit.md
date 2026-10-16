# GreenTech i18n status

**Status:** Public multilingual switching was **removed by product request** (2026-10-17).

The storefront is English-only:

- No language selector in the navbar or mobile menu.
- `next-intl` routing is locked to `locales: ["en"]` with `localeDetection: false`.
- Non-English URL prefixes are not supported as published locales.
- `Frontend/messages/en.json` remains for UI chrome strings already wired through next-intl.

Backend `content_translation` rows and seed scripts may still exist in the database/repo; they are unused by the public storefront while locale is always `en`.
