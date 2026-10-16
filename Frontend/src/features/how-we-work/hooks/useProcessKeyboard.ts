"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  applyDomPosition,
  type CardGeometry,
  type CardPositionState,
} from "@/features/how-we-work/model/boardGeometry";
import {
  clampPosition,
  type Point,
} from "@/features/how-we-work/model/processLayout";
import type { InteractionMode } from "@/features/how-we-work/model/interactionMode";

type Options = {
  enabled: boolean;
  positionsRef: React.MutableRefObject<CardPositionState>;
  geometryRef: React.MutableRefObject<Record<string, CardGeometry>>;
  getItems: () => Record<string, HTMLElement | null>;
  onPortsNeedUpdate: () => void;
  onCommit: (positions: CardPositionState) => void;
  onModeChange: (mode: InteractionMode) => void;
  announce: (message: string) => void;
  bumpZIndex: (id: string) => void;
  isLocked: () => boolean;
  modeRef: React.MutableRefObject<InteractionMode>;
};

const STEP = 10;
const STEP_LARGE = 30;

export function useProcessKeyboard({
  enabled,
  positionsRef,
  geometryRef,
  getItems,
  onPortsNeedUpdate,
  onCommit,
  onModeChange,
  announce,
  bumpZIndex,
  isLocked,
  modeRef,
}: Options) {
  const keyboardRef = useRef<{ id: string; origin: Point } | null>(null);

  const toggleKeyboardMove = useCallback(
    (id: string) => {
      if (!enabled || isLocked()) {
        return;
      }
      if (keyboardRef.current?.id === id) {
        onCommit({ ...positionsRef.current });
        announce(`Finished moving ${id} card`);
        keyboardRef.current = null;
        modeRef.current = "idle";
        onModeChange("idle");
        return;
      }
      if (modeRef.current !== "idle") {
        return;
      }
      const origin = positionsRef.current[id];
      if (!origin) {
        return;
      }
      keyboardRef.current = { id, origin: { ...origin } };
      bumpZIndex(id);
      modeRef.current = "keyboard-move";
      onModeChange("keyboard-move");
      announce(`Picked up ${id} card. Use arrow keys to move.`);
    },
    [
      announce,
      bumpZIndex,
      enabled,
      isLocked,
      modeRef,
      onCommit,
      onModeChange,
      positionsRef,
    ],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, id: string) => {
      if (!enabled || isLocked()) {
        return;
      }
      if (event.key === "Escape" && keyboardRef.current?.id === id) {
        event.preventDefault();
        const origin = keyboardRef.current.origin;
        positionsRef.current[id] = origin;
        const item = getItems()[id];
        if (item) {
          applyDomPosition(item, origin);
        }
        onPortsNeedUpdate();
        announce(`Cancelled moving ${id} card`);
        keyboardRef.current = null;
        modeRef.current = "idle";
        onModeChange("idle");
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        if (
          event.target instanceof HTMLElement &&
          event.target.dataset.hwwGrip === "true"
        ) {
          event.preventDefault();
          toggleKeyboardMove(id);
        }
        return;
      }
      if (keyboardRef.current?.id !== id) {
        return;
      }
      const step = event.shiftKey ? STEP_LARGE : STEP;
      let dx = 0;
      let dy = 0;
      if (event.key === "ArrowLeft") dx = -step;
      else if (event.key === "ArrowRight") dx = step;
      else if (event.key === "ArrowUp") dy = -step;
      else if (event.key === "ArrowDown") dy = step;
      else return;

      event.preventDefault();
      const geometry = geometryRef.current[id];
      const current = positionsRef.current[id];
      if (!geometry || !current) {
        return;
      }
      const next = clampPosition(
        { x: current.x + dx, y: current.y + dy },
        { width: geometry.width, height: geometry.height },
      );
      positionsRef.current[id] = next;
      const item = getItems()[id];
      if (item) {
        applyDomPosition(item, next);
      }
      onPortsNeedUpdate();
    },
    [
      announce,
      enabled,
      geometryRef,
      getItems,
      isLocked,
      modeRef,
      onModeChange,
      onPortsNeedUpdate,
      positionsRef,
      toggleKeyboardMove,
    ],
  );

  useEffect(() => {
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !keyboardRef.current) {
        return;
      }
      onCommit({ ...positionsRef.current });
      announce(`Finished moving ${keyboardRef.current.id} card`);
      keyboardRef.current = null;
      modeRef.current = "idle";
      onModeChange("idle");
    };
    window.addEventListener("keydown", onTab, true);
    return () => window.removeEventListener("keydown", onTab, true);
  }, [announce, modeRef, onCommit, onModeChange, positionsRef]);

  return { onKeyDown, keyboardRef };
}
