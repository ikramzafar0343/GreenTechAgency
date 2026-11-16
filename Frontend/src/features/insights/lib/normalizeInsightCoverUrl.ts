/** Returns the stored cover path (public SVG/JPG, CMS /media upload or absolute URL). */
export function normalizeInsightCoverUrl(coverUrl: string | null): string | null {
  return coverUrl?.trim() ? coverUrl.trim() : null;
}

export function isInsightCmsMediaSrc(src: string): boolean {
  return (
    src.startsWith("/media/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.endsWith(".svg")
  );
}
