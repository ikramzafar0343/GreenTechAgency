"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrolling is native: the browser keeps it on the compositor, so the page tracks
 * the wheel exactly instead of easing towards it. ScrollTrigger reads that same
 * native position. Anchor offset lives in `scroll-padding-top` (globals.css).
 */
export function ScrollMotionConfig() {
  useEffect(() => {
    // Under load, drop a frame of animation rather than a frame of scrolling.
    gsap.ticker.lagSmoothing(500, 33);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }, []);
  return null;
}
