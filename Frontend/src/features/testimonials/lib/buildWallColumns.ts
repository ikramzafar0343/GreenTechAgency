import type { TestimonialItem } from "@/features/testimonials/model/types";

export type WallNode =
  | { type: "testimonial"; item: TestimonialItem }
  | { type: "trust" };

/** Card counts per column — short outer, taller inner (diamond silhouette). */
const COLUMN_DEPTHS: Record<number, readonly number[]> = {
  5: [3, 4, 3, 4, 3],
  4: [3, 4, 4, 3],
  3: [3, 4, 3],
  2: [4, 4],
  1: [Number.POSITIVE_INFINITY],
};

function packColumns(
  items: TestimonialItem[],
  depths: readonly number[],
): WallNode[][] {
  const columns: WallNode[][] = Array.from({ length: depths.length }, () => []);
  let cursor = 0;

  depths.forEach((depth, columnIndex) => {
    const take = Number.isFinite(depth) ? depth : items.length - cursor;
    for (let slot = 0; slot < take; slot += 1) {
      const item = items[cursor];
      if (!item) {
        break;
      }
      columns[columnIndex]?.push({ type: "testimonial", item });
      cursor += 1;
    }
  });

  const centerIndex = Math.floor((depths.length - 1) / 2);
  while (cursor < items.length) {
    const item = items[cursor];
    cursor += 1;
    if (!item) {
      break;
    }
    const target =
      columns[centerIndex] ?? columns[columns.length - 1] ?? columns[0];
    target?.push({ type: "testimonial", item });
  }

  return columns;
}

export function buildWallColumns(
  items: TestimonialItem[],
  columnCount: number,
): WallNode[][] {
  if (items.length === 0) {
    return [];
  }

  const depths = COLUMN_DEPTHS[columnCount] ?? COLUMN_DEPTHS[1]!;
  const columns = packColumns(items, depths);

  if (columnCount >= 3) {
    const centerIndex = Math.floor((columns.length - 1) / 2);
    columns[centerIndex]?.push({ type: "trust" });
  }

  return columns;
}
