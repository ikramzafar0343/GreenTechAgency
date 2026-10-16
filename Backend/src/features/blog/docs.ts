import {
  assertNonEmptyString,
  optionalString,
} from "../../content/slug.js";
import { parseRichDoc, type RichBlock } from "../../content/richText.js";
import { AppError } from "../../http/errors.js";

export type BlogDoc = {
  title: string;
  excerpt: string;
  body: RichBlock[];
  coverPath: string | null;
  coverAlt: string;
  railLabel: string | null;
  category: string;
  authorDisplay: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  focalX: number;
  focalY: number;
  readTimeMinutes: number | null;
};

export function parseBlogDoc(input: unknown): BlogDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid blog document");
  }
  const row = input as Record<string, unknown>;
  const excerpt = assertNonEmptyString(row.excerpt, "excerpt", 1000);
  const body = Array.isArray(row.body)
    ? parseRichDoc(row.body)
    : [{ type: "paragraph" as const, text: excerpt }];
  const focalX = Number(row.focalX ?? 0.5);
  const focalY = Number(row.focalY ?? 0.45);
  if (focalX < 0 || focalX > 1 || focalY < 0 || focalY > 1) {
    throw new AppError("VALIDATION", "focalX/focalY must be between 0 and 1");
  }
  const readRaw = row.readTimeMinutes;
  const readTimeMinutes =
    readRaw === null || readRaw === undefined || readRaw === ""
      ? null
      : Number(readRaw);
  if (
    readTimeMinutes !== null &&
    (!Number.isInteger(readTimeMinutes) || readTimeMinutes < 1 || readTimeMinutes > 120)
  ) {
    throw new AppError("VALIDATION", "readTimeMinutes must be 1–120 or null");
  }
  return {
    title: assertNonEmptyString(row.title, "title", 300),
    excerpt,
    body,
    coverPath: optionalString(row.coverPath, "coverPath", 500),
    coverAlt: optionalString(row.coverAlt, "coverAlt", 300) ?? "",
    railLabel: optionalString(row.railLabel, "railLabel", 120),
    category: assertNonEmptyString(row.category ?? "General", "category", 80),
    authorDisplay: optionalString(row.authorDisplay, "authorDisplay", 120),
    seoTitle: optionalString(row.seoTitle, "seoTitle", 200),
    seoDescription: optionalString(row.seoDescription, "seoDescription", 400),
    focalX,
    focalY,
    readTimeMinutes,
  };
}

export function assertBlogPublishable(doc: BlogDoc): void {
  assertNonEmptyString(doc.title, "title");
  assertNonEmptyString(doc.excerpt, "excerpt");
  if (doc.body.length < 1) {
    throw new AppError("VALIDATION", "body is required to publish");
  }
}
