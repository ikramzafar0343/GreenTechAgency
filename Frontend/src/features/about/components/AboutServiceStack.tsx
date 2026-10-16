import { AboutServiceRow } from "@/features/about/components/AboutServiceRow";
import type { AboutServiceRow as AboutServiceRowData } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutServices.module.css";

type AboutServiceStackProps = {
  services: readonly AboutServiceRowData[];
};

export function AboutServiceStack({ services }: AboutServiceStackProps) {
  return (
    <section className={styles.stack} aria-label="Capabilities">
      {services.map((service) => (
        <AboutServiceRow key={service.id} service={service} />
      ))}
    </section>
  );
}
