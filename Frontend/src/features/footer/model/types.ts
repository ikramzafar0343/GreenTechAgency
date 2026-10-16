export type FooterSocialPlatform =
  | "linkedin"
  | "instagram"
  | "facebook"
  | "x"
  | "youtube"
  | "github"
  | "dribbble"
  | "behance";

export type FooterSocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  displayOrder: number;
};

export type FooterContactInfo = {
  address: string | null;
  email: string | null;
  phone: string | null;
  hours: string | null;
  mapUrl: string | null;
};

export type FooterGroupTitles = {
  company: string;
  development: string;
  marketing: string;
  additional: string;
};

export type FooterNavLink = {
  href: string;
  label: string;
};

export type FooterLinkGroup = {
  id: string;
  title: string;
  links: readonly FooterNavLink[];
  defaultOpen: boolean;
};

export type PublicFooterSettings = {
  brandName: string;
  logoUrl: string;
  showClosingCta: boolean;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
  showCtaArrow: boolean;
  ctaEntryAnimation: boolean;
  contact: FooterContactInfo;
  showBrandSignature: boolean;
  copyrightName: string;
  privacyHref: string | null;
  termsHref: string | null;
  groupTitles: FooterGroupTitles;
  socialLinks: FooterSocialLink[];
  year: number;
};
