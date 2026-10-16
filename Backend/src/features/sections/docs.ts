import { assertNonEmptyString, optionalString } from "../../content/slug.js";
import { assertSafeHref } from "../../content/richText.js";
import { AppError } from "../../http/errors.js";
import { SECTION_KEYS, type SectionKey } from "../../content/constants.js";

export type SectionDoc = {
  eyebrow: string | null;
  heading: string;
  introduction: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  featuredIds: string[];
  maxItems: number;
};

export function assertSectionKey(key: string): SectionKey {
  if (!(SECTION_KEYS as readonly string[]).includes(key)) {
    throw new AppError("NOT_FOUND", `Unknown section key: ${key}`);
  }
  return key as SectionKey;
}

export function parseSectionDoc(input: unknown, key: SectionKey): SectionDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid section document");
  }
  const row = input as Record<string, unknown>;
  const maxDefault = key === "blog" ? 9 : key === "portfolio" ? 8 : 16;
  const maxItems = Number(row.maxItems ?? maxDefault);
  if (!Number.isInteger(maxItems) || maxItems < 1 || maxItems > 24) {
    throw new AppError("VALIDATION", "maxItems must be 1–24");
  }
  const featuredIds = Array.isArray(row.featuredIds)
    ? row.featuredIds.map((id, i) =>
        assertNonEmptyString(id, `featuredIds[${i}]`, 80),
      )
    : [];
  if (featuredIds.length > maxItems) {
    throw new AppError(
      "VALIDATION",
      `featuredIds exceeds section maxItems (${maxItems})`,
    );
  }
  const ctaHref = optionalString(row.ctaHref, "ctaHref", 500);
  return {
    eyebrow: optionalString(row.eyebrow, "eyebrow", 120),
    heading: assertNonEmptyString(row.heading, "heading", 200),
    introduction: assertNonEmptyString(row.introduction, "introduction", 800),
    ctaLabel: optionalString(row.ctaLabel, "ctaLabel", 120),
    ctaHref: ctaHref ? assertSafeHref(ctaHref) : null,
    featuredIds,
    maxItems,
  };
}
