"use client";

import { GlowingArchSection } from "@/features/services/components/GlowingArchSection/GlowingArchSection";
import { ServiceGroupCarousel } from "@/features/services/components/ServiceGroupCarousel";
import { useRevealOnce } from "@/features/services/hooks/useRevealOnce";
import type { ServiceShowcaseGroup as GroupData } from "@/features/services/model/servicesHubTypes";
import styles from "@/features/services/styles/servicesHub.module.css";

type ServiceShowcaseGroupProps = {
  group: GroupData;
  showArch?: boolean;
};

export function ServiceShowcaseGroup({
  group,
  showArch = false,
}: ServiceShowcaseGroupProps) {
  const headingId = `service-group-${group.id}`;
  const {
    setNode: setHeaderNode,
    revealed: headerRevealed,
    reduceMotion: headerReduceMotion,
  } = useRevealOnce();
  const {
    setNode: setStageNode,
    revealed: stageRevealed,
    reduceMotion: stageReduceMotion,
  } = useRevealOnce();
  const outlineActive = headerRevealed && !headerReduceMotion;

  return (
    <section
      ref={setHeaderNode}
      className={styles.group}
      aria-labelledby={headingId}
      data-header-revealed={headerRevealed ? "true" : "false"}
      data-outline-active={outlineActive ? "true" : "false"}
      data-arch={showArch ? "true" : "false"}
    >
      {showArch ? (
        <GlowingArchSection
          eyebrow={group.eyebrow}
          heading={group.title}
          headingId={headingId}
          className={styles.groupArch}
        />
      ) : (
        <header className={styles.groupHeader}>
          <p className={`${styles.groupEyebrow} typeEyebrow`}>{group.eyebrow}</p>
          <h2 id={headingId} className={`${styles.groupTitle} typeSectionTitle`}>
            {group.title}
          </h2>
        </header>
      )}
      <div ref={setStageNode} className={`${styles.container} ${styles.groupBody}`}>
        <ServiceGroupCarousel
          groupId={group.id}
          outlineLabel={group.outlineLabel}
          outlineActive={outlineActive}
          entries={group.entries}
          stageRevealed={stageRevealed}
          reduceMotion={stageReduceMotion}
          groupVisible={headerRevealed}
        />
      </div>
    </section>
  );
}
