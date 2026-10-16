import type { TrailPoint } from "@/ui/components/interactive/mouseTrailTypes";

export function distance(a: TrailPoint, b: TrailPoint) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

export function isFarEnough(
  point: TrailPoint,
  others: readonly TrailPoint[],
  minSeparation: number,
) {
  return others.every((other) => distance(point, other) >= minSeparation);
}

/**
 * Walk a pointer segment and invoke onSample at each spawnDistance interval.
 * Returns the leftover path distance after the last spawn.
 */
export function sampleSegmentAtFixedIntervals(
  start: TrailPoint,
  end: TrailPoint,
  segmentLength: number,
  carryDistance: number,
  spawnDistance: number,
  onSample: (point: TrailPoint) => void,
): number {
  if (segmentLength <= 0 || spawnDistance <= 0) {
    return carryDistance;
  }

  let accumulated = carryDistance;
  let consumed = 0;

  while (accumulated + (segmentLength - consumed) >= spawnDistance) {
    const need = spawnDistance - accumulated;
    consumed += need;
    const t = consumed / segmentLength;
    onSample({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    });
    accumulated = 0;
  }

  return accumulated + (segmentLength - consumed);
}
