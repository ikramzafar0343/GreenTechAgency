"use client";

import { useEffect, useState, type RefObject } from "react";

export type InsightsMode = "horizontal" | "vertical";

export type InsightsGeometry = {
  mode: InsightsMode;
  rowWidth: number;
  collapsedWidth: number;
  expandedWidth: number;
  reduceMotion: boolean;
};

const MIN_DESKTOP_WIDTH = 1200;
const MIN_EXPANDED = 560;
const ROW_HEIGHT_BUDGET = 700;

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function measureGeometry(
  rowWidth: number,
  panelCount: number,
  canHoverFine: boolean,
  reduceMotion: boolean,
): InsightsGeometry {
  const collapsedWidth = clamp(64, rowWidth * 0.055, 88);
  const expandedWidth =
    panelCount <= 1
      ? rowWidth
      : rowWidth - (panelCount - 1) * collapsedWidth;

  const fitsHorizontally =
    canHoverFine &&
    rowWidth >= MIN_DESKTOP_WIDTH &&
    expandedWidth >= MIN_EXPANDED &&
    panelCount > 0;

  return {
    mode: fitsHorizontally ? "horizontal" : "vertical",
    rowWidth,
    collapsedWidth,
    expandedWidth: Math.max(expandedWidth, MIN_EXPANDED),
    reduceMotion,
  };
}

export function useInsightsLayout(
  rowRef: RefObject<HTMLElement | null>,
  panelCount: number,
): InsightsGeometry {
  const [geometry, setGeometry] = useState<InsightsGeometry>(() =>
    measureGeometry(1440, panelCount, true, false),
  );

  useEffect(() => {
    const node = rowRef.current;
    if (!node) {
      return;
    }

    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const width = node.getBoundingClientRect().width;
      const next = measureGeometry(
        width,
        panelCount,
        hoverQuery.matches,
        motionQuery.matches,
      );

      // Tall text zoom: if the visual viewport is heavily zoomed, prefer vertical.
      const zoomed =
        typeof window.visualViewport?.scale === "number" &&
        window.visualViewport.scale >= 1.75;
      if (zoomed && next.mode === "horizontal") {
        setGeometry({ ...next, mode: "vertical" });
        return;
      }

      void ROW_HEIGHT_BUDGET;
      setGeometry(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    hoverQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      hoverQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [panelCount, rowRef]);

  return geometry;
}
