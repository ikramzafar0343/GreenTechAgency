"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import type { AboutTeamMember } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutTeam.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutTeamRailProps = {
  members: readonly AboutTeamMember[];
};

export function AboutTeamRail({ members }: AboutTeamRailProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || members.length === 0 || prefersReducedMotion()) {
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const viewport = root.querySelector<HTMLElement>("[data-team-viewport]");
        const track = root.querySelector<HTMLElement>("[data-team-track]");
        const indicators = root.querySelectorAll<HTMLElement>("[data-team-indicator]");
        if (!viewport || !track) {
          return;
        }

        const distance = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.min(
                indicators.length - 1,
                Math.floor(self.progress * indicators.length),
              );
              indicators.forEach((node, index) => {
                node.dataset.active = index <= active ? "true" : "false";
              });
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [members.length] },
  );

  if (members.length === 0) {
    return null;
  }

  const ordered = [...members].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      ref={rootRef}
      className={styles.section}
      aria-label="Team portraits"
    >
      <div className={styles.viewport} data-team-viewport>
        <ul className={styles.track} data-team-track>
          {ordered.map((member) => (
            <li key={member.id} className={styles.card}>
              <figure className={styles.frame}>
                <Image
                  src={member.imageSrc}
                  alt={member.alt}
                  fill
                  sizes="(max-width: 767px) 80vw, 28vw"
                  className={styles.image}
                />
              </figure>
              <p className={styles.caption}>
                <span className={styles.name}>{member.name}</span>
                {member.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.indicators} aria-hidden="true">
        {ordered.map((member) => (
          <span
            key={`indicator-${member.id}`}
            className={styles.indicator}
            data-team-indicator
          />
        ))}
      </div>
    </section>
  );
}
