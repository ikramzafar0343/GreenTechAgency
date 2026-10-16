export type MouseTrailProps = {
  images: readonly string[];
  imageWidth?: number;
  imageHeight?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
  /** Path length in CSS pixels between successive card anchors. */
  spawnDistance?: number;
  /** Minimum center-to-center gap from still-visible cards. */
  minSeparation?: number;
  /** Maximum simultaneously mounted/animated image cards. */
  maxVisibleImages?: number;
  /** Milliseconds from spawn until exit animation starts. */
  imageLifetimeMs?: number;
  /** Exit fade duration in seconds. */
  exitDuration?: number;
  /** Exit fade duration when leaving the section, in seconds. */
  pointerLeaveExitDuration?: number;
  /** GSAP ease used for exit animations. */
  exitEase?: string;
  /** Blur amount in px applied during exit (0 = none). */
  exitBlur?: number;
  /** After this many ms without pointer movement, fade the trail out. 0 = off. */
  idleDelayMs?: number;
};

export type TrailPoint = {
  x: number;
  y: number;
};

export type TrailCardModel = {
  id: number;
  src: string;
  x: number;
  y: number;
  rotate: number;
};
