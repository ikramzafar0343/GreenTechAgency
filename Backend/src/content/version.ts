import { AppError } from "../http/errors.js";

export function assertVersionMatch(
  expected: number,
  actual: number,
): void {
  if (expected !== actual) {
    throw new AppError(
      "CONFLICT",
      "Stale version: reload and review your changes before saving again",
      { expectedVersion: expected, actualVersion: actual },
    );
  }
}

export function parseExpectedVersion(body: Record<string, unknown>): number {
  const version = Number(body.version);
  if (!Number.isInteger(version) || version < 1) {
    throw new AppError("VALIDATION", "version must be a positive integer");
  }
  return version;
}
