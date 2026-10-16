import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { FaqAccordion } from "@/features/faq/components/FaqAccordion";
import { getPublicFaqSection } from "@/features/faq/server/getPublicFaq";
import styles from "@/features/faq/styles/faq.module.css";

export async function FaqSection() {
  const state = await getPublicFaqSection();
  if (state.kind === "hidden") {
    return null;
  }
  if (state.kind === "error") {
    return (
      <PublicFetchErrorPanel title="FAQ unavailable" message={state.message} />
    );
  }

  const data = state.data;
  const items = [...data.items].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <section
      id="faq"
      className={styles.section}
      aria-labelledby="faq-heading"
      data-faq-section
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <SectionIntro
              headingId="faq-heading"
              eyebrow={data.eyebrow}
              heading={data.heading}
              supporting={data.supportingText}
              tone="light"
              align="start"
              className={styles.intro}
            />

            <div className={styles.ctaBlock}>
              <p className={`${styles.contactPrompt} typeBody`}>
                {data.contactPrompt}
              </p>
              <a href={data.ctaHref} className={`${styles.cta} typeButton`}>
                {data.ctaLabel}
              </a>
            </div>
          </div>

          <div className={styles.accordionWrap}>
            <FaqAccordion items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
