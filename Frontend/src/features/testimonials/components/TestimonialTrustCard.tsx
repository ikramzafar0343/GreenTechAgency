import type { TestimonialsTrustBadge } from "@/features/testimonials/model/types";
import styles from "@/features/testimonials/styles/testimonialTrust.module.css";

type TestimonialTrustCardProps = {
  badge: TestimonialsTrustBadge;
};

export function TestimonialTrustCard({ badge }: TestimonialTrustCardProps) {
  return (
    <aside
      className={styles.trustCard}
      aria-label={`${badge.eyebrow} ${badge.value} ${badge.label}`}
    >
      <p className={styles.stars} aria-hidden="true">
        ★★★★★
      </p>
      <p className={`${styles.eyebrow} typeEyebrow`}>{badge.eyebrow}</p>
      <p className={`${styles.value} typeMetric`}>{badge.value}</p>
      <p className={`${styles.label} typeBody`}>{badge.label}</p>
      <div className={styles.ribbon} aria-hidden="true" />
    </aside>
  );
}
