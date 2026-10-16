import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  buildConnectorPath,
  type Point,
} from "@/features/how-we-work/model/processLayout";
import { PROCESS_CONNECTOR_ORDER } from "@/features/how-we-work/model/processStages";
import styles from "@/features/how-we-work/styles/howWeWork.module.css";

type ProcessConnectorsProps = {
  points: Record<string, Point>;
  activeIds: ReadonlySet<string>;
  svgRef?: React.RefObject<SVGSVGElement | null>;
};

export function ProcessConnectors({
  points,
  activeIds,
  svgRef,
}: ProcessConnectorsProps) {
  const pairs = PROCESS_CONNECTOR_ORDER.slice(0, -1).map((id, index) => {
    const nextId = PROCESS_CONNECTOR_ORDER[index + 1];
    return {
      id: `${id}-${nextId}`,
      fromId: id,
      toId: nextId ?? id,
    };
  });

  return (
    <svg
      ref={svgRef}
      className={styles.connectors}
      viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
      aria-hidden="true"
      focusable="false"
    >
      {pairs.map((pair) => {
        const from = points[pair.fromId];
        const to = points[pair.toId];
        if (!from || !to) {
          return null;
        }

        const isActive =
          activeIds.has(pair.fromId) || activeIds.has(pair.toId);

        return (
          <g key={pair.id} data-connector={pair.id}>
            <path
              data-connector-path
              d={buildConnectorPath(from, to)}
              className={`${styles.path} ${isActive ? styles.pathActive : ""}`}
            />
            <circle
              data-connector-from
              className={styles.port}
              cx={from.x}
              cy={from.y}
              r={5}
            />
            <circle
              data-connector-to
              className={styles.port}
              cx={to.x}
              cy={to.y}
              r={5}
            />
          </g>
        );
      })}
    </svg>
  );
}
