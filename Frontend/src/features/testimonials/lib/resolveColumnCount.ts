const MIN_CARD_WIDTH = 240;

/** Prefer the widest layout that still keeps cards readable. */
const BREAKPOINTS = [
  { cols: 5, gap: 28 },
  { cols: 4, gap: 24 },
  { cols: 3, gap: 20 },
  { cols: 2, gap: 20 },
  { cols: 1, gap: 16 },
] as const;

function cardWidth(containerWidth: number, cols: number, gap: number) {
  if (cols <= 1) {
    return containerWidth;
  }
  return (containerWidth - (cols - 1) * gap) / cols;
}

/** Pick 1–5 columns from wall width; prefer 5 whenever cards stay ≥240px. */
export function resolveColumnCount(containerWidth: number): number {
  if (containerWidth <= 0) {
    return 5;
  }

  for (const breakpoint of BREAKPOINTS) {
    if (
      breakpoint.cols === 1 ||
      cardWidth(containerWidth, breakpoint.cols, breakpoint.gap) >=
        MIN_CARD_WIDTH
    ) {
      return breakpoint.cols;
    }
  }

  return 1;
}

export function gapForColumnCount(columnCount: number): number {
  if (columnCount >= 5) {
    return 28;
  }
  if (columnCount >= 4) {
    return 24;
  }
  if (columnCount >= 2) {
    return 20;
  }
  return 16;
}
