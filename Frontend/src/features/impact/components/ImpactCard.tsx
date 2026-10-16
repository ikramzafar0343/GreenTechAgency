import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ImpactCardData } from "@/features/impact/model/impactTypes";
import styles from "@/features/impact/styles/impactMadeVisible.module.css";

type ImpactCardProps = {
  card: ImpactCardData;
  isClone?: boolean;
};

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={styles.ctaArrow}
    >
      <path
        d="M2.5 10h14m-5.5-5.5 5.5 5.5-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function resolveTheme(card: ImpactCardData): string {
  if (card.theme) {
    return card.theme;
  }
  if (card.kind === "metric") {
    return "dark";
  }
  if (card.kind === "cta") {
    return "muted";
  }
  if (card.kind === "image") {
    return "mint";
  }
  return "light";
}

export function ImpactCard({ card, isClone = false }: ImpactCardProps) {
  const dataTheme = resolveTheme(card);

  if (card.kind === "image") {
    const tileTitle = card.image.tileTitle?.trim() || "Delivery";
    const tileCaption = card.image.tileCaption?.trim() || "EDITORIAL DEMO";
    const unoptimized =
      card.image.src.endsWith(".svg") ||
      card.image.src.startsWith("/media/") ||
      card.image.src.startsWith("http://") ||
      card.image.src.startsWith("https://");
    const visual = (
      <>
        <Image
          src={card.image.src}
          alt={isClone ? "" : card.image.alt}
          fill
          sizes="(max-width: 767px) 84vw, (max-width: 1023px) 380px, 459px"
          className={styles.cardImage}
          style={{ objectPosition: card.image.objectPosition ?? "center" }}
          unoptimized={unoptimized}
        />
        <div className={styles.imageFade} aria-hidden="true" />
        <div className={styles.imageTile} aria-hidden={isClone || undefined}>
          <p className={styles.imageTileTitle}>{tileTitle}</p>
          <p className={styles.imageTileCaption}>{tileCaption}</p>
        </div>
        {card.caption ? (
          <p className={`${styles.imageCaption} typeBody`}>{card.caption}</p>
        ) : null}
      </>
    );

    return (
      <article
        className={styles.card}
        data-kind={card.kind}
        data-size={card.size}
        data-theme={dataTheme}
      >
        {card.href ? (
          <Link
            href={card.href}
            tabIndex={isClone ? -1 : undefined}
            className={styles.imageLink}
            aria-hidden={isClone || undefined}
          >
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
      <article
        className={styles.card}
        data-kind={card.kind}
        data-size={card.size}
        data-theme={dataTheme}
      >
        <div className={styles.content}>
          <p className={styles.metricPrimary}>
            <strong>{card.metric}</strong>
          </p>
          <p className={styles.metricSecondary}>{card.description}</p>
        </div>
      </article>
    );
  }

  if (card.kind === "cta") {
    return (
      <article
        className={styles.card}
        data-kind={card.kind}
        data-size={card.size}
        data-theme={dataTheme}
      >
        <div className={`${styles.content} ${styles.ctaContent}`}>
          <div>
            <h3 className={`${styles.cardHeading} typeCardTitle`}>
              {card.heading}
            </h3>
            {card.description ? (
              <p className={`${styles.cardDescription} typeBody`}>
                {card.description}
              </p>
            ) : null}
          </div>
          <Link
            href={card.href}
            tabIndex={isClone ? -1 : undefined}
            className={styles.ctaLink}
            aria-hidden={isClone || undefined}
          >
            <span>{card.linkLabel}</span>
            <ArrowIcon />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={styles.card}
      data-kind={card.kind}
      data-size={card.size}
      data-theme={dataTheme}
    >
      <div className={styles.content}>
        <h3 className={`${styles.cardHeading} typeCardTitle`}>{card.heading}</h3>
        {card.description ? (
          <p className={`${styles.cardDescription} typeBody`}>
            {card.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
