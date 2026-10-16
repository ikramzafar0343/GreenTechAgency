"use client";

import type { FaqItem as FaqItemData } from "@/features/faq/model/types";
import styles from "@/features/faq/styles/faq.module.css";

type FaqItemProps = {
  item: FaqItemData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

export function FaqItem({ item, index, isOpen, onToggle }: FaqItemProps) {
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
      <h3 className={styles.questionHeading}>
        <button
          id={buttonId}
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className={`${styles.index} typeMeta`} aria-hidden="true">
            {number}
          </span>
          <span className={`${styles.question} typeFaqQuestion`}>
            {item.question}
          </span>
          <span className={styles.icon} aria-hidden="true">
            <span className={styles.iconBar} />
            <span className={`${styles.iconBar} ${styles.iconBarVertical}`} />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={styles.panel}
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
      >
        <div className={styles.panelInner}>
          <p className={`${styles.answer} typeBody`}>{item.answer}</p>
        </div>
      </div>
    </li>
  );
}
