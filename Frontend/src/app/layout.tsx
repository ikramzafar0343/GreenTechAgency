import type { Metadata } from "next";
import { brandFont } from "@/shared/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenTech Agency",
  description: "GreenTech Agency — technology agency.",
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
