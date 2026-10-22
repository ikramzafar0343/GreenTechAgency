import type { Metadata } from "next";
import { ServicesHubPage } from "@/features/services/components/ServicesHubPage";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { JsonLdScript } from "@/lib/seo/JsonLdScript";
import { absoluteUrl } from "@/lib/seo/siteUrl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Development, design, marketing, and emerging technology services built to help businesses grow online.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services | GreenTech Agency",
    description:
      "Development, design, marketing, and emerging technology services built to help businesses grow online.",
    url: absoluteUrl("/services"),
  },
};

export default function ServicesPage() {
  return (
    <main>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <ServicesHubPage />
    </main>
  );
}
