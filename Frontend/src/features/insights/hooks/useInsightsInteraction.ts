"use client";

import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import type { InsightsMode } from "@/features/insights/hooks/useInsightsLayout";

const HOVER_INTENT_MS = 85;
const MOVE_ARM_PX = 3;

type UseInsightsInteractionArgs = {
  articleIds: string[];
  initialOpenId: string;
  mode: InsightsMode;
};

export function useInsightsInteraction({
  articleIds,
  initialOpenId,
  mode,
}: UseInsightsInteractionArgs) {
  const startId = articleIds.includes(initialOpenId)
    ? initialOpenId
    : (articleIds[0] ?? "");

  const [activeId, setActiveId] = useState(startId);
  const hoverTimer = useRef<number | null>(null);
  const armed = useRef(true);
  const lastPoint = useRef({ x: 0, y: 0 });
  const focusInsideExpanded = useRef(false);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const activate = useCallback(
    (id: string) => {
      if (!articleIds.includes(id)) {
        return;
      }
      setActiveId(id);
      armed.current = false;
    },
    [articleIds],
  );

  const onRowPointerMove = useCallback((event: PointerEvent) => {
    const dx = Math.abs(event.clientX - lastPoint.current.x);
    const dy = Math.abs(event.clientY - lastPoint.current.y);
    if (dx >= MOVE_ARM_PX || dy >= MOVE_ARM_PX) {
      armed.current = true;
    }
    lastPoint.current = { x: event.clientX, y: event.clientY };
  }, []);

  const onRailPointerEnter = useCallback(
    (id: string) => {
      if (mode !== "horizontal") {
        return;
      }
      if (focusInsideExpanded.current) {
        return;
      }
      if (id === activeId) {
        clearHoverTimer();
        return;
      }
      if (!armed.current) {
        return;
      }

      clearHoverTimer();
      hoverTimer.current = window.setTimeout(() => {
        activate(id);
      }, HOVER_INTENT_MS);
    },
    [activate, activeId, clearHoverTimer, mode],
  );

  const onRailPointerLeave = useCallback(() => {
    clearHoverTimer();
  }, [clearHoverTimer]);

  const onRailFocus = useCallback(
    (id: string) => {
      activate(id);
    },
    [activate],
  );

  const onRailClick = useCallback(
    (id: string) => {
      if (mode === "vertical") {
        setActiveId((current) => (current === id ? "" : id));
        return;
      }
      activate(id);
    },
    [activate, mode],
  );

  const onExpandedFocusIn = useCallback(() => {
    focusInsideExpanded.current = true;
  }, []);

  const onExpandedFocusOut = useCallback((event: FocusEvent) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) {
      return;
    }
    focusInsideExpanded.current = false;
  }, []);

  return {
    activeId,
    onRowPointerMove,
    onRailPointerEnter,
    onRailPointerLeave,
    onRailFocus,
    onRailClick,
    onExpandedFocusIn,
    onExpandedFocusOut,
  };
}
