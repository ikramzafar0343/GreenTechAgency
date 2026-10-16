"use client";

import { useRef } from "react";
import { ExploreServicePanel } from "@/features/about/components/exploreServices/ExploreServicePanel";
import { useServiceStickyStack } from "@/features/about/components/exploreServices/useServiceStickyStack";
import styles from "@/features/about/components/exploreServices/aboutExploreServices.module.css";
import type { AboutServiceRow } from "@/features/about/model/aboutPageTypes";

type AboutExploreServicesProps = {
  services: readonly AboutServiceRow[];
};

export function AboutExploreServices({ services }: AboutExploreServicesProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  const ordered = [...services].sort((a, b) => a.index - b.index);

  useServiceStickyStack({
    groupRef,
    panelCount: ordered.length,
  });

  if (ordered.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Explore our services">
      <div className={styles.heading}>
        <span className={styles.headingLeft}>Explore</span>
        <span className={styles.headingCenter}>01</span>
        <span className={styles.headingRight}>Services</span>
      </div>

      <div
        ref={groupRef}
        className={styles.stack}
        data-services-stack
        data-services-mode="flow"
      >
        {ordered.map((service, index) => (
          <ExploreServicePanel
            key={service.id}
            service={service}
            index={index}
            isFinal={index === ordered.length - 1}
            total={ordered.length}
          />
        ))}
      </div>
    </section>
  );
}
