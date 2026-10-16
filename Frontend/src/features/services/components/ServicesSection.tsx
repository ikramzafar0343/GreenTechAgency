import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import { getPublicServicesSection } from "@/features/services/server/getPublicServicesSection";
import styles from "@/features/services/styles/services.module.css";

export async function ServicesSection() {
  const state = await getPublicServicesSection();
  if (state.kind === "hidden") {
    return null;
  }
  if (state.kind === "error") {
    return (
      <PublicFetchErrorPanel
        title="Services unavailable"
        message={state.message}
      />
    );
  }

  return (
    <section className={styles.section} aria-labelledby="services-heading">
      <div className={styles.container}>
        <SectionIntro
          headingId="services-heading"
          eyebrow={state.eyebrow}
          heading={state.heading}
          supporting={state.supporting}
          tone="light"
          align="center"
          className={styles.intro}
        />

        <div className={styles.grid}>
          {state.items.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
