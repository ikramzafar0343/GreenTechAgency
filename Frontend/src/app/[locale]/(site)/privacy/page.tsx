import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GreenTech Agency handles personal information on this site.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-3xl px-[clamp(1.25rem,3.5vw,3rem)] py-[clamp(4rem,10vw,7rem)]">
        <h1 className="typeDisplay mb-6">Privacy Policy</h1>
        <p className="typeBody opacity-80">
          This page outlines how we collect and use information when you browse
          this site or send an enquiry. We only use contact details you submit
          to respond to your request and do not sell personal data. For
          questions, email hello@greentechagency.com.
        </p>
      </section>
    </main>
  );
}
