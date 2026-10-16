import { Link } from "@/i18n/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import {
  getServiceHref,
  type ServiceItem,
} from "@/features/services/model/serviceItems";
import styles from "@/features/services/styles/services.module.css";

type ServiceCardProps = {
  service: ServiceItem;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={getServiceHref(service.slug)} className={styles.card}>
      <div className={styles.copy}>
        <p className={`${styles.label} typeMeta`}>{service.label}</p>
        <h3 className={`${styles.title} typeCardTitle`}>{service.title}</h3>
      </div>
      <span className={styles.arrow} aria-hidden="true">
        <FiArrowUpRight className={styles.arrowIcon} />
      </span>
    </Link>
  );
}
