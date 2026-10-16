import styles from "@/features/insights/styles/insightsPage.module.css";

type InsightsIntroProps = {
  heading: string;
  intro: string;
};

export function InsightsIntro({ heading, intro }: InsightsIntroProps) {
  return (
    <header className={styles.intro}>
      <h1 className={`${styles.heading} typeHero`}>{heading}</h1>
      <p className={`${styles.lead} typeBody`}>{intro}</p>
    </header>
  );
}
