import type {
  FooterGroupTitles,
  FooterLinkGroup,
  FooterNavLink,
} from "@/features/footer/model/types";
import { getServiceHref } from "@/features/services/model/serviceItems";

const COMPANY_LINKS: readonly FooterNavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/#our-work", label: "Our Work" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/insights", label: "Insights" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
];

const DEVELOPMENT_SLUGS = [
  "web-development",
  "mobile-app-development",
  "ecommerce-development",
  "ui-ux-design",
  "artificial-intelligence",
  "it-resource-outsourcing",
] as const;

const MARKETING_SLUGS = [
  "search-engine-optimization",
  "generative-engine-optimization",
  "digital-marketing",
  "social-media-marketing",
  "content-marketing",
  "copywriting",
  "digital-branding-creatives",
] as const;

const ADDITIONAL_SLUGS = [
  "augmented-reality",
  "virtual-reality",
  "video-animation-2d-3d",
] as const;

export type FooterServiceCatalogItem = {
  readonly slug: string;
  readonly title: string;
};

function linksFromSlugs(
  slugs: readonly string[],
  catalog: ReadonlyMap<string, FooterServiceCatalogItem>,
): FooterNavLink[] {
  return slugs.flatMap((slug) => {
    const service = catalog.get(slug);
    if (!service) {
      return [];
    }
    return [{ href: getServiceHref(service.slug), label: service.title }];
  });
}

export function buildFooterLinkGroups(
  titles: FooterGroupTitles,
  catalogItems: readonly FooterServiceCatalogItem[],
): FooterLinkGroup[] {
  const catalog = new Map(
    catalogItems.map((item) => [item.slug, item] as const),
  );
  const groups: FooterLinkGroup[] = [
    {
      id: "company",
      title: titles.company,
      links: COMPANY_LINKS,
      defaultOpen: true,
    },
  ];

  const development = linksFromSlugs(DEVELOPMENT_SLUGS, catalog);
  if (development.length > 0) {
    groups.push({
      id: "development",
      title: titles.development,
      links: development,
      defaultOpen: false,
    });
  }

  const marketing = linksFromSlugs(MARKETING_SLUGS, catalog);
  if (marketing.length > 0) {
    groups.push({
      id: "marketing",
      title: titles.marketing,
      links: marketing,
      defaultOpen: false,
    });
  }

  const additional = linksFromSlugs(ADDITIONAL_SLUGS, catalog);
  if (additional.length > 0) {
    groups.push({
      id: "additional",
      title: titles.additional,
      links: additional,
      defaultOpen: false,
    });
  }

  return groups;
}
