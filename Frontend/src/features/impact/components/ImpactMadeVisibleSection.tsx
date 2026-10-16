import { ImpactMarquee } from "@/features/impact/components/ImpactMarquee";
import type { ImpactMadeVisibleContent } from "@/features/impact/model/impactTypes";
import styles from "@/features/impact/styles/impactMadeVisible.module.css";

type ImpactMadeVisibleSectionProps = {
  content: ImpactMadeVisibleContent;
  className?: string;
};

export function ImpactMadeVisibleSection({
  content,
  className = "",
}: ImpactMadeVisibleSectionProps) {
  if (!content.cards.length) {
    return null;
  }

  const headingId = `${content.id}-heading`;

  return (
    <section
      id={content.id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <div className={styles.intro}>
        <p className={`${styles.eyebrow} typeEyebrow`}>
          <span className={styles.eyebrowMark} aria-hidden="true" />
          {content.eyebrow}
        </p>
        <h2 id={headingId} className={`${styles.heading} typeSectionTitle`}>
          {content.heading}
        </h2>
        <p className={`${styles.description} typeLead`}>{content.description}</p>
      </div>
      <ImpactMarquee cards={content.cards} />
    </section>
  );
}
