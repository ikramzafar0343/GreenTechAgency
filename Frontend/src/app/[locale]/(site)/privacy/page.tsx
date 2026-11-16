import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal/components/LegalDocument";
import { PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_UPDATED } from "@/features/legal/model/privacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How GreenTech Agency collects, uses, protects and retains personal information sent through this website, and the rights you have.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      updated={PRIVACY_UPDATED}
      intro={PRIVACY_INTRO}
      sections={PRIVACY_SECTIONS}
    />
  );
}
