import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatInsightCardDate } from "@/features/insights/lib/formatInsightCardDate";
import { isInsightCmsMediaSrc } from "@/features/insights/lib/normalizeInsightCoverUrl";
import type { InsightArticle } from "@/features/insights/model/types";
import styles from "@/features/insights/styles/insightsPage.module.css";

type InsightCardProps = {
  article: InsightArticle;
};

export function InsightCard({ article }: InsightCardProps) {
  const dateLabel = formatInsightCardDate(article.publishedAt);
  const readLabel =
    article.readTimeMinutes != null
      ? `${article.readTimeMinutes} min read`
      : null;

  return (
    <Link
      href={article.href}
      className={styles.card}
      aria-label={`Read '${article.title}' article`}
    >
      <div className={styles.media}>
        {article.coverUrl ? (
          <Image
            src={article.coverUrl}
            alt={article.coverAlt}
            width={822}
            height={914}
            className={styles.image}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            unoptimized={isInsightCmsMediaSrc(article.coverUrl)}
            style={{
              objectPosition: `${article.focalX * 100}% ${article.focalY * 100}%`,
            }}
          />
        ) : null}
        {readLabel || dateLabel ? (
          <p className={`${styles.meta} typeMeta`}>
            {readLabel ? <span>{readLabel}</span> : null}
            {readLabel && dateLabel ? (
              <span aria-hidden="true">·</span>
            ) : null}
            {dateLabel ? (
              <time dateTime={article.publishedAt ?? undefined}>{dateLabel}</time>
            ) : null}
          </p>
        ) : null}
      </div>
      <h2 className={`${styles.title} typeHeading`}>{article.title}</h2>
    </Link>
  );
}
