"use client";

import type { InsightsViewMode } from "@/features/insights/model/insightsPageTypes";
import styles from "@/features/insights/styles/insightsPage.module.css";

type InsightsToolbarProps = {
  mode: InsightsViewMode;
  onModeChange: (mode: InsightsViewMode) => void;
};

export function InsightsToolbar({ mode, onModeChange }: InsightsToolbarProps) {
  return (
    <div className={styles.toolbar} role="group" aria-label="Archive view mode">
      <button
        type="button"
        className={`${styles.modeButton} typeButton`}
        aria-pressed={mode === "large"}
        aria-label="View in large layout"
        onClick={() => onModeChange("large")}
      >
        <span className={`${styles.modeIcon} ${styles.modeIconLarge}`} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        Large view
      </button>
      <button
        type="button"
        className={`${styles.modeButton} typeButton`}
        aria-pressed={mode === "small"}
        aria-label="View in small layout"
        onClick={() => onModeChange("small")}
      >
        <span className={`${styles.modeIcon} ${styles.modeIconSmall}`} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        Small view
      </button>
    </div>
  );
}
