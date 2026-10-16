import { SiteFooter } from "@/features/footer/components/SiteFooter";
import { SiteFooterGate } from "@/features/footer/components/SiteFooterGate";
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
