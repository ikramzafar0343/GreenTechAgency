import styles from "@/features/portfolio/styles/portfolioPage.module.css";

type PortfolioIntroProps = {
  heading: string;
  intro: string;
};

export function PortfolioIntro({ heading, intro }: PortfolioIntroProps) {
  return (
    <header className={styles.intro}>
      <h1 className={`${styles.heading} typeHero`}>{heading}</h1>
      <p className={`${styles.lead} typeBody`}>{intro}</p>
    </header>
  );
}
