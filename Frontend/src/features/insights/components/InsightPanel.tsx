"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { FocusEvent } from "react";
import { formatInsightDate } from "@/features/insights/lib/formatInsightDate";
import { isInsightCmsMediaSrc } from "@/features/insights/lib/normalizeInsightCoverUrl";
import type { InsightArticle } from "@/features/insights/model/types";
import styles from "@/features/insights/styles/insights.module.css";

type InsightPanelProps = {
  article: InsightArticle;
  index: number;
  isActive: boolean;
  mode: "horizontal" | "vertical";
  contentWidth: number;
  panelWidth: number;
  animationEnabled: boolean;
  reduceMotion: boolean;
  onRailPointerEnter: () => void;
  onRailPointerLeave: () => void;
  onRailFocus: () => void;
  onRailClick: () => void;
  onExpandedFocusIn: () => void;
  onExpandedFocusOut: (event: FocusEvent) => void;
};

export function InsightPanel({
  article,
  index,
  isActive,
  mode,
  contentWidth,
  panelWidth,
  animationEnabled,
  reduceMotion,
  onRailPointerEnter,
  onRailPointerLeave,
  onRailFocus,
  onRailClick,
  onExpandedFocusIn,
  onExpandedFocusOut,
}: InsightPanelProps) {
  const panelId = `insight-panel-${article.id}`;
  const buttonId = `insight-button-${article.id}`;
  const number = String(index + 1).padStart(2, "0");
  const railLabel = article.railLabel?.trim() || article.category;
  const dateLabel = formatInsightDate(article.publishedAt);
  const transitionMs = animationEnabled && !reduceMotion ? 700 : 0;

  return (
    <article
      className={`${styles.panel} ${isActive ? styles.panelActive : styles.panelCollapsed}`}
      style={{
        flexBasis: mode === "horizontal" ? panelWidth : undefined,
        transition: transitionMs
          ? `flex-basis ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
          : "none",
      }}
      data-active={isActive ? "true" : "false"}
    >
      <button
        id={buttonId}
        type="button"
        className={styles.railButton}
        aria-expanded={isActive}
        aria-controls={panelId}
        aria-label={article.title}
        onPointerEnter={onRailPointerEnter}
        onPointerLeave={onRailPointerLeave}
        onFocus={onRailFocus}
        onClick={onRailClick}
      >
        <span className={`${styles.railNumber} typeMeta`} aria-hidden="true">
          {number}
        </span>
        <span className={`${styles.railLabel} typeMeta`} aria-hidden="true">
          {mode === "horizontal" ? railLabel : article.title}
        </span>
        <span className={styles.railIcon} aria-hidden="true">
          <span className={styles.railIconBar} />
          <span
            className={`${styles.railIconBar} ${styles.railIconBarVertical}`}
          />
        </span>
      </button>

      <div
        id={panelId}
        className={styles.details}
        aria-hidden={!isActive}
        inert={!isActive ? true : undefined}
        onFocusCapture={onExpandedFocusIn}
        onBlurCapture={onExpandedFocusOut}
      >
        <div
          className={styles.detailsInner}
          style={
            mode === "horizontal"
              ? { width: contentWidth }
              : undefined
          }
        >
          <Link href={article.href} className={styles.mediaLink} tabIndex={isActive ? 0 : -1}>
            <div className={styles.mediaFrame}>
              {article.coverUrl ? (
                <Image
                  src={article.coverUrl}
                  alt={article.coverAlt || article.title}
                  fill
                  sizes="(max-width: 1199px) 100vw, 806px"
                  className={styles.mediaImage}
                  style={{
                    objectPosition: `${article.focalX * 100}% ${article.focalY * 100}%`,
                  }}
                  priority={isActive && index === 0}
                  unoptimized={isInsightCmsMediaSrc(article.coverUrl)}
                />
              ) : (
                <div className={styles.mediaFallback} aria-hidden="true" />
              )}
            </div>
          </Link>

          <p className={`${styles.category} typeMeta`}>{article.category}</p>
          <h3 className={`${styles.title} typeHeading`}>
            <Link href={article.href} tabIndex={isActive ? 0 : -1}>
              {article.title}
            </Link>
          </h3>
          <p className={`${styles.excerpt} typeBody`}>{article.excerpt}</p>
          <p className={`${styles.meta} typeMeta`}>
            {dateLabel ? (
              <time dateTime={article.publishedAt ?? undefined}>
                {dateLabel}
              </time>
            ) : null}
            {dateLabel && article.readTimeMinutes ? (
              <span aria-hidden="true"> · </span>
            ) : null}
            {article.readTimeMinutes ? (
              <span>{article.readTimeMinutes} min read</span>
            ) : null}
          </p>
          <Link
            href={article.href}
            className={`${styles.readLink} typeButton`}
            tabIndex={isActive ? 0 : -1}
          >
            Read Article
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
