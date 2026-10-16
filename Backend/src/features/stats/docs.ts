import { assertNonEmptyString, optionalString } from "../../content/slug.js";
import { AppError } from "../../http/errors.js";

export const METRIC_TYPES = ["COUNT", "YEAR"] as const;
export type MetricType = (typeof METRIC_TYPES)[number];

export const METRIC_PRESETS = [
  "WORD_EMPHASIS",
  "STANDARD_NUMBER",
  "OVERSIZED_NUMBER",
  "YEAR",
] as const;
export type MetricPreset = (typeof METRIC_PRESETS)[number];

export type StatDoc = {
  metricType: MetricType;
  preset: MetricPreset;
  value: number;
  prefix: string | null;
  suffix: string | null;
  label: string;
  emphasisWord: string | null;
};

function assertEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new AppError(
      "VALIDATION",
      `${field} must be one of: ${allowed.join(", ")}`,
    );
  }
  return value as T;
}

export function parseStatDoc(input: unknown): StatDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid stat metric document");
  }
  const row = input as Record<string, unknown>;
  const metricType = assertEnum(row.metricType, METRIC_TYPES, "metricType");
  const preset = assertEnum(row.preset, METRIC_PRESETS, "preset");
  const value = Number(row.value);
  if (!Number.isFinite(value)) {
    throw new AppError("VALIDATION", "value must be a number");
  }
  if (metricType === "YEAR") {
    if (!Number.isInteger(value) || value < 1900 || value > 2100) {
      throw new AppError("VALIDATION", "YEAR value must be an integer 1900–2100");
    }
  } else if (value < 0 || value > 1_000_000_000) {
    throw new AppError("VALIDATION", "COUNT value out of range");
  }
  const emphasisWord = optionalString(row.emphasisWord, "emphasisWord", 80);
  if (preset === "WORD_EMPHASIS" && !emphasisWord) {
    throw new AppError("VALIDATION", "emphasisWord is required for WORD_EMPHASIS");
  }
  return {
    metricType,
    preset,
    value,
    prefix: optionalString(row.prefix, "prefix", 20),
    suffix: optionalString(row.suffix, "suffix", 20),
    label: assertNonEmptyString(row.label, "label", 200),
    emphasisWord,
  };
}

export function assertStatPublishable(doc: StatDoc): void {
  parseStatDoc(doc);
}
