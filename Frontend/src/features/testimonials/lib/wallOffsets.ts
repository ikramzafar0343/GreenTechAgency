const OFFSETS: Record<number, readonly number[]> = {
  5: [258, 92, 0, 92, 258],
  4: [88, 22, 22, 88],
  3: [60, 0, 60],
  2: [24, 0],
  1: [0],
};

export function columnOffsetForIndex(
  columnCount: number,
  columnIndex: number,
): number {
  const offsets = OFFSETS[columnCount] ?? OFFSETS[1]!;
  return offsets[columnIndex] ?? 0;
}

export function maxColumnOffset(columnCount: number): number {
  const offsets = OFFSETS[columnCount] ?? OFFSETS[1]!;
  return offsets.reduce((max, value) => Math.max(max, value), 0);
}
