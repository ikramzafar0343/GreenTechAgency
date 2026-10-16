import type { ReactNode } from "react";

export type PinRotateSlotProps = {
  children?: ReactNode;
  className?: string;
};

export type PinRotateSectionsProps = {
  children: ReactNode;
  className?: string;
  /** Readable dwell per panel as a fraction of viewport height. */
  dwellVh?: number;
  /** Peak rotation (degrees) during handoff. */
  rotationStrength?: number;
  /** Disable pin below this viewport height (px). */
  minPinHeight?: number;
  /** Force stacked document flow (no pin). */
  forceStack?: boolean;
};
