import type { LegalSection } from "@/features/legal/components/LegalDocument";

export const TERMS_UPDATED = "16 November 2026";

export const TERMS_INTRO =
  "These terms govern your use of the GreenTech Agency website. Project work for clients is covered by a separate written agreement, which takes priority over these terms if the two differ.";

export const TERMS_SECTIONS: readonly LegalSection[] = [
  {
    heading: "Using this website",
    paragraphs: [
      "You may browse this website and share its pages for personal or business research. You agree not to misuse it, for example by attempting to gain unauthorised access, overloading the service, scraping it in a way that harms performance or submitting false or malicious information through its forms.",
    ],
  },
  {
    heading: "Information on this site",
    paragraphs: [
      "Our articles, guides and service descriptions are provided for general information. They are not professional, legal or financial advice for your specific situation. We work to keep content accurate and current but cannot guarantee that every detail is complete or up to date.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "Unless stated otherwise, the content, design, illustrations, code and branding on this site belong to GreenTech Agency or its licensors. You may quote short extracts with attribution and a link. Any other reuse requires our written permission. Client names and logos are shown with permission and remain the property of their owners.",
    ],
  },
  {
    heading: "Enquiries and quotes",
    paragraphs: [
      "Sending an enquiry does not create a contract. Any proposal or estimate we provide is an invitation to agree a written project agreement, which will set out scope, timelines, fees, ownership of deliverables and other terms.",
    ],
  },
  {
    heading: "Client and staff portals",
    items: [
      "Access to the admin and employee portals is limited to authorised users.",
      "You are responsible for keeping your login details confidential and for activity under your account.",
      "We may suspend access to protect the security of the service or other users.",
    ],
  },
  {
    heading: "Links to other websites",
    paragraphs: [
      "This site links to external websites, such as references in our guides. We are not responsible for the content or practices of those sites.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "To the extent permitted by law, GreenTech Agency is not liable for indirect or consequential loss arising from use of this website. Nothing in these terms limits liability that cannot be limited by law.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "We may update these terms from time to time; the date at the top shows the latest version. Questions about these terms can be sent to hello@greentechagency.com.",
    ],
  },
];
