/** Express 5 `/*splat` may be a string or string[]. */
export function objectKeyFromRequest(
  splat: unknown,
  mountedPath: string,
): string {
  if (Array.isArray(splat)) {
    return splat.map(String).filter(Boolean).join("/");
  }
  if (typeof splat === "string" && splat.trim()) {
    return splat.replace(/^\/+/, "");
  }
  return mountedPath.replace(/^\/+/, "");
}
