import type { ReactNode } from "react";
import styles from "@/components/site/sectionIntro.module.css";

export type SectionIntroProps = {
  readonly headingId: string;
  readonly eyebrow?: string | null;
  readonly heading: string;
  readonly supporting?: string | null;
  /** Light surfaces use navy/ink; dark surfaces use cyan/white. */
  readonly tone?: "light" | "dark";
  readonly align?: "start" | "center";
  readonly className?: string | undefined;
  readonly action?: ReactNode | undefined;
};

function normalizeEyebrow(value: string): string {
  return value.replace(/^\+\s*/, "").trim();
}

export function SectionIntro({
  headingId,
  eyebrow,
  heading,
  supporting,
  tone = "light",
  align = "start",
  className,
  action,
}: SectionIntroProps) {
  const eyebrowText = eyebrow?.trim() ? normalizeEyebrow(eyebrow) : null;
  const supportingText = supporting?.trim() || null;
  const rootClass = [styles.root, className].filter(Boolean).join(" ");

  return (
    <header className={rootClass} data-tone={tone} data-align={align}>
      <div className={styles.copy}>
        {eyebrowText ? (
          <p className={`${styles.eyebrow} typeEyebrow`}>{eyebrowText}</p>
        ) : null}
        <h2 id={headingId} className={`${styles.heading} typeSectionTitle`}>
          {heading}
        </h2>
        {supportingText ? (
          <p className={`${styles.supporting} typeLead`}>{supportingText}</p>
        ) : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </header>
  );
}
