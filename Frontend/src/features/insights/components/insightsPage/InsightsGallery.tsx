import { InsightCard } from "@/features/insights/components/insightsPage/InsightCard";
import type { InsightArticle } from "@/features/insights/model/types";
import styles from "@/features/insights/styles/insightsPage.module.css";

type InsightsGalleryProps = {
  articles: readonly InsightArticle[];
};

export function InsightsGallery({ articles }: InsightsGalleryProps) {
  if (articles.length === 0) {
    return (
      <p className={`${styles.empty} typeBody`} role="status">
        No published insights yet. Check back soon.
      </p>
    );
  }

  return (
    <ul className={styles.gallery}>
      {articles.map((article, index) => (
        <li key={article.id} className={styles.cardItem}>
          {/* The top row is on screen at load; lazy-loading it makes the art
              arrive, and animate, a second after the page looks finished. */}
          <InsightCard article={article} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
