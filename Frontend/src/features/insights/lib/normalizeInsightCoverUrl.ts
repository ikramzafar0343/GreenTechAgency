/** Prefer photographic covers under /public/insights when both assets exist. */
export function normalizeInsightCoverUrl(coverUrl: string | null): string | null {
  if (!coverUrl) {
    return null;
  }

  // CMS /media uploads and absolute URLs must stay as stored.
  if (
    coverUrl.startsWith("/media/") ||
    coverUrl.startsWith("http://") ||
    coverUrl.startsWith("https://")
  ) {
    return coverUrl;
  }

  if (coverUrl.endsWith(".svg")) {
    return coverUrl.replace(/\.svg$/i, ".jpg");
  }

  return coverUrl;
}

export function isInsightCmsMediaSrc(src: string): boolean {
  return (
    src.startsWith("/media/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.endsWith(".svg")
  );
}
