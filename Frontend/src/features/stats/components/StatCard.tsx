import {
  formatMetricValue,
  splitCountDisplay,
} from "@/features/stats/model/formatMetric";
import type { PublicStatMetric } from "@/features/stats/model/types";
import styles from "@/features/stats/styles/stats.module.css";

type StatCardProps = {
  metric: PublicStatMetric;
  index: number;
  staggered: boolean;
};

function toneClass(index: number) {
  return index % 2 === 0 ? styles.cardLight : styles.cardPurple;
}

function offsetClass(preset: PublicStatMetric["preset"], staggered: boolean) {
  if (!staggered) {
    return "";
  }
  if (preset === "WORD_EMPHASIS") {
    return styles.cardOffset1;
  }
  if (preset === "OVERSIZED_NUMBER") {
    return styles.cardOffset3;
  }
  if (preset === "YEAR") {
    return styles.cardOffset4;
  }
  return styles.cardOffset2;
}

function oversizeLabel(label: string) {
  if (label.includes("\n")) {
    return label;
  }
  return label.replace(/^(\S+)\s+/, "$1\n");
}

export function StatCard({ metric, index, staggered }: StatCardProps) {
  const formatted = formatMetricValue(metric);
  const { main, suffix } = splitCountDisplay(metric);
  const surface = toneClass(index);
  const offset = offsetClass(metric.preset, staggered);
  const cardClass = `${styles.card} ${offset} ${surface}`;

  if (metric.preset === "WORD_EMPHASIS") {
    return (
      <li className={cardClass} data-stat-card>
        <p className={styles.srOnly}>
          {formatted} {metric.label}
        </p>
        <div className={styles.wordStack} aria-hidden="true">
          <span
            className={`${styles.wordValue} typeHeading`}
            data-stat-count={metric.id}
          >
            {formatted}
          </span>
          <span className={`${styles.wordEmphasis} typeHeading`}>
            {metric.emphasisWord ?? metric.label}
          </span>
        </div>
      </li>
    );
  }

  if (metric.preset === "OVERSIZED_NUMBER") {
    return (
      <li className={cardClass} data-stat-card>
        <p className={styles.srOnly}>
          {formatted} {metric.label}
        </p>
        <div className={styles.oversizeLayout} aria-hidden="true">
          <span className={`${styles.oversizeLabel} typeMeta`}>
            {oversizeLabel(metric.label)}
          </span>
          <span className={`${styles.oversizeValue} typeMetric`}>
            <span data-stat-count={metric.id}>{main}</span>
            {suffix ? (
              <sup className={styles.oversizeSuffix}>{suffix}</sup>
            ) : null}
          </span>
        </div>
      </li>
    );
  }

  return (
    <li className={cardClass} data-stat-card>
      <p className={styles.srOnly}>
        {formatted} {metric.label}
      </p>
      <div className={styles.centeredStack} aria-hidden="true">
        <span
          className={`${styles.standardValue} typeMetric`}
          data-stat-count={metric.id}
        >
          {formatted}
        </span>
        <span className={`${styles.standardLabel} typeMeta`}>{metric.label}</span>
      </div>
    </li>
  );
}
