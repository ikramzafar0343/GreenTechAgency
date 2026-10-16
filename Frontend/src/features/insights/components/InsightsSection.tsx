import { Link } from "@/i18n/navigation";
import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { InsightsAccordion } from "@/features/insights/components/InsightsAccordion";
import { getPublicInsightsSection } from "@/features/insights/server/getPublicInsights";
import styles from "@/features/insights/styles/insights.module.css";

export async function InsightsSection() {
  const state = await getPublicInsightsSection();
  if (state.kind === "hidden") {
    return null;
  }
  if (state.kind === "error") {
    return (
      <PublicFetchErrorPanel title="Insights unavailable" message={state.message} />
    );
  }
  const data = state.data;
  if (data.articles.length === 0) {
    return null;
  }

  const articles = [...data.articles].sort(
    (a, b) => a.homepageOrder - b.homepageOrder,
  );

  return (
    <section
      id="blog"
      className={styles.section}
      aria-labelledby="insights-heading"
      data-insights-section
    >
      <div className={styles.headerWrap}>
        <SectionIntro
          headingId="insights-heading"
          eyebrow={data.eyebrow}
          heading={data.heading}
          supporting={data.supportingText}
          tone="light"
          align="start"
          className={styles.header}
          action={
            <Link
              href={data.viewAllHref}
              className={`${styles.viewAll} typeButton`}
            >
              {data.viewAllLabel}
              <span aria-hidden="true"> →</span>
            </Link>
          }
        />
      </div>

      <div className={styles.panelsBleed}>
        <InsightsAccordion
          articles={articles}
          initialOpenId={data.initialOpenId}
          animationEnabled={data.animationEnabled}
        />
      </div>
    </section>
  );
}
