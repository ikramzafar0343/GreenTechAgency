"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";
import { AboutServiceIcon } from "@/features/about/components/AboutServiceIcon";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import type { AboutServiceRow as AboutServiceRowData } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutServices.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutServiceRowProps = {
  service: AboutServiceRowData;
};

export function AboutServiceRow({ service }: AboutServiceRowProps) {
  const rootRef = useRef<HTMLElement>(null);
  const indexLabel = `S.${String(service.index).padStart(2, "0")}`;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) {
        return;
      }

      const eyebrow = root.querySelector<HTMLElement>("[data-service-eyebrow]");
      const counter = root.querySelector<HTMLElement>("[data-service-counter]");
      const description = root.querySelector<HTMLElement>("[data-service-description]");
      const tile = root.querySelector<HTMLElement>("[data-service-tile]");
      const facts = root.querySelectorAll<HTMLElement>("[data-service-fact]");

      gsap.set([eyebrow, description, tile, ...facts].filter(Boolean), {
        opacity: 0,
        y: 16,
      });
      if (counter) gsap.set(counter, { yPercent: 108 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6 });
      if (counter) tl.to(counter, { yPercent: 0, duration: 0.9 }, "-=0.2");
      if (description) {
        tl.to(description, { opacity: 1, y: 0, duration: 0.75 }, "-=0.35");
      }
      if (tile) {
        tl.fromTo(
          tile,
          { clipPath: "inset(100% 0 0 0)", opacity: 1 },
          { clipPath: "inset(0% 0 0 0)", duration: 0.75 },
          "-=0.25",
        );
      }
      if (facts.length) {
        tl.to(facts, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1 }, "-=0.2");
      }
    },
    { scope: rootRef },
  );

  return (
    <article ref={rootRef} className={styles.row} aria-labelledby={`about-service-${service.id}`}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <p className={styles.eyebrow} data-service-eyebrow>
            {service.label}
          </p>
          <span className={styles.counterMask}>
            <p
              id={`about-service-${service.id}`}
              className={styles.counter}
              data-service-counter
            >
              {indexLabel}
            </p>
          </span>
        </div>
        <div className={styles.right}>
          <p className={styles.description} data-service-description>
            {service.description}{" "}
            <Link href={service.href} className="typeNav">
              Explore
            </Link>
          </p>
          <div className={styles.tile} data-service-tile aria-hidden="true">
            <AboutServiceIcon name={service.iconName} />
          </div>
          <ul className={styles.facts}>
            {service.facts.map((fact) => (
              <li key={`${service.id}-${fact.label}`} data-service-fact>
                <span className={styles.factLabel}>{fact.label}</span>
                <span className={styles.factValue}>{fact.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
