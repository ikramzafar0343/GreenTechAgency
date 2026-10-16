import { Link } from "@/i18n/navigation";
import { ServiceMediaWipe } from "@/features/services/components/ServiceMediaWipe";
import type { ServiceShowcaseEntry } from "@/features/services/model/servicesHubTypes";
import styles from "@/features/services/styles/serviceStage.module.css";

type ServiceSlideProps = {
  entry: ServiceShowcaseEntry;
  tileTitle: string;
  active: boolean;
  id: string;
  reduceMotion: boolean;
  wipeNonce: number;
};

export function ServiceSlide({
  entry,
  tileTitle,
  active,
  id,
  reduceMotion,
  wipeNonce,
}: ServiceSlideProps) {
  return (
    <article
      id={id}
      className={styles.panel}
      data-active={active ? "true" : "false"}
      aria-hidden={!active}
      {...(!active ? { inert: true } : {})}
    >
      <div className={styles.copy}>
        <h3 className={`${styles.title} typeCardTitle`}>{entry.title}</h3>
        <p className={`${styles.description} typeBody`}>{entry.description}</p>
        <div className={styles.ctaWrap}>
          <Link href={entry.href} className={`${styles.cta} typeButton`}>
            View Details
          </Link>
        </div>
      </div>

      <div className={styles.mediaSlot}>
        <ServiceMediaWipe
          src={entry.imageSrc}
          alt={entry.imageAlt}
          title={entry.title}
          tileTitle={tileTitle}
          active={active}
          reduceMotion={reduceMotion}
          wipeKey={`${entry.id}-${wipeNonce}`}
        />
      </div>

      <ul className={styles.specialties}>
        {entry.specialties.map((item) => (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} className={`${styles.specialtyLink} typeNav`}>
                {item.label}
              </Link>
            ) : (
              <p className={`${styles.specialtyText} typeBody`}>{item.label}</p>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
