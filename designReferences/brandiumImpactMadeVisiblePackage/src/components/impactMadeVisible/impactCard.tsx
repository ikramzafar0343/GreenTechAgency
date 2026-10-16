import Image from "next/image";
import Link from "next/link";

import type { ImpactCardData } from "./impact.types";
import styles from "./impactMadeVisible.module.css";

interface ImpactCardProps {
  card: ImpactCardData;
  isClone?: boolean;
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={styles.ctaArrow}>
      <path d="M2.5 10h14m-5.5-5.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ImpactCard({ card, isClone = false }: ImpactCardProps) {
  const rootAttributes = {
    className: styles.card,
    "data-kind": card.kind,
    "data-size": card.size,
    "data-theme": card.theme ?? (card.kind === "metric" ? "dark" : "muted"),
  } as const;

  if (card.kind === "image") {
    const visual = (
      <>
        <Image
          src={card.image.src}
          alt={isClone ? "" : card.image.alt}
          fill
          sizes="(max-width: 767px) 84vw, (max-width: 1023px) 380px, 459px"
          className={styles.cardImage}
          style={{ objectPosition: card.image.objectPosition ?? "center" }}
        />
        {card.caption && <p className={styles.imageCaption}>{card.caption}</p>}
      </>
    );

    return (
      <article {...rootAttributes}>
        {card.href ? (
          <Link href={card.href} tabIndex={isClone ? -1 : undefined} className={styles.imageLink}>
            {visual}
          </Link>
        ) : (
          visual
        )}
      </article>
    );
  }

  if (card.kind === "metric") {
    return (
      <article {...rootAttributes}>
        <div className={styles.content}>
          <p className={styles.metricPrimary}><strong>{card.metric}</strong></p>
          <p className={styles.metricSecondary}>{card.description}</p>
        </div>
      </article>
    );
  }

  if (card.kind === "cta") {
    return (
      <article {...rootAttributes}>
        <div className={`${styles.content} ${styles.ctaContent}`}>
          <div>
            <h3 className={styles.cardHeading}>{card.heading}</h3>
            {card.description && <p className={styles.cardDescription}>{card.description}</p>}
          </div>
          <Link href={card.href} tabIndex={isClone ? -1 : undefined} className={styles.ctaLink}>
            <span>{card.linkLabel}</span>
            <ArrowIcon />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article {...rootAttributes}>
      <div className={styles.content}>
        <h3 className={styles.cardHeading}>{card.heading}</h3>
        {card.description && <p className={styles.cardDescription}>{card.description}</p>}
      </div>
    </article>
  );
}
