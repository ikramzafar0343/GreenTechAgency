"use client";

import { useState } from "react";
import { FaqItem } from "@/features/faq/components/FaqItem";
import type { FaqItem as FaqItemData } from "@/features/faq/model/types";
import styles from "@/features/faq/styles/faq.module.css";

type FaqAccordionProps = {
  items: FaqItemData[];
  initialOpenId: string | null;
  animationEnabled?: boolean;
};

export function FaqAccordion({
  items,
  initialOpenId,
  animationEnabled = true,
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(initialOpenId);

  return (
    <ul
      className={styles.list}
      data-motion={animationEnabled ? "on" : "off"}
    >
      {items.map((item, index) => (
        <FaqItem
          key={item.id}
          item={item}
          index={index}
          isOpen={openId === item.id}
          onToggle={() => {
            setOpenId((current) => (current === item.id ? null : item.id));
          }}
        />
      ))}
    </ul>
  );
}
