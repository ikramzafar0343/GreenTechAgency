"use client";

import { FiArrowRight } from "react-icons/fi";
import type { HeroContent } from "@/features/hero/model/heroTypes";
import styles from "@/features/hero/styles/hero.module.css";

type HeroActionsProps = {
  primaryCta: HeroContent["primaryCta"];
  secondaryCta: HeroContent["secondaryCta"];
};

export function HeroActions({ primaryCta, secondaryCta }: HeroActionsProps) {
  const handleServicesClick = () => {
    window.dispatchEvent(new Event(secondaryCta.eventName));
  };

  return (
    <div className={styles.actions}>
      <a
        href={primaryCta.href}
        className={`${styles.primary} typeButton`}
      >
        <span>{primaryCta.label}</span>
        <span className={styles.primaryArrow} aria-hidden="true">
          <FiArrowRight />
        </span>
      </a>

      <button
        type="button"
        className={`${styles.secondary} typeButton`}
        onClick={handleServicesClick}
      >
        <span className={styles.secondaryLabel}>
          {secondaryCta.label}
        </span>
      </button>
    </div>
  );
}
