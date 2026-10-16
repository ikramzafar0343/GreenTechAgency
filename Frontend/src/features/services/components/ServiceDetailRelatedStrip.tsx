import { Link } from "@/i18n/navigation";
import type { PublicServiceDetail } from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";

type Props = {
  detail: PublicServiceDetail;
};

export function ServiceDetailRelatedStrip({ detail }: Props) {
  if (detail.related.length === 0) {
    return null;
  }

  return (
    <section
      className={`${styles.section} ${styles.editorial} ${styles.related} ${styles.reveal}`}
      aria-labelledby="service-related"
    >
      <h2 id="service-related" className={`${styles.relatedHeading} typeSectionTitle`}>
        {detail.relatedHeading}
      </h2>
      <p className={`${styles.relatedIntro} typeLead`}>{detail.relatedIntro}</p>
      <ul className={styles.relatedStrip}>
        {detail.related.map((item) => (
          <li key={item.slug}>
            <Link href={item.href} className={`${styles.relatedLink} typeNav`}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
