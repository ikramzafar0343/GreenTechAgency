"use client";

import { useEffect, useState } from "react";

type HeaderScrollState = {
  isScrolled: boolean;
  enableTransition: boolean;
};

export function useHeaderScrollState(): HeaderScrollState {
  const [isScrolled, setIsScrolled] = useState(false);
  const [enableTransition, setEnableTransition] = useState(false);

  useEffect(() => {
    const readScrolled = () => Math.max(0, window.scrollY) > 0;

    const sync = () => {
      const next = readScrolled();
      setIsScrolled((previous) => (previous === next ? previous : next));
    };

    sync();
    const frame = window.requestAnimationFrame(() => {
      setEnableTransition(true);
    });

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("pageshow", sync);
    window.addEventListener("popstate", sync);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("pageshow", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  return { isScrolled, enableTransition };
}
