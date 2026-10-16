import { assertNonEmptyString, optionalString } from "../../content/slug.js";
import { AppError } from "../../http/errors.js";

export const ENQUIRY_KINDS = [
  "contact",
  "project",
  "careers",
  "general",
  "callback",
] as const;
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

export const ENQUIRY_STATUSES = ["new", "read", "archived", "spam"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EnquiryCreateInput = {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string | null;
  message: string;
  kind: EnquiryKind;
};

export function parseEnquiryKind(value: unknown): EnquiryKind {
  const kind =
    value === undefined || value === null || value === ""
      ? "contact"
      : String(value);
  if (!(ENQUIRY_KINDS as readonly string[]).includes(kind)) {
    throw new AppError("VALIDATION", `Invalid enquiry kind: ${kind}`);
  }
  return kind as EnquiryKind;
}

export function parseEnquiryStatus(value: unknown): EnquiryStatus {
  if (typeof value !== "string" || !(ENQUIRY_STATUSES as readonly string[]).includes(value)) {
    throw new AppError("VALIDATION", "Invalid enquiry status");
  }
  return value as EnquiryStatus;
}

export function parseEnquiryCreateBody(
  body: Record<string, unknown>,
): EnquiryCreateInput {
  const name = assertNonEmptyString(body.name, "name", 80);
  const emailRaw = assertNonEmptyString(body.email, "email", 160);
  if (!EMAIL_PATTERN.test(emailRaw)) {
    throw new AppError("VALIDATION", "Invalid email address");
  }
  const message = assertNonEmptyString(body.message, "message", 5000);
  return {
    name,
    email: emailRaw.toLowerCase(),
    company: optionalString(body.company, "company", 120),
    phone: optionalString(body.phone, "phone", 40),
    service: optionalString(body.service, "service", 120),
    message,
    kind: parseEnquiryKind(body.kind),
  };
}
