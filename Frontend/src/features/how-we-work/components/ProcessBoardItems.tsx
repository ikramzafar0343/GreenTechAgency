import { ProcessCard } from "@/features/how-we-work/components/ProcessCard";
import type { CardPositionState } from "@/features/how-we-work/model/boardGeometry";
import { BOARD_HEIGHT, BOARD_WIDTH } from "@/features/how-we-work/model/processLayout";
import type { ProcessStage } from "@/features/how-we-work/model/processStages";
import styles from "@/features/how-we-work/styles/howWeWork.module.css";

const GRIP_HELP_ID = "hww-drag-help";

type ProcessBoardItemsProps = {
  stages: readonly ProcessStage[];
  positions: CardPositionState;
  dragEnabled: boolean;
  draggingId: string | null;
  zMap: Record<string, number>;
  itemRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  onPointerDown: (
    event: React.PointerEvent,
    id: string,
    options?: { fromGrip?: boolean },
  ) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
  onPointerCancel: () => void;
  onKeyDown: (event: React.KeyboardEvent, id: string) => void;
  onHover: (id: string | null) => void;
};

export function ProcessBoardItems({
  stages,
  positions,
  dragEnabled,
  draggingId,
  zMap,
  itemRefs,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
  onHover,
}: ProcessBoardItemsProps) {
  return (
    <ol className={styles.list}>
      {stages.map((stage) => {
        const point = positions[stage.id];
        return (
          <li
            key={stage.id}
            ref={(node) => {
              itemRefs.current[stage.id] = node;
            }}
            className={`${styles.item} ${dragEnabled ? styles.itemDraggable : ""}`}
            data-dragging={draggingId === stage.id ? "true" : "false"}
            style={{
              left: point ? `${(point.x / BOARD_WIDTH) * 100}%` : "0%",
              top: point ? `${(point.y / BOARD_HEIGHT) * 100}%` : "0%",
              zIndex: zMap[stage.id] ?? 1,
            }}
            onPointerDown={(event) => onPointerDown(event, stage.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onKeyDown={(event) => onKeyDown(event, stage.id)}
            onMouseEnter={() => onHover(stage.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div data-hww-visual className={styles.itemVisual}>
              <p className={`${styles.stageLabel} typeMeta`}>
                {stage.number} {stage.title}
              </p>
              <ProcessCard
                stage={stage}
                showGrip={dragEnabled}
                gripDescribedBy={GRIP_HELP_ID}
                onGripPointerDown={(event) => {
                  event.stopPropagation();
                  onPointerDown(event, stage.id, { fromGrip: true });
                }}
                onGripKeyDown={(event) => onKeyDown(event, stage.id)}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { GRIP_HELP_ID };
