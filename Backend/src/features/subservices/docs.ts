import {
  assertNonEmptyString,
  optionalString,
} from "../../content/slug.js";
import {
  assertSafeHref,
  parseRichDoc,
  type RichBlock,
} from "../../content/richText.js";
import { AppError } from "../../http/errors.js";

export type SubserviceDoc = {
  title: string;
  summary: string;
  detailedContent: RichBlock[];
  cardImagePath: string | null;
  cardImageAlt: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function parseSubserviceDoc(input: unknown): SubserviceDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid subservice document");
  }
  const row = input as Record<string, unknown>;
  const detailedContent = Array.isArray(row.detailedContent)
    ? parseRichDoc(row.detailedContent)
    : [
        {
          type: "paragraph" as const,
          text: assertNonEmptyString(
            row.summary ?? row.title,
            "summary",
            2000,
          ),
        },
      ];
  const ctaHref = optionalString(row.ctaHref, "ctaHref", 500);
  return {
    title: assertNonEmptyString(row.title, "title", 200),
    summary: assertNonEmptyString(row.summary, "summary", 800),
    detailedContent,
    cardImagePath: optionalString(row.cardImagePath, "cardImagePath", 500),
    cardImageAlt: optionalString(row.cardImageAlt, "cardImageAlt", 300) ?? "",
    ctaLabel: optionalString(row.ctaLabel, "ctaLabel", 120),
    ctaHref: ctaHref ? assertSafeHref(ctaHref) : null,
    seoTitle: optionalString(row.seoTitle, "seoTitle", 200),
    seoDescription: optionalString(row.seoDescription, "seoDescription", 400),
  };
}

export function assertSubservicePublishable(doc: SubserviceDoc): void {
  assertNonEmptyString(doc.title, "title");
  assertNonEmptyString(doc.summary, "summary");
}
