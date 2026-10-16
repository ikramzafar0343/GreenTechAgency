import styles from "@/features/footer/styles/closingCta.module.css";

export function ClosingCtaArrow() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 140 100"
      width="140"
      height="100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.arrowPath}
        d="M18 18 C 48 18, 78 28, 98 52 C 110 66, 116 78, 118 86"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
      <path
        className={styles.arrowHead}
        d="M108 78 L118 88 L128 72"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
}
