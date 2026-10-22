import type { Metadata } from "next";
import { brandFont } from "@/shared/lib/fonts";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GreenTech Agency | Web Development, Digital Products and SEO",
    template: "%s | GreenTech Agency",
  },
  description:
    "GreenTech Agency designs and develops high-performance websites, digital products and SEO strategies that help ambitious businesses grow online.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "GreenTech Agency",
    title: "GreenTech Agency | Web Development, Digital Products and SEO",
    description:
      "GreenTech Agency designs and develops high-performance websites, digital products and SEO strategies that help ambitious businesses grow online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenTech Agency | Web Development, Digital Products and SEO",
    description:
      "GreenTech Agency designs and develops high-performance websites, digital products and SEO strategies that help ambitious businesses grow online.",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${brandFont.variable} h-full antialiased`}>
      <body className="siteTypography flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
