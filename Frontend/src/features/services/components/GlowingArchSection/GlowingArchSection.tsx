import { useId, type ReactNode } from "react";
import styles from "@/features/services/components/GlowingArchSection/GlowingArchSection.module.css";

type GlowingArchSectionProps = {
  eyebrow: string;
  heading: string;
  headingId?: string | undefined;
  headingLevel?: "h1" | "h2" | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  variant?: "section" | "hero" | undefined;
  revealed?: boolean | undefined;
};

const ARC_EDGE =
  "M -80 630 C 180 390, 450 255, 720 255 C 990 255, 1260 390, 1520 630";
const ARC_FILL = `${ARC_EDGE} L 1520 1000 L -80 1000 Z`;

export function GlowingArchSection({
  eyebrow,
  heading,
  headingId,
  headingLevel = "h2",
  children,
  className,
  variant = "section",
  revealed = true,
}: GlowingArchSectionProps) {
  const HeadingTag = headingLevel;
  const glowGradientId = useId().replace(/:/g, "");

  return (
    <div
      className={[
        styles.section,
        variant === "hero" ? styles.heroVariant : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-revealed={revealed ? "true" : "false"}
    >
      <div className={styles.grid} aria-hidden="true" />

      <svg
        className={styles.arch}
        viewBox={variant === "hero" ? "0 200 1440 700" : "0 0 1440 900"}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={glowGradientId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4DE8F4" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#4DE8F4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4DE8F4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={ARC_EDGE}
          className={styles.glowOuter}
          fill="none"
          stroke={`url(#${glowGradientId})`}
          strokeWidth="120"
          opacity="0.85"
        />
        <path
          d={ARC_EDGE}
          className={styles.glowInner}
          fill="none"
          stroke="#A8F7FC"
          strokeWidth="34"
          opacity="0.75"
        />
        <path d={ARC_FILL} fill="#01070c" />
        <path
          d={ARC_EDGE}
          fill="none"
          stroke="#7AF0F8"
          strokeWidth="1.75"
          opacity="0.95"
        />
      </svg>

      <div className={styles.content}>
        <p className={`${styles.eyebrow} typeEyebrow`}>
          <span className={styles.accentDot} aria-hidden="true" />
          {eyebrow}
        </p>
        <HeadingTag
          id={headingId}
          className={`${styles.heading} ${headingLevel === "h1" ? "typeHero" : "typeSectionTitle"}`}
        >
          {heading}
        </HeadingTag>
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
    </div>
  );
}
