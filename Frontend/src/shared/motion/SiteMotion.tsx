import { SiteCursor } from "@/shared/motion/SiteCursor";
import { SmoothScroll } from "@/shared/motion/SmoothScroll";

/** Site-wide motion layer for the public storefront (not used in the portals). */
export function SiteMotion() {
  return (
    <>
      <SmoothScroll />
      <SiteCursor />
    </>
  );
}
