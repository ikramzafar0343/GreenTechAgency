import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  centerToTopLeft,
  clampPosition,
  getLayoutPoints,
  portCenter,
  type LayoutKey,
  type Point,
} from "@/features/how-we-work/model/processLayout";

export type BodyRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CardGeometry = {
  id: string;
  width: number;
  height: number;
  body: BodyRect;
};

export type CardPositionState = Record<string, Point>;

export function clientDeltaToBoard(
  deltaX: number,
  deltaY: number,
  boardRect: DOMRect,
): Point {
  return {
    x: deltaX * (BOARD_WIDTH / boardRect.width),
    y: deltaY * (BOARD_HEIGHT / boardRect.height),
  };
}

export function measureCardGeometry(
  wrapper: HTMLElement,
  body: HTMLElement,
  boardRect: DOMRect,
): Omit<CardGeometry, "id"> {
  const scaleX = BOARD_WIDTH / boardRect.width;
  const scaleY = BOARD_HEIGHT / boardRect.height;
  const wrapperRect = wrapper.getBoundingClientRect();
  const bodyRect = body.getBoundingClientRect();

  return {
    width: wrapperRect.width * scaleX,
    height: wrapperRect.height * scaleY,
    body: {
      x: (bodyRect.left - wrapperRect.left) * scaleX,
      y: (bodyRect.top - wrapperRect.top) * scaleY,
      width: bodyRect.width * scaleX,
      height: bodyRect.height * scaleY,
    },
  };
}

export function positionsFromPreset(
  layoutKey: LayoutKey,
  geometry: Record<string, CardGeometry>,
): CardPositionState {
  const centers = getLayoutPoints(layoutKey);
  const next: CardPositionState = {};

  for (const [id, center] of Object.entries(centers)) {
    const size = geometry[id];
    if (!size) {
      continue;
    }
    next[id] = clampPosition(centerToTopLeft(center, size.width, size.height), {
      width: size.width,
      height: size.height,
    });
  }

  return next;
}

export function connectorPorts(
  positions: CardPositionState,
  geometry: Record<string, CardGeometry>,
): Record<string, Point> {
  const ports: Record<string, Point> = {};
  for (const [id, position] of Object.entries(positions)) {
    const size = geometry[id];
    if (!size) {
      continue;
    }
    ports[id] = portCenter(position, size.body);
  }
  return ports;
}

export function applyDomPosition(
  element: HTMLElement,
  point: Point,
): void {
  element.style.left = `${(point.x / BOARD_WIDTH) * 100}%`;
  element.style.top = `${(point.y / BOARD_HEIGHT) * 100}%`;
}
