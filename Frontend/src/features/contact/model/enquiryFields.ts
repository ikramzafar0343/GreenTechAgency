export type EnquiryFieldName =
  | "name"
  | "email"
  | "company"
  | "phone"
  | "service"
  | "message"
  | "website";

export type EnquiryValues = Record<EnquiryFieldName, string>;

export type EnquiryFieldErrors = Partial<Record<EnquiryFieldName, string>>;

export type EnquirySubmitResult =
  | { status: "success" }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string; fieldErrors?: EnquiryFieldErrors };

export const EMPTY_ENQUIRY: EnquiryValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  message: "",
  website: "",
};

export const SERVICE_OPTIONS = [
  { value: "", label: "Select a service (optional)" },
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile App Development", label: "Mobile App Development" },
  { value: "Ecommerce Development", label: "Ecommerce Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "SEO & GEO", label: "SEO & GEO" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "AI Solutions", label: "AI Solutions" },
  { value: "Other", label: "Other / Not sure yet" },
] as const;
