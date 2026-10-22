import { SiteFooter } from "@/features/footer/components/SiteFooter";
import { SiteFooterGate } from "@/features/footer/components/SiteFooterGate";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";
import { JsonLdScript } from "@/lib/seo/JsonLdScript";
import { SiteHeader } from "@/shared/ui/SiteHeader";
import { SiteHeaderGate } from "@/shared/ui/SiteHeaderGate";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({
  children,
  params,
}: SiteLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />
      <SiteHeaderGate>
        <SiteHeader />
      </SiteHeaderGate>
      {children}
      <SiteFooterGate>
        <SiteFooter />
      </SiteFooterGate>
    </>
  );
}
