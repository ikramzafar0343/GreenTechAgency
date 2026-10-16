import {
  assertNonEmptyString,
  optionalString,
} from "../../content/slug.js";
import { parseRichDoc, type RichBlock } from "../../content/richText.js";
import { AppError } from "../../http/errors.js";

export type GalleryItem = { path: string; alt: string };

export type PortfolioDoc = {
  title: string;
  summary: string;
  description: string;
  caseStudy: RichBlock[];
  category: string;
  clientName: string | null;
  coverPath: string | null;
  coverAlt: string;
  projectUrl: string | null;
  relatedServiceSlug: string | null;
  gallery: GalleryItem[];
  seoTitle: string | null;
  seoDescription: string | null;
};

function parseGallery(value: unknown): GalleryItem[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 24) {
    throw new AppError("VALIDATION", "gallery must be an array (max 24)");
  }
  return value.map((item, i) => {
    const row = item as Record<string, unknown>;
    return {
      path: assertNonEmptyString(row.path, `gallery[${i}].path`, 500),
      alt: optionalString(row.alt, `gallery[${i}].alt`, 300) ?? "",
    };
  });
}

export function parsePortfolioDoc(input: unknown): PortfolioDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid portfolio document");
  }
  const row = input as Record<string, unknown>;
  const description = assertNonEmptyString(row.description, "description", 4000);
  const caseStudy = Array.isArray(row.caseStudy)
    ? parseRichDoc(row.caseStudy)
    : [{ type: "paragraph" as const, text: description }];
  return {
    title: assertNonEmptyString(row.title, "title", 200),
    summary: assertNonEmptyString(row.summary, "summary", 800),
    description,
    caseStudy,
    category: assertNonEmptyString(row.category ?? "General", "category", 80),
    clientName: optionalString(row.clientName, "clientName", 200),
    coverPath: optionalString(row.coverPath, "coverPath", 500),
    coverAlt: optionalString(row.coverAlt, "coverAlt", 300) ?? "",
    projectUrl: optionalString(row.projectUrl, "projectUrl", 500),
    relatedServiceSlug: optionalString(
      row.relatedServiceSlug,
      "relatedServiceSlug",
      120,
    ),
    gallery: parseGallery(row.gallery),
    seoTitle: optionalString(row.seoTitle, "seoTitle", 200),
    seoDescription: optionalString(row.seoDescription, "seoDescription", 400),
  };
}

export function assertPortfolioPublishable(doc: PortfolioDoc): void {
  assertNonEmptyString(doc.title, "title");
  assertNonEmptyString(doc.summary, "summary");
  assertNonEmptyString(doc.description, "description");
}
