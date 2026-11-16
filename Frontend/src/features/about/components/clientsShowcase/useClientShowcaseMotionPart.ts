"use client";

import gsap from "gsap";
import { type RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

export const DESKTOP_MIN = 1024;

export const MIN_PIN_HEIGHT = 560;

export const INACTIVE = 0.28;

export const FOCUS_RATIO = 0.48;

/** Brandium left-column inset for the logo tile (Y tracks active name only). */
export const PREVIEW_LEFT_MIN = 48;

export const PREVIEW_LEFT_MAX = 132;

export const PREVIEW_LEFT_RATIO = 0.09;

export type UseClientShowcaseMotionOptions = {
  rootRef: RefObject<HTMLElement | null>;
  namesRef: RefObject<HTMLUListElement | null>;
  itemCount: number;
  hoverIndex: number | null;
  onScrollIndexChange: (index: number) => void;
  onScrub: () => void;
  scrollToIndexRef: RefObject<((index: number) => void) | null>;
};

export function canPin() {
  if (prefersReducedMotion()) return false;
  if (window.innerWidth < DESKTOP_MIN) return false;
  if (window.innerHeight < MIN_PIN_HEIGHT) return false;
  return true;
}

export function paintNames(
  buttons: HTMLElement[],
  position: number,
  hoverIndex: number | null,
) {
  buttons.forEach((button, index) => {
    if (hoverIndex !== null) {
      const active = index === hoverIndex;
      gsap.set(button, {
        color: active ? "#f7f7f7" : "#4a4a4a",
        scale: active ? 1 : 0.78,
        opacity: active ? 1 : 0.55,
        transformOrigin: "50% 50%",
      });
      return;
    }

    const distance = Math.abs(index - position);
    const intensity = 1 - Math.min(Math.max((distance - 0.04) / 1.45, 0), 1);
    const mix = INACTIVE + intensity * (1 - INACTIVE);
    const channel = Math.round(70 + mix * (247 - 70));
    const scale = 0.72 + intensity * 0.28;
    const opacity = 0.32 + intensity * 0.68;
    gsap.set(button, {
      color: `rgb(${channel} ${channel} ${channel})`,
      scale,
      opacity,
      transformOrigin: "50% 50%",
    });
  });
}

export function closestIndex(
  buttons: HTMLElement[],
  focusViewportY: number,
): number {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  buttons.forEach((button, index) => {
    const rect = button.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const distance = Math.abs(mid - focusViewportY);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}
