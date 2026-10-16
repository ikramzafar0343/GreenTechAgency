"use client";

import { useEffect } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

export function FooterMobileDefaults() {
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>("[data-site-footer]");
    if (!footer) {
      return;
    }

    const groups = Array.from(
      footer.querySelectorAll<HTMLDetailsElement>("details[data-footer-group]"),
    );

    const apply = () => {
      const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
      for (const group of groups) {
        if (isDesktop) {
          group.open = true;
          continue;
        }
        group.open = group.dataset.defaultOpen === "true";
      }
    };

    apply();
    const media = window.matchMedia(DESKTOP_QUERY);
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return null;
}
