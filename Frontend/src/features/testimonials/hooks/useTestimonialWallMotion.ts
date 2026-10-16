"use client";

import { useEffect, type RefObject } from "react";

type UseTestimonialWallMotionOptions = {
  enabled: boolean;
  wallRef: RefObject<HTMLElement | null>;
  paused: boolean;
};

/**
 * Scroll-linked column parallax is intentionally disabled.
 * GSAP scrub transforms fought the static wave offsets and caused a
 * correct first paint to collapse into a scrambled 4-card row after hydration.
 */
export function useTestimonialWallMotion({
  enabled,
  wallRef,
  paused,
}: UseTestimonialWallMotionOptions) {
  useEffect(() => {
    void enabled;
    void wallRef;
    void paused;
  }, [enabled, wallRef, paused]);
}
