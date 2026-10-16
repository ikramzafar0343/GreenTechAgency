"use client";

import type { ReactNode } from "react";

type SiteHeaderGateProps = {
  children: ReactNode;
};

/** Site header renders on all routes, including /contact. */
export function SiteHeaderGate({ children }: SiteHeaderGateProps) {
  return children;
}
