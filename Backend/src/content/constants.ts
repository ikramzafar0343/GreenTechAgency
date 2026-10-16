export const CONTENT_STATUSES = ["draft", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const ICON_ALLOWLIST = [
  "design",
  "code",
  "growth",
  "brand",
  "tech",
] as const;
export type IconName = (typeof ICON_ALLOWLIST)[number];

export const SECTION_KEYS = [
  "services",
  "blog",
  "portfolio",
  "faq",
  "testimonials",
  "stats",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SITE_DOCUMENT_KEYS = [
  "footer",
  "about",
  "hero",
  "how_we_work",
  "why_choose",
  "impact",
  "cta",
] as const;
export type SiteDocumentKey = (typeof SITE_DOCUMENT_KEYS)[number];

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
