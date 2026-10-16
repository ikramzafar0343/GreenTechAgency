"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "@/features/contact/styles/contactPage.module.css";

type ContactArrowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: ReactNode;
  direction?: "left" | "right";
};

function ArrowGlyph({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M3 9h12M10 4l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactArrowButton({
  label,
  direction = "right",
  className,
  type = "button",
  ...rest
}: ContactArrowButtonProps) {
  const reverse = direction === "left";
  return (
    <button
      type={type}
      className={`${styles.arrowBtn} ${reverse ? styles.arrowBtnReverse : ""} ${className ?? ""}`}
      {...rest}
    >
      <span>{label}</span>
      <span className={styles.arrowWell} aria-hidden="true">
        <span className={`${styles.arrowIcon} ${styles.arrowIconPrimary}`}>
          <ArrowGlyph flip={reverse} />
        </span>
        <span className={`${styles.arrowIcon} ${styles.arrowIconDuplicate}`}>
          <ArrowGlyph flip={reverse} />
        </span>
      </span>
    </button>
  );
}
