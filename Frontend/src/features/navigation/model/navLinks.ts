export type NavLinkId = "about" | "services" | "blog" | "contact";

export type MegaMenuId = "services";

export type NavLinkItem = {
  id: NavLinkId;
  label: string;
  href: string;
  megaMenuId?: MegaMenuId;
};

export const NAV_LINKS: readonly NavLinkItem[] = [
  { id: "about", label: "About", href: "/about" },
  {
    id: "services",
    label: "Services",
    href: "/services",
    megaMenuId: "services",
  },
  { id: "blog", label: "Insights", href: "/insights" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

export const DESKTOP_MEGA_BREAKPOINT_PX = 1200;
