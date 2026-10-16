import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { StatCard } from "@/features/stats/components/StatCard";
import { StatsMotion } from "@/features/stats/components/StatsMotion";
import { STATS_INTRO } from "@/features/stats/model/statsIntro";
import { getPublicStatsSection } from "@/features/stats/server/getPublicStats";
import styles from "@/features/stats/styles/stats.module.css";

function gridClass(count: number) {
  if (count >= 4) {
    return styles.grid;
  }
  if (count === 3) {
    return `${styles.grid} ${styles.gridThree}`;
  }
  if (count === 2) {
    return `${styles.grid} ${styles.gridTwo}`;
  }
  return `${styles.grid} ${styles.gridOne}`;
}

export async function StatsSection() {
  const state = await getPublicStatsSection();
  if (state.kind === "hidden") {
    return null;
  }
  if (state.kind === "error") {
    return (
      <PublicFetchErrorPanel title="Stats unavailable" message={state.message} />
    );
  }

  const stats = state.data;
  const metrics = [...stats.metrics].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <section
      className={styles.section}
      data-stats-section
      aria-labelledby="stats-heading"
    >
      <p
        className={`${styles.backdropWord} typeDisplay`}
        aria-hidden="true"
        data-stats-backdrop
      >
        IN NUMBERS
      </p>

      <div className={styles.container}>
        <SectionIntro
          headingId="stats-heading"
          eyebrow={STATS_INTRO.eyebrow}
          heading={stats.heading}
          supporting={STATS_INTRO.tagline}
          tone="dark"
          align="start"
          className={styles.intro}
        />

        <ul className={gridClass(metrics.length)}>
          {metrics.map((metric, index) => (
            <StatCard
              key={metric.id}
              metric={metric}
              index={index}
              staggered={metrics.length === 4}
            />
          ))}
        </ul>
      </div>

      <StatsMotion
        metrics={metrics}
        entryAnimationEnabled={stats.entryAnimationEnabled}
        countUpEnabled={stats.countUpEnabled}
      />
    </section>
  );
}
