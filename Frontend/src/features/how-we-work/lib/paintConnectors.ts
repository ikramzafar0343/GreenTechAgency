import {
  buildConnectorPath,
  type Point,
} from "@/features/how-we-work/model/processLayout";
import { PROCESS_CONNECTOR_ORDER } from "@/features/how-we-work/model/processStages";

export function paintConnectors(
  svg: SVGSVGElement | null,
  points: Record<string, Point>,
) {
  if (!svg) {
    return;
  }

  const pairs = PROCESS_CONNECTOR_ORDER.slice(0, -1).map((id, index) => {
    const nextId = PROCESS_CONNECTOR_ORDER[index + 1];
    return { id: `${id}-${nextId}`, fromId: id, toId: nextId ?? id };
  });

  for (const pair of pairs) {
    const group = svg.querySelector(`[data-connector="${pair.id}"]`);
    if (!(group instanceof SVGGElement)) {
      continue;
    }
    const from = points[pair.fromId];
    const to = points[pair.toId];
    if (!from || !to) {
      continue;
    }
    const path = group.querySelector("[data-connector-path]");
    const fromDot = group.querySelector("[data-connector-from]");
    const toDot = group.querySelector("[data-connector-to]");
    if (path instanceof SVGPathElement) {
      path.setAttribute("d", buildConnectorPath(from, to));
    }
    if (fromDot instanceof SVGCircleElement) {
      fromDot.setAttribute("cx", String(from.x));
      fromDot.setAttribute("cy", String(from.y));
    }
    if (toDot instanceof SVGCircleElement) {
      toDot.setAttribute("cx", String(to.x));
      toDot.setAttribute("cy", String(to.y));
    }
  }
}
