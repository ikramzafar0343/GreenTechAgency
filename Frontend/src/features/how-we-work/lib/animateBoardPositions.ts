import gsap from "gsap";
import {
  applyDomPosition,
  type CardPositionState,
} from "@/features/how-we-work/model/boardGeometry";
import type { Point } from "@/features/how-we-work/model/processLayout";

type AnimateBoardPositionsOptions = {
  from: CardPositionState;
  to: CardPositionState;
  itemRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  positionsRef: React.MutableRefObject<CardPositionState>;
  onFrame: () => void;
  reduceMotion: boolean;
  duration?: number;
};

export function animateBoardPositions({
  from,
  to,
  itemRefs,
  positionsRef,
  onFrame,
  reduceMotion,
  duration = 0.55,
}: AnimateBoardPositionsOptions): Promise<CardPositionState> {
  if (reduceMotion) {
    positionsRef.current = to;
    for (const [id, point] of Object.entries(to)) {
      const item = itemRefs.current[id];
      if (item) {
        applyDomPosition(item, point);
      }
    }
    onFrame();
    return Promise.resolve(to);
  }

  const tweens: gsap.core.Tween[] = [];

  return new Promise((resolve) => {
    const ids = Object.keys(to);
    let remaining = ids.length;

    if (remaining === 0) {
      resolve(to);
      return;
    }

    for (const id of ids) {
      const start = from[id] ?? to[id];
      const end = to[id];
      if (!start || !end) {
        remaining -= 1;
        if (remaining === 0) {
          positionsRef.current = to;
          resolve(to);
        }
        continue;
      }

      const proxy: Point = { x: start.x, y: start.y };
      const tween = gsap.to(proxy, {
        x: end.x,
        y: end.y,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          const point = { x: proxy.x, y: proxy.y };
          positionsRef.current[id] = point;
          const item = itemRefs.current[id];
          if (item) {
            applyDomPosition(item, point);
          }
          onFrame();
        },
        onComplete: () => {
          remaining -= 1;
          if (remaining === 0) {
            positionsRef.current = to;
            onFrame();
            resolve(to);
          }
        },
      });
      tweens.push(tween);
    }
  });
}
