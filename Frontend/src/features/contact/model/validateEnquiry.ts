import type {
  EnquiryFieldErrors,
  EnquiryValues,
} from "@/features/contact/model/enquiryFields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnquiry(values: EnquiryValues): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2) {
    errors.name = "Please enter your name.";
  } else if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }

  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    errors.email = "Enter a valid email address.";
  }

  if (values.company.trim().length > 120) {
    errors.company = "Company must be 120 characters or fewer.";
  }

  if (values.phone.trim().length > 40) {
    errors.phone = "Phone must be 40 characters or fewer.";
  }

  if (message.length < 10) {
    errors.message = "Tell us a little more about your project.";
  } else if (message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}
