"use client";

import type { CSSProperties } from "react";
import { EmployeeCard } from "@/features/about/components/employeeCarousel/EmployeeCard";
import styles from "@/features/about/components/employeeCarousel/EmployeeCarousel.module.css";
import { useEmployeeMarquee } from "@/features/about/components/employeeCarousel/useEmployeeMarquee";
import type { TeamMember } from "@/features/about/model/teamMember";

type EmployeeCarouselProps = {
  members: readonly TeamMember[];
};

export function EmployeeCarousel({ members }: EmployeeCarouselProps) {
  const ordered = [...members].sort((a, b) => a.sortOrder - b.sortOrder);
  const { shouldLoop, durationSeconds } = useEmployeeMarquee(ordered.length);

  if (ordered.length === 0) {
    return null;
  }

  const marqueeStyle = {
    "--teamMarqueeDuration": `${durationSeconds}s`,
  } as CSSProperties;

  return (
    <section
      className={styles.teamSection}
      aria-labelledby="teamSectionTitle"
    >
      <header className={styles.visuallyHiddenHeading}>
        <h2 id="teamSectionTitle">Meet our team</h2>
      </header>

      <div
        className={styles.viewport}
        data-static={shouldLoop ? "false" : "true"}
        style={marqueeStyle}
        role="region"
        aria-label="Our team members"
        tabIndex={0}
      >
        <div className={styles.track}>
          <ul className={styles.group}>
            {ordered.map((member) => (
              <EmployeeCard key={member.id} member={member} />
            ))}
          </ul>
          {shouldLoop ? (
            <ul
              className={`${styles.group} ${styles.repeatGroup}`}
              aria-hidden="true"
            >
              {ordered.map((member) => (
                <EmployeeCard
                  key={`repeat-${member.id}`}
                  member={member}
                  isClone
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
