import type { ImpactMadeVisibleProps } from "./impact.types";
import { ImpactMarquee } from "./impactMarquee";
import styles from "./impactMadeVisible.module.css";

/** Server Component: feed it actual prevalidated content from the site's existing data layer. */
export function ImpactMadeVisibleSection({
  id = "impactMadeVisible",
  eyebrow,
  heading,
  description,
  cards,
  className = "",
}: ImpactMadeVisibleProps) {
  if (!cards.length) return null;

  return (
    <section id={id} className={`${styles.section} ${className}`} aria-labelledby={`${id}-heading`}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}><span aria-hidden="true">✦</span> {eyebrow}</p>
        <h2 id={`${id}-heading`} className={styles.heading}>{heading}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <ImpactMarquee cards={cards} />
    </section>
  );
}
