import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";

export type JsonLd = Record<string, unknown>;

export function jsonLdScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data);
}

export function organizationJsonLd(options?: {
  email?: string;
  logoPath?: string;
}): JsonLd {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GreenTech Agency",
    url: site,
    logo: absoluteUrl(options?.logoPath ?? "/logo.png"),
    email: options?.email ?? "hello@greentechagency.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: options?.email ?? "hello@greentechagency.com",
      url: absoluteUrl("/contact"),
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GreenTech Agency",
    url: getSiteUrl(),
    publisher: {
      "@type": "Organization",
      name: "GreenTech Agency",
      url: getSiteUrl(),
    },
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      name: "GreenTech Agency",
      url: getSiteUrl(),
    },
    areaServed: "Worldwide",
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string | null;
  dateModified?: string | null;
  image?: string | null;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    datePublished: input.datePublished ?? undefined,
    dateModified: input.dateModified ?? input.datePublished ?? undefined,
    image: input.image ? absoluteUrl(input.image) : undefined,
    author: {
      "@type": "Organization",
      name: "GreenTech Agency",
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: "GreenTech Agency",
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
  };
}

export function breadcrumbJsonLd(
  items: readonly { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(
  items: readonly { question: string; answer: string }[],
): JsonLd | null {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
