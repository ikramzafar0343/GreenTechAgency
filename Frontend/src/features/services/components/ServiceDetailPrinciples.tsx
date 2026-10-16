import type { PublicServiceDetail } from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";

type Props = {
  principles: PublicServiceDetail["principles"];
};

export function ServiceDetailPrinciples({ principles }: Props) {
  return (
    <section
      className={`${styles.section} ${styles.editorial} ${styles.reveal}`}
      aria-labelledby="service-principles"
    >
      <h2 id="service-principles" className={`${styles.principlesHead} typeSectionTitle`}>
        How we work
      </h2>
      <div className={styles.principlesGrid}>
        {principles.map((item, index) => (
          <article key={item.id}>
            <span className={`${styles.principleNum} typeMetric`}>
              {String(index + 1).padStart(2, "0")}
              <span>.</span>
            </span>
            <h3 className={`${styles.principleTitle} typeHeading`}>{item.title}</h3>
            <p className={`${styles.principleBody} typeBody`}>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
