import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { TestimonialsWall } from "@/features/testimonials/components/TestimonialsWall";
import { DEFAULT_TRUST_BADGE } from "@/features/testimonials/model/trustBadge";
import { getPublicTestimonialsSection } from "@/features/testimonials/server/getPublicTestimonials";
import styles from "@/features/testimonials/styles/testimonials.module.css";

export async function TestimonialsSection() {
  const state = await getPublicTestimonialsSection();
  if (state.kind === "hidden") {
    return null;
  }
  if (state.kind === "error") {
    return (
      <PublicFetchErrorPanel
        title="Testimonials unavailable"
        message={state.message}
      />
    );
  }

  const data = state.data;
  const items = [...data.items].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <section
      className={styles.section}
      aria-labelledby="testimonials-heading"
      data-testimonials-section
    >
      <div className={styles.container}>
        <SectionIntro
          headingId="testimonials-heading"
          eyebrow={data.eyebrow}
          heading={data.heading}
          supporting={data.supportingText}
          tone="dark"
          align="start"
          className={styles.intro}
        />

        <TestimonialsWall
          items={items}
          trustBadge={data.trustBadge ?? DEFAULT_TRUST_BADGE}
          scrollAnimationEnabled={data.scrollAnimationEnabled}
        />
      </div>
    </section>
  );
}
