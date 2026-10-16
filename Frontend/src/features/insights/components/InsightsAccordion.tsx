"use client";

import { useMemo, useRef } from "react";
import { InsightPanel } from "@/features/insights/components/InsightPanel";
import { useInsightsInteraction } from "@/features/insights/hooks/useInsightsInteraction";
import { useInsightsLayout } from "@/features/insights/hooks/useInsightsLayout";
import type { InsightArticle } from "@/features/insights/model/types";
import styles from "@/features/insights/styles/insights.module.css";

type InsightsAccordionProps = {
  articles: InsightArticle[];
  initialOpenId: string;
  animationEnabled: boolean;
};

export function InsightsAccordion({
  articles,
  initialOpenId,
  animationEnabled,
}: InsightsAccordionProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const geometry = useInsightsLayout(rowRef, articles.length);
  const articleIds = useMemo(
    () => articles.map((article) => article.id),
    [articles],
  );

  const {
    activeId,
    onRowPointerMove,
    onRailPointerEnter,
    onRailPointerLeave,
    onRailFocus,
    onRailClick,
    onExpandedFocusIn,
    onExpandedFocusOut,
  } = useInsightsInteraction({
    articleIds,
    initialOpenId,
    mode: geometry.mode,
  });

  return (
    <div
      ref={rowRef}
      className={`${styles.row} ${
        geometry.mode === "horizontal" ? styles.rowHorizontal : styles.rowVertical
      }`}
      data-mode={geometry.mode}
      data-motion={animationEnabled && !geometry.reduceMotion ? "on" : "off"}
      onPointerMove={onRowPointerMove}
    >
      {articles.map((article, index) => {
        const isActive = activeId === article.id;
        const panelWidth =
          geometry.mode === "horizontal"
            ? isActive
              ? geometry.expandedWidth
              : geometry.collapsedWidth
            : geometry.rowWidth;

        return (
          <InsightPanel
            key={article.id}
            article={article}
            index={index}
            isActive={isActive}
            mode={geometry.mode}
            contentWidth={geometry.expandedWidth}
            panelWidth={panelWidth}
            animationEnabled={animationEnabled}
            reduceMotion={geometry.reduceMotion}
            onRailPointerEnter={() => onRailPointerEnter(article.id)}
            onRailPointerLeave={onRailPointerLeave}
            onRailFocus={() => onRailFocus(article.id)}
            onRailClick={() => onRailClick(article.id)}
            onExpandedFocusIn={onExpandedFocusIn}
            onExpandedFocusOut={onExpandedFocusOut}
          />
        );
      })}
    </div>
  );
}
