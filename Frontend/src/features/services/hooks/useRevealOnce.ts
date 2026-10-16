"use client";

import { useEffect, useState } from "react";

export const REVEAL_EASE = "cubic-bezier(0.135, 0.9, 0.15, 1)";

type UseRevealOnceOptions = {
  rootMargin?: string;
  threshold?: number;
};

function readReduceMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useRevealOnce(options: UseRevealOnceOptions = {}) {
  const { rootMargin = "0px 0px -15% 0px", threshold = 0.12 } = options;
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(readReduceMotion);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!node || reduceMotion || revealed) {
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold },
    );
    observer.observe(node);

    // Above-the-fold heroes can miss the first IO callback after hydration.
    frame = window.requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setRevealed(true);
        observer.disconnect();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [node, reduceMotion, revealed, rootMargin, threshold]);

  return {
    setNode,
    revealed: reduceMotion || revealed,
    reduceMotion,
    ease: REVEAL_EASE,
  };
}
