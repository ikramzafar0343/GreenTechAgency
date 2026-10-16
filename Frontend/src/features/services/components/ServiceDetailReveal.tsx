"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ServiceDetailRevealProps = {
  className: string;
  children: ReactNode;
};

export function ServiceDetailReveal({
  className,
  children,
}: ServiceDetailRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    node.dataset.ready = "true";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        node.dataset.entered = "true";
      });
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
