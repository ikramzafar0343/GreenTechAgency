import {
  assertNonEmptyString,
  optionalString,
} from "../../content/slug.js";
import { assertSafeHref } from "../../content/richText.js";
import { AppError } from "../../http/errors.js";

export type TestimonialDoc = {
  companyName: string;
  companyLogoUrl: string | null;
  location: string | null;
  reviewerName: string;
  reviewerRole: string | null;
  reviewerPhotoUrl: string | null;
  quote: string;
  emphasisText: string | null;
  rating: number | null;
  ratingScale: number;
  sourceUrl: string | null;
};

export function parseTestimonialDoc(input: unknown): TestimonialDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid testimonial document");
  }
  const row = input as Record<string, unknown>;
  const ratingRaw = row.rating;
  const rating =
    ratingRaw === null || ratingRaw === undefined || ratingRaw === ""
      ? null
      : Number(ratingRaw);
  if (
    rating !== null &&
    (!Number.isFinite(rating) || rating < 0 || rating > 10)
  ) {
    throw new AppError("VALIDATION", "rating must be 0–10 or null");
  }
  const ratingScale = Number(row.ratingScale ?? 5);
  if (!Number.isInteger(ratingScale) || ratingScale < 1 || ratingScale > 10) {
    throw new AppError("VALIDATION", "ratingScale must be 1–10");
  }
  const sourceUrl = optionalString(row.sourceUrl, "sourceUrl", 500);
  return {
    companyName: assertNonEmptyString(row.companyName, "companyName", 200),
    companyLogoUrl: optionalString(row.companyLogoUrl, "companyLogoUrl", 500),
    location: optionalString(row.location, "location", 120),
    reviewerName: assertNonEmptyString(row.reviewerName, "reviewerName", 120),
    reviewerRole: optionalString(row.reviewerRole, "reviewerRole", 120),
    reviewerPhotoUrl: optionalString(
      row.reviewerPhotoUrl,
      "reviewerPhotoUrl",
      500,
    ),
    quote: assertNonEmptyString(row.quote, "quote", 4000),
    emphasisText: optionalString(row.emphasisText, "emphasisText", 400),
    rating,
    ratingScale,
    sourceUrl: sourceUrl ? assertSafeHref(sourceUrl) : null,
  };
}

export function assertTestimonialPublishable(doc: TestimonialDoc): void {
  assertNonEmptyString(doc.companyName, "companyName");
  assertNonEmptyString(doc.reviewerName, "reviewerName");
  assertNonEmptyString(doc.quote, "quote");
}
