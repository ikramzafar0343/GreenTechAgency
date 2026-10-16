"use client";

const CARD_TRAVEL_PX = 420;
const SPEED_PX_PER_SEC = 42;

export function useEmployeeMarquee(itemCount: number) {
  const shouldLoop = itemCount > 1;
  const durationSeconds = Math.max(
    24,
    Math.round((itemCount * CARD_TRAVEL_PX) / SPEED_PX_PER_SEC),
  );

  return {
    shouldLoop,
    durationSeconds,
  };
}
