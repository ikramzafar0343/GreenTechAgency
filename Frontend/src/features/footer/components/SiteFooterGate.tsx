"use client";

import type { ReactNode } from "react";

type SiteFooterGateProps = {
  children: ReactNode;
};

/** Site footer renders on all routes, including /contact. */
export function SiteFooterGate({ children }: SiteFooterGateProps) {
  return children;
}
