/**
 * Normalize stored CMS media values to a browser-safe same-origin src when
 * possible. Absolute Backend media URLs are rewritten to `/media/...` so the
 * Next media proxy serves them (avoids broken tiles when :4000 is unreachable
 * from the browser).
 */
export function cmsMediaSrc(imagePath: string): string {
  if (imagePath.length === 0) {
    return "";
  }

  const trimmed = imagePath.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (url.pathname.startsWith("/media/")) {
        return `${url.pathname}${url.search}`;
      }
    } catch {
      /* keep absolute URL */
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

  if (trimmed.startsWith("cms/")) {
    return "/portal/logo.png";
  }

  return trimmed;
}

/** Prefer storing a site-relative media path after upload. */
export function toStoredMediaPath(uploadUrlOrKey: string): string {
  const trimmed = uploadUrlOrKey.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (url.pathname.startsWith("/media/")) {
        return url.pathname;
      }
    } catch {
      /* fall through */
    }
    return trimmed;
  }
  if (trimmed.startsWith("/media/")) {
    return trimmed;
  }
  if (trimmed.startsWith("uploads/")) {
    return `/media/${trimmed}`;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/media/${trimmed.replace(/^\/+/, "")}`;
}
