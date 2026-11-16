"use client";


export type GroupPortraitForm = {
  src: string;
  alt: string;
  focalPoint: string;
};

export type AboutForm = {
  groupPortrait: GroupPortraitForm;
  /** Full about document; portrait fields are mirrored into this on save. */
  document: Record<string, unknown>;
};

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function portraitFromDoc(doc: Record<string, unknown>): GroupPortraitForm {
  const portrait = asRecord(doc.groupPortrait);
  return {
    src: typeof portrait.src === "string" ? portrait.src : "",
    alt:
      typeof portrait.alt === "string" && portrait.alt.trim()
        ? portrait.alt
        : "GreenTech Agency team working together",
    focalPoint:
      typeof portrait.focalPoint === "string" && portrait.focalPoint.trim()
        ? portrait.focalPoint
        : "50% 42%",
  };
}
