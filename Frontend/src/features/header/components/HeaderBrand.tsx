import Image from "next/image";
import { Link } from "@/i18n/navigation";
import styles from "@/features/header/styles/headerShell.module.css";

export function HeaderBrand() {
  return (
    <Link href="/" className={styles.brand} data-no-translate>
      <Image
        src="/logo.png"
        alt="GreenTech Agency logo"
        width={136}
        height={72}
        priority
        className={styles.logo}
      />
      <span className={styles.brandText}>
        <span className={`${styles.brandEyebrow} typeMeta`}>GreenTech</span>
        <span className={`${styles.brandName} typeSmall`}>Agency</span>
      </span>
    </Link>
  );
}
