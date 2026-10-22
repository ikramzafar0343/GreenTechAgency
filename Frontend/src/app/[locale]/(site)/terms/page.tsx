import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the GreenTech Agency website.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-3xl px-[clamp(1.25rem,3.5vw,3rem)] py-[clamp(4rem,10vw,7rem)]">
        <h1 className="typeDisplay mb-6">Terms &amp; Conditions</h1>
        <p className="typeBody opacity-80">
          By using this website you agree to browse its content for information
          about our services. Project work is governed by a separate agreement.
          Site content remains GreenTech Agency property unless noted otherwise.
          Contact hello@greentechagency.com with any questions.
        </p>
      </section>
    </main>
  );
}
