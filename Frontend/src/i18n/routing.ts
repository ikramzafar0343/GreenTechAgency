import { defineRouting } from "next-intl/routing";

/** Public storefront is English-only; language switching was removed. */
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export function isRtlLocale(_locale: string): boolean {
  return false;
}
