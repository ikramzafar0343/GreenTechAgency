"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import type { AboutClientItem } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutClients.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutClientWallProps = {
  clients: readonly AboutClientItem[];
};

export function AboutClientWall({ clients }: AboutClientWallProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || clients.length === 0) {
        return;
      }

      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-client-item]"),
      );
      if (prefersReducedMotion()) {
        items[0]?.setAttribute("data-active", "true");
        return;
      }

      const setActive = (activeIndex: number) => {
        items.forEach((item, index) => {
          item.dataset.active = index === activeIndex ? "true" : "false";
        });
      };

      setActive(0);

      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });

        item.addEventListener("mouseenter", () => setActive(index));
        item.addEventListener("focusin", () => setActive(index));
      });
    },
    { scope: rootRef, dependencies: [clients.length] },
  );

  const ordered = [...clients].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section ref={rootRef} className={styles.section} aria-label="Brands we work with">
      <ul className={styles.list}>
        {ordered.map((client) => (
          <li key={client.id} className={styles.item} data-client-item>
            {client.caseStudyHref ? (
              <Link href={client.caseStudyHref} className={styles.link}>
                {client.name}
              </Link>
            ) : (
              <span className={styles.name}>{client.name}</span>
            )}
          </li>
        ))}
      </ul>
      <p className={styles.blurb}>
        A selection of brands from our storefront family — partnerships built around clear
        delivery and lasting systems.
      </p>
    </section>
  );
}
