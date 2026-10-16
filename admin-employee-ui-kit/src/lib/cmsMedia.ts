export function cmsMediaSrc(imagePath: string): string {
  if (imagePath.length === 0) {
    return "";
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  if (imagePath.startsWith("cms/")) {
    return "/portal/logo.png";
  }

  return imagePath;
}
