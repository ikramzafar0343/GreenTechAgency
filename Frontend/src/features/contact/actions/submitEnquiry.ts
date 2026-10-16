"use server";

import type {
  EnquirySubmitResult,
  EnquiryValues,
} from "@/features/contact/model/enquiryFields";
import { validateEnquiry } from "@/features/contact/model/validateEnquiry";
import { submitPublicContact } from "@/server/backend/submitPublicContact";

function readString(formData: FormData, key: keyof EnquiryValues): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitEnquiry(
  formData: FormData,
): Promise<EnquirySubmitResult> {
  const values: EnquiryValues = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    company: readString(formData, "company"),
    phone: readString(formData, "phone"),
    service: readString(formData, "service"),
    message: readString(formData, "message"),
    website: readString(formData, "website"),
  };

  if (values.website.trim()) {
    return { status: "success" };
  }

  const fieldErrors = validateEnquiry(values);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const result = await submitPublicContact({
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim() || null,
    phone: values.phone.trim() || null,
    service: values.service.trim() || null,
    message: values.message.trim(),
    kind: "contact",
    website: values.website,
  });

  if (result.status === "success") {
    return { status: "success" };
  }

  return {
    status: "error",
    message: result.message,
    ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
  };
}
