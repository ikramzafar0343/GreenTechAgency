import { AppError } from "../http/errors.js";
import { SLUG_PATTERN } from "./constants.js";

export function assertSlug(value: unknown, field = "slug"): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError("VALIDATION", `${field} is required`);
  }
  const slug = value.trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug) || slug.length > 120) {
    throw new AppError(
      "VALIDATION",
      `${field} must be lowercase kebab-case (max 120 chars)`,
    );
  }
  return slug;
}

export function assertNonEmptyString(
  value: unknown,
  field: string,
  max = 500,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError("VALIDATION", `${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new AppError("VALIDATION", `${field} exceeds ${max} characters`);
  }
  return trimmed;
}

export function optionalString(
  value: unknown,
  field: string,
  max = 500,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new AppError("VALIDATION", `${field} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new AppError("VALIDATION", `${field} exceeds ${max} characters`);
  }
  return trimmed;
}
