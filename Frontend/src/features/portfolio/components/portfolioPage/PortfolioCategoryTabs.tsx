"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
} from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioPage.module.css";

type PortfolioCategoryTabsProps = {
  active: PortfolioCategory;
  onChange: (category: PortfolioCategory) => void;
};

export function PortfolioCategoryTabs({
  active,
  onChange,
}: PortfolioCategoryTabsProps) {
  const listId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusTab(index: number) {
    const next = refs.current[index];
    next?.focus();
  }

  function onKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = PORTFOLIO_CATEGORIES.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = last;
    } else {
      return;
    }

    const next = PORTFOLIO_CATEGORIES[nextIndex];
    if (!next) {
      return;
    }
    onChange(next.id);
    focusTab(nextIndex);
  }

  return (
    <div className={styles.tabsWrap}>
      <div
        className={styles.tablist}
        role="tablist"
        aria-label="Portfolio categories"
        id={listId}
      >
        {PORTFOLIO_CATEGORIES.map((category, index) => {
          const selected = category.id === active;
          return (
            <button
              key={category.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`portfolio-tab-${category.id}`}
              className={`${styles.tab} typeButton`}
              aria-selected={selected}
              aria-controls={`portfolio-panel-${category.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(category.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {category.label}
            </button>
          );
        })}
      </div>
      <hr className={styles.divider} />
    </div>
  );
}
