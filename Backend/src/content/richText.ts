import { AppError } from "../http/errors.js";

export type RichBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

const MAX_LIST_ITEMS = 60;

const ALLOWED_SCHEMES = new Set(["http:", "https:", "mailto:"]);

export function sanitizePlainText(input: string, max = 20_000): string {
  const cleaned = input.replace(/\0/g, "").trim();
  if (cleaned.length > max) {
    throw new AppError("VALIDATION", `Text exceeds ${max} characters`);
  }
  return cleaned;
}

export function assertSafeHref(href: string): string {
  let url: URL;
  try {
    url = new URL(href, "https://example.invalid");
  } catch {
    throw new AppError("VALIDATION", "Invalid URL");
  }
  if (href.startsWith("/")) {
    if (href.startsWith("//") || href.includes("\\")) {
      throw new AppError("VALIDATION", "Invalid path URL");
    }
    return href;
  }
  if (!ALLOWED_SCHEMES.has(url.protocol)) {
    throw new AppError("VALIDATION", "URL scheme not allowed");
  }
  return href;
}

/**
 * Constrained rich document: paragraphs, headings and plain-text lists (no HTML/JSX).
 * A list item may be "Label | https://url" or "Label | /internal-path"; the public
 * renderer turns that into a link after checking the scheme.
 */
export function parseRichDoc(value: unknown): RichBlock[] {
  if (!Array.isArray(value)) {
    throw new AppError("VALIDATION", "rich content must be an array of blocks");
  }
  if (value.length > 200) {
    throw new AppError("VALIDATION", "rich content exceeds block limit");
  }
  return value.map((block, index) => {
    if (!block || typeof block !== "object") {
      throw new AppError("VALIDATION", `Invalid rich block at ${index}`);
    }
    const row = block as Record<string, unknown>;
    if (row.type === "paragraph") {
      return {
        type: "paragraph" as const,
        text: sanitizePlainText(String(row.text ?? ""), 5000),
      };
    }
    if (row.type === "heading") {
      const level = row.level === 3 ? 3 : 2;
      return {
        type: "heading" as const,
        level: level as 2 | 3,
        text: sanitizePlainText(String(row.text ?? ""), 500),
      };
    }
    if (row.type === "list") {
      if (!Array.isArray(row.items) || row.items.length === 0) {
        throw new AppError("VALIDATION", `List at ${index} needs at least one item`);
      }
      if (row.items.length > MAX_LIST_ITEMS) {
        throw new AppError("VALIDATION", `List at ${index} exceeds ${MAX_LIST_ITEMS} items`);
      }
      return {
        type: "list" as const,
        ordered: row.ordered === true,
        items: row.items.map((item) => sanitizePlainText(String(item ?? ""), 1000)),
      };
    }
    throw new AppError("VALIDATION", `Unsupported rich block type at ${index}`);
  });
}

export function richDocFromParagraphs(paragraphs: readonly string[]): RichBlock[] {
  return paragraphs.map((text) => ({
    type: "paragraph" as const,
    text: sanitizePlainText(text, 5000),
  }));
}
