import styles from "@/features/portfolio/styles/portfolioPage.module.css";

type PortfolioEmptyStateProps = {
  categoryLabel: string;
};

export function PortfolioEmptyState({ categoryLabel }: PortfolioEmptyStateProps) {
  return (
    <p className={`${styles.empty} typeBody`} role="status">
      No published {categoryLabel.toLowerCase()} work yet. Check back soon.
    </p>
  );
}
