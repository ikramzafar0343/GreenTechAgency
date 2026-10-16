import { Link } from "@/i18n/navigation";
import type { PublicServiceDetail } from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";

type Props = {
  detail: PublicServiceDetail;
};

export function ServiceDetailStory({ detail }: Props) {
  return (
    <section
      className={`${styles.section} ${styles.editorial} ${styles.reveal}`}
      aria-labelledby="service-story-label"
    >
      <div className={styles.story}>
        <h2 id="service-story-label" className={`${styles.storyLabel} typeEyebrow`}>
          {detail.storyLabel}
        </h2>
        <div className={styles.storyCopy}>
          {detail.storyParagraphs.map((paragraph, index) => (
            <p key={`story-${index}`} className="typeBody">
              {paragraph}
            </p>
          ))}
          <Link href={detail.storyCtaHref} className={`${styles.storyLink} typeNav`}>
            {detail.storyCtaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
