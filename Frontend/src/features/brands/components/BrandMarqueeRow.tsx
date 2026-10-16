import Image from "next/image";
import {
  type BrandRowConfig,
  VISUAL_COPIES,
} from "@/features/brands/model/brandLogos";
import styles from "@/features/brands/styles/brandFamily.module.css";

type BrandMarqueeRowProps = {
  row: BrandRowConfig;
  exposeNames: boolean;
};

export function BrandMarqueeRow({ row, exposeNames }: BrandMarqueeRowProps) {
  return (
    <div
      className={styles.row}
      data-brand-row
      data-direction={row.direction}
      aria-hidden={exposeNames ? undefined : true}
    >
      <div className={styles.scrollLayer} data-brand-scroll-layer>
        <div className={styles.track} data-brand-track>
          {Array.from({ length: VISUAL_COPIES }, (_, copyIndex) => {
            const isSourceGroup = exposeNames && copyIndex === 0;

            return (
              <ul
                key={`${row.id}-${copyIndex}`}
                className={styles.group}
                data-brand-group={copyIndex === 0 ? true : undefined}
                aria-hidden={isSourceGroup ? undefined : true}
              >
                {row.logos.map((logo) => (
                  <li
                    key={`${row.id}-${copyIndex}-${logo.src}`}
                    className={styles.logo}
                  >
                    <Image
                      src={logo.src}
                      alt={isSourceGroup ? logo.name : ""}
                      width={logo.width}
                      height={logo.height}
                      className={styles.logoImg}
                      sizes="96px"
                    />
                  </li>
                ))}
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
}
