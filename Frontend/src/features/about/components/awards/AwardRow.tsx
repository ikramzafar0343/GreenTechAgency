import type { AboutAwardRow } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/components/awards/awardRow.module.css";

type AwardRowProps = {
  row: AboutAwardRow;
  index: number;
};

export function AwardRow({ row, index }: AwardRowProps) {
  const number = String(index + 1).padStart(2, "0");
  const countLabel =
    row.awardCount !== null
      ? `x${String(row.awardCount).padStart(2, "0")} Awards`
      : "";
  const accessibleName = [row.organizationName, row.description, countLabel]
    .filter(Boolean)
    .join(" — ");

  const inner = (
    <div className={styles.rowContent}>
      <span className={styles.colNumber}>{number}.</span>
      <span className={styles.colOrg}>{row.organizationName}</span>
      <span className={styles.colDesc}>{row.description}</span>
      <span className={styles.colCount}>{countLabel}</span>
    </div>
  );

  return (
    <li
      className={styles.row}
      data-award-row
      data-preview-src={row.previewImage?.src ?? ""}
    >
      {row.evidenceHref ? (
        <a
          href={row.evidenceHref}
          className={styles.rowLink}
          aria-label={accessibleName}
        >
          {inner}
        </a>
      ) : (
        <div className={styles.rowStatic}>{inner}</div>
      )}
    </li>
  );
}
