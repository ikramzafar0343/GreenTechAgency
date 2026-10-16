import Image from "next/image";
import type { MegaMenuLogo } from "@/features/navigation/model/megaMenuContent";
import styles from "@/features/header/styles/megaMenu.module.css";

type MegaMenuProofProps = {
  heading: string;
  logos: readonly MegaMenuLogo[];
};

export function MegaMenuProof({ heading, logos }: MegaMenuProofProps) {
  return (
    <aside className={styles.proof} aria-label="Client brands">
      <p className={`${styles.proofHeading} typeSectionTitle`}>{heading}</p>
      <ul className={styles.logoGrid}>
        {logos.map((logo) => (
          <li key={logo.id} className={styles.logoCell}>
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className={styles.logoImage}
              sizes="140px"
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
