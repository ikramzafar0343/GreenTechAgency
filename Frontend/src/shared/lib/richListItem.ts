/** A CMS list item is either plain text or "Label | https://url" / "Label | /path". */
export type RichListItem = { label: string; href: string | null; external: boolean };

const SAFE_EXTERNAL = /^https:\/\/[^\s]+$/i;
const SAFE_INTERNAL = /^\/(?!\/)[^\s\\]*$/;

export function parseListItem(raw: string): RichListItem {
  const index = raw.lastIndexOf(" | ");
  if (index < 0) {
    return { label: raw, href: null, external: false };
  }
  const label = raw.slice(0, index).trim();
  const target = raw.slice(index + 3).trim();
  if (SAFE_EXTERNAL.test(target)) {
    return { label: label || target, href: target, external: true };
  }
  if (SAFE_INTERNAL.test(target)) {
    return { label: label || target, href: target, external: false };
  }
  return { label: raw, href: null, external: false };
}

export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
