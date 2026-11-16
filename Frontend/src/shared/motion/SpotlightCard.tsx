"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

type SpotlightCardProps = {
  readonly children: ReactNode;
  readonly className?: string | undefined;
};

/**
 * Card with a soft cyan spotlight that follows the pointer (CSS variables only, no
 * re-render per move). Purely decorative; content and focus styles are unchanged.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group relative isolate overflow-hidden ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--brand-cyan, #58e2ec) 22%, transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
