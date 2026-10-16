import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { ServicesHero } from "@/features/services/components/ServicesHero";
import { ServiceShowcaseGroup } from "@/features/services/components/ServiceShowcaseGroup";
import { getPublicServicesHub } from "@/features/services/server/getPublicServicesHub";
import styles from "@/features/services/styles/servicesHub.module.css";

export async function ServicesHubPage() {
  const result = await getPublicServicesHub();
  if (!result.ok) {
    return (
      <PublicFetchErrorPanel
        title="Services hub unavailable"
        message={result.error.message}
      />
    );
  }
  const hub = result.data;

  return (
    <div className={styles.page}>
      <ServicesHero eyebrow={hub.eyebrow} heading={hub.heading} />
      {hub.groups.map((group) => (
        <ServiceShowcaseGroup key={group.id} group={group} />
      ))}
    </div>
  );
}
