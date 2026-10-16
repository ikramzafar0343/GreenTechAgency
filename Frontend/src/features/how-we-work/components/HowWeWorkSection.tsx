import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { DotFieldBackground } from "@/features/how-we-work/components/DotFieldBackground";
import { ProcessBoard } from "@/features/how-we-work/components/ProcessBoard";
import { getPublicHowWeWork } from "@/features/how-we-work/server/getPublicHowWeWork";
import styles from "@/features/how-we-work/styles/howWeWork.module.css";

export async function HowWeWorkSection() {
  const result = await getPublicHowWeWork();
  if (!result.ok) {
    if ("notPublished" in result) {
      return null;
    }
    return (
      <PublicFetchErrorPanel
        title="How we work unavailable"
        message={result.error.message}
      />
    );
  }

  const { intro, stages } = result.data;

  return (
    <section className={styles.section} aria-labelledby="how-we-work-heading">
      <DotFieldBackground />
      <div className={styles.container}>
        <div className={styles.intro}>
          <SectionIntro
            headingId="how-we-work-heading"
            eyebrow={intro.eyebrow}
            heading={intro.heading}
            tone="light"
            align="start"
          />
          <div data-hww-intro>
            <p className={`${styles.introCopy} typeLead`}>
              {intro.introduction}
            </p>
            <a href={intro.ctaHref} className={`${styles.cta} typeButton`}>
              {intro.ctaLabel}
            </a>
          </div>
        </div>

        <ProcessBoard stages={stages} />
      </div>
    </section>
  );
}
