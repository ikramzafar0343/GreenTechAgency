import { ExploreServiceVisual } from "@/features/about/components/exploreServices/ExploreServiceVisual";
import { ServiceDescription } from "@/features/about/components/exploreServices/ServiceDescription";
import { ServiceNumeral } from "@/features/about/components/exploreServices/ServiceNumeral";
import styles from "@/features/about/components/exploreServices/aboutExploreServices.module.css";
import type { AboutServiceRow } from "@/features/about/model/aboutPageTypes";

type ExploreServicePanelProps = {
  service: AboutServiceRow;
  index: number;
  isFinal: boolean;
  total: number;
};

export function ExploreServicePanel({
  service,
  index,
  isFinal,
  total,
}: ExploreServicePanelProps) {
  const titleId = `explore-service-${service.id}`;
  const indexLabel = `S.${String(service.index).padStart(2, "0")}`;

  return (
    <div
      className={styles.shell}
      data-service-shell
      data-final={isFinal ? "true" : "false"}
      style={{ zIndex: index + 1 }}
    >
      <article
        className={styles.foreground}
        data-service-foreground
        aria-labelledby={titleId}
      >
        <div className={styles.identity}>
          <p className={styles.eyebrow}>{service.label}</p>
          <ServiceNumeral index={service.index} className={styles.number} />
          <h3 id={titleId} className="sr-only">
            {indexLabel} — {service.label}
          </h3>
        </div>

        <span className={styles.divider} aria-hidden="true" data-service-divider />

        <div className={styles.content}>
          <ServiceDescription
            service={service}
            className={styles.description}
            linkClassName={styles.exploreLink}
          />

          <ExploreServiceVisual service={service} />
        </div>
      </article>
      <span className="sr-only">
        Service {index + 1} of {total}
      </span>
    </div>
  );
}
