"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BoardControls } from "@/features/how-we-work/components/BoardControls";
import { ProcessCard } from "@/features/how-we-work/components/ProcessCard";
import { ProcessConnectors } from "@/features/how-we-work/components/ProcessConnectors";
import {
  GRIP_HELP_ID,
  ProcessBoardItems,
} from "@/features/how-we-work/components/ProcessBoardItems";
import { useBoardLayout } from "@/features/how-we-work/hooks/useBoardLayout";
import {
  useProcessDrag,
  type InteractionMode,
} from "@/features/how-we-work/hooks/useProcessDrag";
import { animateBoardPositions } from "@/features/how-we-work/lib/animateBoardPositions";
import { positionsFromPreset } from "@/features/how-we-work/model/boardGeometry";
import {
  HOW_WE_WORK_BOARD,
  nextLayoutKey,
  type LayoutKey,
} from "@/features/how-we-work/model/processLayout";
import { type ProcessStage } from "@/features/how-we-work/model/processStages";
import chrome from "@/features/how-we-work/styles/boardChrome.module.css";
import styles from "@/features/how-we-work/styles/howWeWork.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FREEFORM_COUNT = 6;

type ProcessBoardProps = {
  stages: readonly ProcessStage[];
};

export function ProcessBoard({ stages }: ProcessBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const zCounter = useRef(2);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mode, setMode] = useState<InteractionMode>("idle");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const [reduceMotion, setReduceMotion] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const dragEnabled =
    HOW_WE_WORK_BOARD.dragEnabled && stages.length === FREEFORM_COUNT;
  const locked = mode === "preset-animation";

  const layout = useBoardLayout({
    stages,
    boardRef,
    svgRef,
    itemRefs,
    interactionLocked: locked || mode === "pointer-drag" || mode === "keyboard-move",
  });

  const announce = useCallback((message: string) => {
    setLiveMessage(message);
  }, []);

  const bumpZIndex = useCallback((id: string) => {
    zCounter.current += 1;
    setZMap((current) => ({ ...current, [id]: zCounter.current }));
  }, []);

  const getItems = useCallback(() => itemRefs.current, []);
  const isLocked = useCallback(() => mode === "preset-animation", [mode]);

  const drag = useProcessDrag({
    enabled: dragEnabled,
    positionsRef: layout.positionsRef,
    geometryRef: layout.geometryRef,
    getItems,
    onPortsNeedUpdate: layout.syncPorts,
    onCommit: layout.setPositions,
    onModeChange: setMode,
    announce,
    bumpZIndex,
    setDraggingId,
    isLocked,
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const {
    measureGeometry,
    positionsRef,
    syncPorts,
    setPositions,
    setLayoutKey,
    getLayoutKey,
  } = layout;

  const animateToLayout = useCallback(
    async (key: LayoutKey) => {
      if (mode === "pointer-drag" || mode === "keyboard-move") {
        drag.endPointerGesture(false);
      }
      const geometry = measureGeometry();
      if (!geometry) {
        return;
      }
      const target = positionsFromPreset(key, geometry);
      setMode("preset-animation");
      setLayoutKey(key);
      const result = await animateBoardPositions({
        from: { ...positionsRef.current },
        to: target,
        itemRefs,
        positionsRef,
        onFrame: syncPorts,
        reduceMotion,
      });
      setPositions(result);
      setMode("idle");
    },
    [
      drag,
      measureGeometry,
      mode,
      positionsRef,
      reduceMotion,
      setLayoutKey,
      setPositions,
      syncPorts,
    ],
  );

  const activeIds = useMemo(() => {
    if (!hoveredId) {
      return new Set<string>();
    }
    const index = stages.findIndex((stage) => stage.id === hoveredId);
    const ids = new Set<string>([hoveredId]);
    const previous = stages[index - 1];
    const next = stages[index + 1];
    if (previous) ids.add(previous.id);
    if (next) ids.add(next.id);
    return ids;
  }, [hoveredId, stages]);

  useGSAP(
    () => {
      const board = boardRef.current;
      if (!board || reduceMotion || !layout.ready) {
        return;
      }
      const intro = board
        .closest("section")
        ?.querySelectorAll("[data-hww-intro]");
      const visuals = board.querySelectorAll("[data-hww-visual]");
      const paths = board.querySelectorAll(`.${styles.path}`);
      gsap.set(intro ?? [], { opacity: 0, y: 16 });
      gsap.set(visuals, { opacity: 0 });
      gsap.set(paths, { strokeDasharray: 420, strokeDashoffset: 420 });
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: board, start: "top 80%", once: true },
      });
      if (intro && intro.length > 0) {
        timeline.to(intro, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        });
      }
      timeline.to(
        visuals,
        { opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" },
        "-=0.15",
      );
      timeline.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power1.out",
        },
        "-=0.2",
      );
    },
    { dependencies: [reduceMotion, layout.ready], scope: boardRef },
  );

  return (
    <div className={styles.boardWrap}>
      <p id={GRIP_HELP_ID} className={chrome.srOnly}>
        Press Enter to move. Use arrow keys to reposition. Hold Shift for larger
        steps. Press Enter to finish or Escape to cancel.
      </p>
      <div className={chrome.liveRegion} aria-live="polite">
        {liveMessage}
      </div>

      <div
        ref={boardRef}
        className={styles.board}
        data-hww-board
        data-drag-enabled={dragEnabled ? "true" : "false"}
      >
        <ProcessConnectors
          points={layout.ports}
          activeIds={activeIds}
          svgRef={svgRef}
        />
        <ProcessBoardItems
          stages={stages}
          positions={layout.positions}
          dragEnabled={dragEnabled}
          draggingId={draggingId}
          zMap={zMap}
          itemRefs={itemRefs}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerCancel}
          onKeyDown={drag.onKeyDown}
          onHover={setHoveredId}
        />
      </div>

      {dragEnabled ? (
        <BoardControls
          disabled={locked}
          onRearrange={() => {
            void animateToLayout(nextLayoutKey(getLayoutKey()));
          }}
          onReset={() => {
            void animateToLayout("A");
          }}
        />
      ) : null}

      <ol className={styles.compact} aria-label="How we work process">
        {stages.map((stage) => (
          <li key={`compact-${stage.id}`} className={styles.compactItem}>
            <p className={`${styles.stageLabel} typeMeta`}>
              {stage.number} {stage.title}
            </p>
            <ProcessCard stage={stage} className={styles.compactCard} />
          </li>
        ))}
      </ol>
    </div>
  );
}
