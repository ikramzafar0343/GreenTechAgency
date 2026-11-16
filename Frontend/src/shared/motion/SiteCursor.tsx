"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE = "a, button, [role='button'], summary, [data-cursor]";

/**
 * Decorative follow-ring cursor (desktop, fine pointer only). The native cursor stays
 * visible for accessibility; the ring grows over interactive elements and shows an
 * optional label from `data-cursor="View"`.
 */
export function SiteCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ring || !label || !fine || reduce) {
      return;
    }
    const xTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to(ring, { autoAlpha: 1, duration: 0.2 });
      }
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(INTERACTIVE);
      const text = target?.getAttribute("data-cursor") ?? "";
      label.textContent = text;
      gsap.to(ring, { scale: target ? (text ? 2.6 : 1.8) : 1, duration: 0.25, ease: "power2.out" });
    };
    const onLeave = () => {
      visible = false;
      gsap.to(ring, { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] -mt-4 -ml-4 flex size-8 items-center justify-center rounded-full border border-[var(--brand-cyan,#58e2ec)] opacity-0 mix-blend-difference"
    >
      <span ref={labelRef} className="text-[0.32rem] font-semibold tracking-[0.12em] text-white uppercase" />
    </div>
  );
}
