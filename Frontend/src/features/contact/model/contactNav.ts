export const CONTACT_MENU_LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "portfolio", label: "Portfolio", href: "/portfolio" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

export const CONTACT_HEADER = {
  portfolioLabel: "Portfolio",
  portfolioHref: "/portfolio",
  menuOpenLabel: "Menu",
  menuCloseLabel: "Close",
  brandHideScrollPx: 96,
} as const;
