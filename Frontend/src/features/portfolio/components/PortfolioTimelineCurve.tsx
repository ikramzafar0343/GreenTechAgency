import {
  CURVE_MARKERS,
  CURVE_PATH_D,
  type CurveSlotPlan,
  type MarkerKind,
  type MarkerSlot,
} from "@/features/portfolio/lib/curveSlots";
import styles from "@/features/portfolio/styles/portfolioTimeline.module.css";

type PortfolioTimelineCurveProps = {
  plan: CurveSlotPlan;
  markerKey: string;
};

function Marker({ kind, slot }: { kind: MarkerKind; slot: MarkerSlot }) {
  if (kind === "empty") {
    return null;
  }

  const { x, y } = CURVE_MARKERS[slot];

  if (kind === "past") {
    return <circle className={styles.markerPast} cx={x} cy={y} r={4.5} />;
  }

  if (kind === "future") {
    return <circle className={styles.markerHollow} cx={x} cy={y} r={4} />;
  }

  return (
    <g>
      <circle className={styles.markerRing} cx={x} cy={y} r={13}>
        <animate
          attributeName="r"
          values="11;14;13"
          dur="0.42s"
          calcMode="spline"
          keySplines="0.22 1 0.36 1; 0.22 1 0.36 1"
          keyTimes="0; 0.55; 1"
          fill="freeze"
        />
      </circle>
      <circle className={styles.markerDot} cx={x} cy={y} r={5} />
    </g>
  );
}

export function PortfolioTimelineCurve({
  plan,
  markerKey,
}: PortfolioTimelineCurveProps) {
  const slots: MarkerSlot[] = ["top", "mid", "bottom"];

  return (
    <div className={styles.curve} aria-hidden="true">
      <svg
        className={styles.curveSvg}
        viewBox="0 0 120 360"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path className={styles.curvePath} d={CURVE_PATH_D} />
        {slots.map((slot) => (
          <Marker
            key={`${markerKey}-${slot}-${plan[slot]}`}
            slot={slot}
            kind={plan[slot]}
          />
        ))}
      </svg>
    </div>
  );
}
