import { ScrollMotionConfig } from "@/shared/motion/ScrollMotionConfig";
import { SiteCursor } from "@/shared/motion/SiteCursor";

/** Site-wide motion layer for the public storefront (not used in the portals). */
export function SiteMotion() {
  return (
    <>
      <ScrollMotionConfig />
      <SiteCursor />
    </>
  );
}
