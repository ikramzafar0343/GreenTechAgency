import Image from "next/image";
import type { TeamMember } from "@/features/about/model/teamMember";
import styles from "@/features/about/components/employeeCarousel/EmployeeCarousel.module.css";

type EmployeeCardProps = {
  member: TeamMember;
  isClone?: boolean;
};

export function EmployeeCard({ member, isClone = false }: EmployeeCardProps) {
  return (
    <li
      className={styles.card}
      data-employee-card
      aria-hidden={isClone ? true : undefined}
    >
      <figure className={styles.figure}>
        <Image
          src={member.imageUrl}
          alt={isClone ? "" : member.imageAlt}
          fill
          sizes="(max-width: 767px) 82vw, (max-width: 1279px) 42vw, 470px"
          className={styles.cardImage}
          draggable={false}
          style={{
            objectPosition: `${member.imageFocalPointX}% ${member.imageFocalPointY}%`,
          }}
        />
        <figcaption className={styles.cardCaption}>
          <span className={styles.cardName}>{member.fullName}</span>
          <span className={styles.cardRole}>{member.role}</span>
        </figcaption>
      </figure>
    </li>
  );
}
