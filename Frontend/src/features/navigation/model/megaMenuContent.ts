import { BRAND_ROWS } from "@/features/brands/model/brandLogos";
import type { MegaMenuId } from "@/features/navigation/model/navLinks";
import { getServiceHref } from "@/features/services/model/serviceItems";

export type MegaMenuLink = {
  id: string;
  label: string;
  href: string;
};

export type MegaMenuLogo = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
};

export type MegaMenuPanel = {
  id: MegaMenuId;
  label: string;
  panelId: string;
  disclosureId: string;
  links: readonly MegaMenuLink[];
  proofHeading: string;
  logos: readonly MegaMenuLogo[];
};

const PROOF_HEADING = "Stories worth telling, brands worth building";

function uniqueBrandLogos(limit: number): readonly MegaMenuLogo[] {
  const seen = new Set<string>();
  const logos: MegaMenuLogo[] = [];

  for (const row of BRAND_ROWS) {
    for (const logo of row.logos) {
      if (seen.has(logo.src)) {
        continue;
      }
      seen.add(logo.src);
      logos.push({
        id: `brand-${logos.length + 1}`,
        name: logo.name,
        src: logo.src,
        width: logo.width,
        height: logo.height,
      });
      if (logos.length >= limit) {
        return logos;
      }
    }
  }

  return logos;
}

export function buildMegaMenuPanels(
  services: readonly { id: string; slug: string; title: string }[],
): readonly MegaMenuPanel[] {
  return [
    {
      id: "services",
      label: "Services",
      panelId: "mega-menu-panel-services",
      disclosureId: "mega-menu-disclosure-services",
      links: services.map((service) => ({
        id: service.id,
        label: service.title,
        href: getServiceHref(service.slug),
      })),
      proofHeading: PROOF_HEADING,
      logos: uniqueBrandLogos(16),
    },
  ] as const;
}

export function findMegaMenuPanel(
  panels: readonly MegaMenuPanel[],
  id: MegaMenuId,
): MegaMenuPanel | undefined {
  return panels.find((panel) => panel.id === id);
}
