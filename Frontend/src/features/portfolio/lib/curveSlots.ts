export type MarkerSlot = "top" | "mid" | "bottom";
export type MarkerKind = "past" | "active" | "future" | "empty";

export type CurveSlotPlan = {
  top: MarkerKind;
  mid: MarkerKind;
  bottom: MarkerKind;
  activeSlot: MarkerSlot;
};

/** Path-locked marker centers for viewBox 0 0 120 360. */
export const CURVE_MARKERS = {
  top: { x: 34, y: 36 },
  mid: { x: 86, y: 180 },
  bottom: { x: 34, y: 324 },
} as const;

/** Soft vertical S with continuous tangents. */
export const CURVE_PATH_D =
  "M34 36 C34 92, 86 118, 86 180 C86 242, 34 268, 34 324";

export function planCurveSlots(index: number, total: number): CurveSlotPlan {
  if (total <= 0) {
    return {
      top: "empty",
      mid: "empty",
      bottom: "empty",
      activeSlot: "top",
    };
  }

  const last = total - 1;

  if (index <= 0) {
    return {
      top: "active",
      mid: total > 1 ? "future" : "empty",
      bottom: "empty",
      activeSlot: "top",
    };
  }

  if (index >= last) {
    return {
      top: "past",
      mid: "empty",
      bottom: "active",
      activeSlot: "bottom",
    };
  }

  return {
    top: "past",
    mid: "active",
    bottom: "future",
    activeSlot: "mid",
  };
}
