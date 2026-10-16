"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-header-surface"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return Boolean(document.querySelector('[data-header-surface="light"]'));
}

function getServerSnapshot() {
  return false;
}

/**
 * Dark ink over light heroes; white ink once the scrolled glass shell is active.
 * Pages/sections opt in with `data-header-surface="light"`.
 */
export function useHeaderInkMode(isScrolled: boolean): "light" | "dark" {
  usePathname();
  const overLightSurface = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (isScrolled) {
    return "light";
  }

  return overLightSurface ? "dark" : "light";
}
