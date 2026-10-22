import type { Metadata } from "next";
import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { ContactPageView } from "@/features/contact/components/ContactPageView";
import { getContactServiceCatalog } from "@/features/services/server/getContactServiceCatalog";
import { BackendHttpError } from "@/server/backend/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact GreenTech Agency | Project Enquiries",
  description:
    "Start a project, join the team, or say hi. Tell us about your website, software, design, or digital growth plans.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact GreenTech Agency | Project Enquiries",
    description:
      "Start a project, join the team, or say hi. Tell us about your website, software, design, or digital growth plans.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  try {
    const serviceChips = await getContactServiceCatalog();
    return (
      <main className="relative flex flex-1 flex-col bg-[var(--contact-paper,#f0f6f8)]">
        <ContactPageView serviceChips={serviceChips} />
      </main>
    );
  } catch (err) {
    const message =
      err instanceof BackendHttpError
        ? err.message
        : "We could not load the contact form right now.";
    return (
      <main className="relative flex flex-1 flex-col bg-[var(--contact-paper,#f0f6f8)]">
        <PublicFetchErrorPanel title="Contact unavailable" message={message} />
      </main>
    );
  }
}
