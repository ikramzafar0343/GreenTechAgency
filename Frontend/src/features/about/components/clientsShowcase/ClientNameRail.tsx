"use client";

import type { RefObject } from "react";
import type { AboutClientItem } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/components/clientsShowcase/clientsShowcase.module.css";

type ClientNameRailProps = {
  items: readonly AboutClientItem[];
  activeIndex: number;
  onHoverIndex: (index: number | null) => void;
  onSelectIndex: (index: number) => void;
  namesRef: RefObject<HTMLUListElement | null>;
};

export function ClientNameRail({
  items,
  activeIndex,
  onHoverIndex,
  onSelectIndex,
  namesRef,
}: ClientNameRailProps) {
  return (
    <div className={styles.rail}>
      <ul
        ref={namesRef}
        className={styles.names}
        aria-label="Clients"
        data-client-rail
      >
        {items.map((item, index) => (
          <li key={item.id} data-client-name>
            <button
              type="button"
              className={styles.nameButton}
              data-active={index === activeIndex ? "true" : "false"}
              aria-label={`Preview ${item.name}`}
              aria-pressed={index === activeIndex}
              onMouseEnter={() => onHoverIndex(index)}
              onMouseLeave={() => onHoverIndex(null)}
              onFocus={() => onHoverIndex(index)}
              onBlur={() => onHoverIndex(null)}
              onClick={() => onSelectIndex(index)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
