/** Generated illustrations are SVG scenes that must be shown whole, never cropped. */
export function isVectorAsset(src: string | null | undefined): boolean {
  return (src ?? "").split("?")[0]?.toLowerCase().endsWith(".svg") ?? false;
}
