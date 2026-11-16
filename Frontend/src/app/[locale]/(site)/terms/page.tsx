import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal/components/LegalDocument";
import { TERMS_INTRO, TERMS_SECTIONS, TERMS_UPDATED } from "@/features/legal/model/termsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the GreenTech Agency website.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      updated={TERMS_UPDATED}
      intro={TERMS_INTRO}
      sections={TERMS_SECTIONS}
    />
  );
}
