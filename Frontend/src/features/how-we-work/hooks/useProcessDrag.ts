"use client";

import { useCallback, useEffect, useRef } from "react";
import { useProcessKeyboard } from "@/features/how-we-work/hooks/useProcessKeyboard";
import {
  applyDomPosition,
  clientDeltaToBoard,
  type CardGeometry,
  type CardPositionState,
} from "@/features/how-we-work/model/boardGeometry";
import type { InteractionMode } from "@/features/how-we-work/model/interactionMode";
import {
  clampPosition,
  type Point,
} from "@/features/how-we-work/model/processLayout";

export type { InteractionMode };

type UseProcessDragOptions = {
  enabled: boolean;
  positionsRef: React.MutableRefObject<CardPositionState>;
  geometryRef: React.MutableRefObject<Record<string, CardGeometry>>;
  getItems: () => Record<string, HTMLElement | null>;
  onPortsNeedUpdate: () => void;
  onCommit: (positions: CardPositionState) => void;
  onModeChange: (mode: InteractionMode) => void;
  announce: (message: string) => void;
  bumpZIndex: (id: string) => void;
  setDraggingId: (id: string | null) => void;
  isLocked: () => boolean;
};

const MOVE_THRESHOLD = 5;

export function useProcessDrag(options: UseProcessDragOptions) {
  const {
    enabled,
    positionsRef,
    geometryRef,
    getItems,
    onPortsNeedUpdate,
    onCommit,
    onModeChange,
    announce,
    bumpZIndex,
    setDraggingId,
    isLocked,
  } = options;

  const modeRef = useRef<InteractionMode>("idle");
  const gestureRef = useRef<{
    id: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    origin: Point;
    boardOrigin: DOMRect;
    dragging: boolean;
  } | null>(null);

  const setMode = useCallback(
    (mode: InteractionMode) => {
      modeRef.current = mode;
      onModeChange(mode);
    },
    [onModeChange],
  );

  const { onKeyDown } = useProcessKeyboard({
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
  });

  const endPointerGesture = useCallback(
    (restore = false) => {
      const gesture = gestureRef.current;
      if (!gesture) {
        return;
      }
      const item = getItems()[gesture.id];
      if (restore) {
        positionsRef.current[gesture.id] = gesture.origin;
        if (item) {
          applyDomPosition(item, gesture.origin);
        }
        announce(`Cancelled moving ${gesture.id} card`);
      } else if (gesture.dragging) {
        onCommit({ ...positionsRef.current });
        announce(`Moved ${gesture.id} card`);
      }
      if (item?.hasPointerCapture?.(gesture.pointerId)) {
        item.releasePointerCapture(gesture.pointerId);
      }
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("cursor");
      gestureRef.current = null;
      setDraggingId(null);
      setMode("idle");
      onPortsNeedUpdate();
    },
    [
      announce,
      getItems,
      onCommit,
      onPortsNeedUpdate,
      positionsRef,
      setDraggingId,
      setMode,
    ],
  );

  const onPointerDown = useCallback(
    (
      event: React.PointerEvent,
      id: string,
      opts?: { fromGrip?: boolean },
    ) => {
      if (!enabled || isLocked() || modeRef.current !== "idle") {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        !opts?.fromGrip &&
        target?.closest("a, button, input, textarea, select, [contenteditable]")
      ) {
        return;
      }
      if (event.pointerType === "touch" && !opts?.fromGrip) {
        return;
      }
      const board = (event.currentTarget as HTMLElement).closest(
        "[data-hww-board]",
      );
      if (!(board instanceof HTMLElement)) {
        return;
      }
      const origin = positionsRef.current[id];
      if (!origin) {
        return;
      }
      gestureRef.current = {
        id,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        origin: { ...origin },
        boardOrigin: board.getBoundingClientRect(),
        dragging: false,
      };
      getItems()[id]?.setPointerCapture(event.pointerId);
    },
    [enabled, getItems, isLocked, positionsRef],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const gesture = gestureRef.current;
      if (!gesture || event.pointerId !== gesture.pointerId) {
        return;
      }
      const dx = event.clientX - gesture.startClientX;
      const dy = event.clientY - gesture.startClientY;
      if (!gesture.dragging && Math.hypot(dx, dy) < MOVE_THRESHOLD) {
        return;
      }
      if (!gesture.dragging) {
        gesture.dragging = true;
        setMode("pointer-drag");
        bumpZIndex(gesture.id);
        setDraggingId(gesture.id);
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
        announce(`Picked up ${gesture.id} card`);
      }
      event.preventDefault();
      const board = (event.currentTarget as HTMLElement).closest(
        "[data-hww-board]",
      );
      const boardRect =
        board instanceof HTMLElement
          ? board.getBoundingClientRect()
          : gesture.boardOrigin;
      const boardDelta = clientDeltaToBoard(dx, dy, boardRect);
      const geometry = geometryRef.current[gesture.id];
      if (!geometry) {
        return;
      }
      const next = clampPosition(
        {
          x: gesture.origin.x + boardDelta.x,
          y: gesture.origin.y + boardDelta.y,
        },
        { width: geometry.width, height: geometry.height },
      );
      positionsRef.current[gesture.id] = next;
      const item = getItems()[gesture.id];
      if (item) {
        applyDomPosition(item, next);
      }
      onPortsNeedUpdate();
    },
    [
      announce,
      bumpZIndex,
      geometryRef,
      getItems,
      onPortsNeedUpdate,
      positionsRef,
      setDraggingId,
      setMode,
    ],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      const gesture = gestureRef.current;
      if (!gesture || event.pointerId !== gesture.pointerId) {
        return;
      }
      endPointerGesture(false);
    },
    [endPointerGesture],
  );

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && gestureRef.current) {
        event.preventDefault();
        endPointerGesture(true);
      }
    };
    window.addEventListener("keydown", onEscape, true);
    return () => {
      window.removeEventListener("keydown", onEscape, true);
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("cursor");
    };
  }, [endPointerGesture]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: () => endPointerGesture(false),
    onKeyDown,
    endPointerGesture,
  };
}
