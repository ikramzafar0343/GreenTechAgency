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
      {articles.map((article) => (
        <li key={article.id} className={styles.cardItem}>
          <InsightCard article={article} />
        </li>
      ))}
    </ul>
  );
}
