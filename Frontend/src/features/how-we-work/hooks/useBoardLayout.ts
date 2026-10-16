"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { paintConnectors } from "@/features/how-we-work/lib/paintConnectors";
import {
  applyDomPosition,
  connectorPorts,
  measureCardGeometry,
  positionsFromPreset,
  type CardGeometry,
  type CardPositionState,
} from "@/features/how-we-work/model/boardGeometry";
import {
  clampPosition,
  type LayoutKey,
} from "@/features/how-we-work/model/processLayout";
import type { ProcessStage } from "@/features/how-we-work/model/processStages";

type UseBoardLayoutOptions = {
  stages: readonly ProcessStage[];
  boardRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  itemRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  interactionLocked: boolean;
};

export function useBoardLayout({
  stages,
  boardRef,
  svgRef,
  itemRefs,
  interactionLocked,
}: UseBoardLayoutOptions) {
  const positionsRef = useRef<CardPositionState>({});
  const geometryRef = useRef<Record<string, CardGeometry>>({});
  const layoutKeyRef = useRef<LayoutKey>("A");
  const readyRef = useRef(false);
  const lockedRef = useRef(interactionLocked);
  const [positions, setPositions] = useState<CardPositionState>({});
  const [ports, setPorts] = useState<Record<string, { x: number; y: number }>>(
    {},
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    lockedRef.current = interactionLocked;
  }, [interactionLocked]);

  const syncPorts = useCallback(() => {
    const nextPorts = connectorPorts(positionsRef.current, geometryRef.current);
    paintConnectors(svgRef.current, nextPorts);
    setPorts(nextPorts);
  }, [svgRef]);

  const measureGeometry = useCallback(() => {
    const board = boardRef.current;
    if (!board) {
      return null;
    }
    const boardRect = board.getBoundingClientRect();
    if (boardRect.width < 1) {
      return null;
    }
    const geometry: Record<string, CardGeometry> = {};
    for (const stage of stages) {
      const wrapper = itemRefs.current[stage.id];
      const body = wrapper?.querySelector("[data-hww-body]");
      if (!(wrapper instanceof HTMLElement) || !(body instanceof HTMLElement)) {
        continue;
      }
      geometry[stage.id] = {
        id: stage.id,
        ...measureCardGeometry(wrapper, body, boardRect),
      };
    }
    geometryRef.current = geometry;
    return geometry;
  }, [boardRef, itemRefs, stages]);

  const writePositions = useCallback(
    (next: CardPositionState) => {
      positionsRef.current = next;
      for (const [id, point] of Object.entries(next)) {
        const item = itemRefs.current[id];
        if (item) {
          applyDomPosition(item, point);
        }
      }
      setPositions(next);
      syncPorts();
    },
    [itemRefs, syncPorts],
  );

  const applyPreset = useCallback(
    (key: LayoutKey) => {
      const geometry = measureGeometry();
      if (!geometry) {
        return null;
      }
      layoutKeyRef.current = key;
      const next = positionsFromPreset(key, geometry);
      writePositions(next);
      readyRef.current = true;
      setReady(true);
      return next;
    },
    [measureGeometry, writePositions],
  );

  useEffect(() => {
    const board = boardRef.current;
    if (!board) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (lockedRef.current) {
        return;
      }
      if (!readyRef.current) {
        applyPreset(layoutKeyRef.current);
        return;
      }
      const geometry = measureGeometry();
      if (!geometry) {
        return;
      }
      const fallback = positionsFromPreset(layoutKeyRef.current, geometry);
      const clamped: CardPositionState = {};
      for (const stage of stages) {
        const current = positionsRef.current[stage.id];
        const size = geometry[stage.id];
        if (current && size) {
          clamped[stage.id] = clampPosition(current, {
            width: size.width,
            height: size.height,
          });
        } else {
          const point = fallback[stage.id];
          if (point) {
            clamped[stage.id] = point;
          }
        }
      }
      writePositions(clamped);
    });

    observer.observe(board);
    return () => observer.disconnect();
  }, [applyPreset, boardRef, measureGeometry, stages, writePositions]);

  const setLayoutKey = useCallback((key: LayoutKey) => {
    layoutKeyRef.current = key;
  }, []);

  const getLayoutKey = useCallback(() => layoutKeyRef.current, []);

  return {
    positions,
    setPositions,
    ports,
    ready,
    positionsRef,
    geometryRef,
    syncPorts,
    measureGeometry,
    applyPreset,
    writePositions,
    setLayoutKey,
    getLayoutKey,
  };
}
