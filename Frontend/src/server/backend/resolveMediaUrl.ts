import "server-only";

import { getBackendUrl } from "@/server/backend/env";

/**
 * Resolve CMS media paths for public storefront Image/img src.
 * Uploaded VPS media is exposed via the Frontend `/media/*` proxy (same origin).
 */
export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) {
    return null;
  }
  const trimmed = path.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (url.pathname.startsWith("/media/")) {
        return `${url.pathname}${url.search}`;
      }
    } catch {
      /* keep absolute */
    }
    return trimmed;
  }

  if (trimmed.startsWith("/media/") || trimmed.startsWith("media/")) {
    const key = trimmed.replace(/^\/?media\/?/, "");
    return `/media/${key}`;
  }

  if (trimmed.startsWith("uploads/")) {
    return `/media/${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `${getBackendUrl()}/${trimmed.replace(/^\//, "")}`;
}
