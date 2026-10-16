import type { PublicServiceDetail } from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";

type Props = {
  detail: PublicServiceDetail;
};

export function ServiceDetailEditorialHero({ detail }: Props) {
  return (
    <header className={`${styles.hero} ${styles.editorial}`}>
      <h1 className={`${styles.heroHeadline} typeHero ${styles.reveal}`}>
        {detail.heroHeadline}
      </h1>
      <p className={`${styles.heroIntro} typeLead ${styles.reveal}`}>{detail.heroIntro}</p>
    </header>
  );
}
