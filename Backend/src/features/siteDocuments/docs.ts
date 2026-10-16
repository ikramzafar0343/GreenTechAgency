import {
  SITE_DOCUMENT_KEYS,
  type SiteDocumentKey,
} from "../../content/constants.js";
import { AppError } from "../../http/errors.js";

export type SiteDocumentDoc = Record<string, unknown>;

const MAX_DOC_BYTES = 200_000;

export function assertSiteDocumentKey(key: string): SiteDocumentKey {
  if (!(SITE_DOCUMENT_KEYS as readonly string[]).includes(key)) {
    throw new AppError("NOT_FOUND", `Unknown site document key: ${key}`);
  }
  return key as SiteDocumentKey;
}

export function parseSiteDocumentDoc(input: unknown): SiteDocumentDoc {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new AppError("VALIDATION", "Invalid site document");
  }
  const json = JSON.stringify(input);
  if (json.length > MAX_DOC_BYTES) {
    throw new AppError("VALIDATION", "Site document exceeds size limit");
  }
  return input as SiteDocumentDoc;
}
