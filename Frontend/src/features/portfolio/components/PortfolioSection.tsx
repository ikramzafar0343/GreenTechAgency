import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { PortfolioTimeline } from "@/features/portfolio/components/PortfolioTimeline";
import { mapPortfolioSteps } from "@/features/portfolio/lib/mapPortfolioSteps";
import { getPublicPortfolioSection } from "@/features/portfolio/server/getPublicPortfolio";
import styles from "@/features/portfolio/styles/portfolio.module.css";

export async function PortfolioSection() {
  const state = await getPublicPortfolioSection();
  if (state.kind === "hidden") {
    return null;
  }
  if (state.kind === "error") {
    return (
      <PublicFetchErrorPanel
        title="Portfolio unavailable"
        message={state.message}
      />
    );
  }
  const portfolio = state.data;
  const projects = [...portfolio.projects].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const steps = mapPortfolioSteps(projects);

  if (steps.length === 0) {
    return null;
  }

  return (
    <section
      id="our-work"
      className={styles.section}
      aria-labelledby="portfolio-heading"
    >
      <div className={styles.container}>
        <SectionIntro
          headingId="portfolio-heading"
          eyebrow="Our Work"
          heading={portfolio.heading}
          supporting={portfolio.subtitle}
          tone="light"
          align="center"
          className={styles.intro}
        />

        <PortfolioTimeline steps={steps} />
      </div>
    </section>
  );
}
