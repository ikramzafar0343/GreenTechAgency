export type Point = {
  x: number;
  y: number;
};

export type LayoutKey = "A" | "B" | "C";

export const BOARD_WIDTH = 1200;
export const BOARD_HEIGHT = 900;
export const BOARD_PADDING = 12;
export const BOARD_BREAKPOINT = 1120;

/** Card-center coordinates in the 1200×760 board space. */
export const LAYOUT_PRESETS: Record<LayoutKey, Record<string, Point>> = {
  A: {
    discovery: { x: 140, y: 430 },
    strategy: { x: 400, y: 130 },
    design: { x: 430, y: 420 },
    development: { x: 430, y: 740 },
    testing: { x: 760, y: 430 },
    launch: { x: 1060, y: 430 },
  },
  B: {
    discovery: { x: 160, y: 220 },
    strategy: { x: 420, y: 150 },
    design: { x: 680, y: 220 },
    development: { x: 300, y: 600 },
    testing: { x: 620, y: 640 },
    launch: { x: 980, y: 470 },
  },
  C: {
    discovery: { x: 150, y: 600 },
    strategy: { x: 360, y: 300 },
    design: { x: 600, y: 170 },
    development: { x: 600, y: 560 },
    testing: { x: 860, y: 300 },
    launch: { x: 1060, y: 600 },
  },
};

export const LAYOUT_ORDER: readonly LayoutKey[] = ["A", "B", "C"];

export const HOW_WE_WORK_BOARD = {
  dragEnabled: true,
} as const;

export function getLayoutPoints(key: LayoutKey = "A"): Record<string, Point> {
  return LAYOUT_PRESETS[key];
}

export function nextLayoutKey(current: LayoutKey): LayoutKey {
  const index = LAYOUT_ORDER.indexOf(current);
  return LAYOUT_ORDER[(index + 1) % LAYOUT_ORDER.length] ?? "A";
}

export function centerToTopLeft(
  center: Point,
  width: number,
  height: number,
): Point {
  return {
    x: center.x - width / 2,
    y: center.y - height / 2,
  };
}

export function clampPosition(
  point: Point,
  size: { width: number; height: number },
  board: { width: number; height: number } = {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
  },
  padding = BOARD_PADDING,
): Point {
  const maxX = Math.max(padding, board.width - size.width - padding);
  const maxY = Math.max(padding, board.height - size.height - padding);
  return {
    x: Math.min(Math.max(point.x, padding), maxX),
    y: Math.min(Math.max(point.y, padding), maxY),
  };
}

export function buildConnectorPath(from: Point, to: Point): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dy) < 40) {
    const midX = from.x + dx / 2;
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  }

  const bendX = from.x + dx * 0.4;
  return `M ${from.x} ${from.y} C ${bendX} ${from.y}, ${bendX} ${to.y}, ${to.x} ${to.y}`;
}

export function portCenter(
  wrapper: Point,
  body: { x: number; y: number; width: number; height: number },
): Point {
  return {
    x: wrapper.x + body.x + body.width / 2,
    y: wrapper.y + body.y + body.height / 2,
  };
}
