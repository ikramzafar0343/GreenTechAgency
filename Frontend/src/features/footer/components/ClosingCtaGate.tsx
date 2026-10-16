"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ClosingCtaGateProps = {
  children: ReactNode;
};

/** Hide the global closing banner where the page already owns its own CTA. */
export function ClosingCtaGate({ children }: ClosingCtaGateProps) {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/insights") {
    return null;
  }
  return children;
}
