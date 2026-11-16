import type { LegalSection } from "@/features/legal/components/LegalDocument";

export const PRIVACY_UPDATED = "16 November 2026";

export const PRIVACY_INTRO =
  "This policy explains what personal information GreenTech Agency collects through this website, why we collect it, how long we keep it and the choices you have. We collect as little as possible and never sell personal data.";

export const PRIVACY_SECTIONS: readonly LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "GreenTech Agency (\"GreenTech\", \"we\", \"us\") is a digital agency providing web and app development, design, marketing and technology services. We are responsible for the personal information collected through greentechagency.com.",
      "Questions about this policy or your data can be sent to hello@greentechagency.com.",
    ],
  },
  {
    heading: "Information we collect",
    items: [
      "Enquiry details you choose to send through our contact forms, such as your name, email address, phone number, company, the service you are interested in and your message.",
      "Technical information needed to deliver and protect the site, such as IP address, browser type and request logs. This is used for security, abuse prevention (including rate limiting) and troubleshooting.",
      "Account information for staff and clients who use our admin or employee portals, such as name, email and login sessions.",
    ],
  },
  {
    heading: "How we use your information",
    items: [
      "To reply to your enquiry and discuss or deliver a project you request.",
      "To keep the website secure, prevent spam and investigate misuse.",
      "To meet legal, accounting and contractual obligations.",
      "To improve our services, using aggregated information that does not identify you.",
    ],
    paragraphs: [
      "We rely on your request (to answer an enquiry), our legitimate interests (to run and secure the site), contract (to deliver agreed work) and legal obligations as the bases for this processing, where such bases are required by law.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "The public website does not use advertising or third-party tracking cookies. Our admin and employee portals use strictly necessary session cookies so that signed-in users stay signed in securely. These cookies are not used for marketing.",
      "If we add analytics or marketing tools in future, we will update this policy and ask for consent where the law requires it.",
    ],
  },
  {
    heading: "Sharing your information",
    paragraphs: [
      "We share personal information only with service providers who help us operate, such as hosting and email providers, under agreements that require them to protect it and use it only on our instructions. We may also disclose information when required by law or to protect our rights and users.",
    ],
  },
  {
    heading: "How long we keep information",
    items: [
      "Enquiries: for as long as needed to respond and follow up, and normally no longer than 24 months after our last contact unless a project begins.",
      "Project and billing records: for the period required by accounting and tax law.",
      "Security logs: for a short period, typically up to 90 days, unless needed to investigate an incident.",
    ],
  },
  {
    heading: "How we protect information",
    paragraphs: [
      "We use HTTPS, access controls, least-privilege accounts, rate limiting and regular backups. No system is perfectly secure, but we work to protect your data and will act promptly if an incident occurs.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Depending on where you live, you may have the right to access, correct, delete or receive a copy of your personal information, to object to or restrict certain processing, and to withdraw consent. To make a request, email hello@greentechagency.com. You may also complain to your local data-protection authority.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy when our services or the law change. The date at the top shows when it was last revised.",
    ],
  },
];
