import { SERVICE_ITEMS } from "@/features/services/model/serviceItems";

export const CONTACT_BRAND_NAME = "GreenTech Agency";

/** Hero supporting copy under the giant “contact” word (SOHub reference). */
export const CONTACT_HERO_LINES = [
  "Start a conversation about new",
  "business or media inquiries.",
] as const;

export const CONTACT_INTRO = {
  eyebrow: "Contact",
  beforeHighlight: "Have a project, a question, or an idea for ",
  highlightPhrase: "working together?",
  afterHighlight: " We'd love to hear from you.",
} as const;

export const CONTACT_PROMPTS = {
  choiceLine1: "Hello! What would you like to create?",
  choiceLine2: "Let's find the right next step for you.",
  choice: "Hello! What would you like to create?",
  projectServices: "What can we help you build? Choose the services your project needs.",
  projectBudget: "What budget range are you considering?",
  projectDetailsEyebrow: "Start a project",
  projectDetails: "Share a few details about your project.",
  careersRole: "Tell us how you'd like to contribute.",
  careersRoleNote:
    "We welcome speculative applications — pick general application to continue.",
  careersDetails: "Tell us about your skills and the work you enjoy.",
  general: "Send us a message. We'd love to hear from you.",
  successTitle: "Thanks — your message has been received.",
  successBody:
    "Our team will respond using the details you provided.",
  unavailableTitle: "Almost there",
  unavailableBody:
    "Your message was validated, but enquiry delivery is not available yet. A backend endpoint will handle submissions in a later release.",
  submitFailure: "We couldn't send your message. Please try again.",
  servicesEmptyHint: "Select at least one service to continue.",
  viewWorkLabel: "View our work",
} as const;

export const CONTACT_CHOICES = [
  { id: "project", label: "Start a project" },
  { id: "careers", label: "Join GreenTech" },
  { id: "general", label: "Say hi" },
] as const;

export type ContactChoiceId = (typeof CONTACT_CHOICES)[number]["id"];

/** Full GreenTech taxonomy for project service multi-select. */
export const CONTACT_SERVICE_CHIPS = SERVICE_ITEMS.map((item) => ({
  id: item.id,
  label: item.title,
}));

/** Four centered rows — 16 services → 4 / 4 / 4 / 4. */
export const CONTACT_SERVICE_ROW_SIZES = [4, 4, 4, 4] as const;

export function contactServiceChipRows(
  chips: readonly { id: string; label: string }[] = CONTACT_SERVICE_CHIPS,
) {
  const rows: { id: string; label: string }[][] = [];
  let cursor = 0;
  for (const size of CONTACT_SERVICE_ROW_SIZES) {
    rows.push(chips.slice(cursor, cursor + size));
    cursor += size;
  }
  if (cursor < chips.length) {
    rows.push(chips.slice(cursor));
  }
  return rows;
}

/**
 * Provisional budget bands — flag for commercial approval before treating as official pricing.
 * Currency is labeled in the step UI.
 */
export const CONTACT_BUDGET_CURRENCY = "EUR";

export const CONTACT_BUDGET_BANDS = [
  { id: "1k-5k", label: "€1k–5k" },
  { id: "5k-10k", label: "€5k–10k" },
  { id: "10k-25k", label: "€10k–25k" },
  { id: "25k-50k", label: "€25k–50k" },
  { id: "50k-plus", label: "€50k+" },
] as const;

export type ContactBudgetId = (typeof CONTACT_BUDGET_BANDS)[number]["id"];

/** Single approved-safe careers path — no invented job titles. */
export const CONTACT_CAREERS_ROLES = [
  { id: "general-application", label: "General application" },
] as const;

export type ContactCareersRoleId =
  (typeof CONTACT_CAREERS_ROLES)[number]["id"];

export const CONTACT_FOOTER = {
  descriptor: "Digital product studio — design, engineering, and growth.",
  trayLinks: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
  ] as const,
  workCta: { href: "/portfolio", label: "View our work" },
} as const;

export const CONTACT_ASSETS = {
  /** Official GreenTech symbol — same mark used by services/header brand assets. */
  heroLogo: "/images/brand/logo-mark.png",
  heroLogoWidth: 1280,
  heroLogoHeight: 1280,
  footerWordmark: "/contact/contactFooterWordmark.svg",
  /** Foreground float uses the same brand mark (no mechanical SVG). */
  footerRender: "/images/brand/logo-mark.png",
  footerRenderWidth: 1280,
  footerRenderHeight: 1280,
} as const;

export function greetingPeriod(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function choiceGreeting(period: string): string {
  return `Hello! What would you like to create this ${period}?`;
}
