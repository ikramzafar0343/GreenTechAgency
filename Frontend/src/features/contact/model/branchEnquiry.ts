import type {
  ContactBudgetId,
  ContactCareersRoleId,
} from "@/features/contact/model/contactPageContent";
import {
  CONTACT_BUDGET_BANDS,
  CONTACT_BUDGET_CURRENCY,
  CONTACT_CAREERS_ROLES,
} from "@/features/contact/model/contactPageContent";
import type {
  CareersDraft,
  GeneralDraft,
  ProjectDraft,
} from "@/features/contact/model/contactFlowState";

export type BranchEnquiryPayload =
  | {
      type: "project";
      serviceIds: string[];
      budgetId: ContactBudgetId;
      budgetCurrency: string;
      name: string;
      email: string;
      company: string;
      phone: string;
      description: string;
      website: string;
    }
  | {
      type: "careers";
      roleId: ContactCareersRoleId;
      name: string;
      email: string;
      portfolio: string;
      application: string;
      website: string;
    }
  | {
      type: "general";
      name: string;
      email: string;
      phone: string;
      message: string;
      website: string;
    };

export type BranchFieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/.+/i;

const BUDGET_ID_SET = new Set(CONTACT_BUDGET_BANDS.map((b) => b.id));
const ROLE_ID_SET = new Set(CONTACT_CAREERS_ROLES.map((r) => r.id));

function validateName(name: string, errors: BranchFieldErrors) {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    errors.name = "Please enter your name.";
  } else if (trimmed.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }
}

function validateEmail(email: string, errors: BranchFieldErrors) {
  const trimmed = email.trim();
  if (!trimmed) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_PATTERN.test(trimmed) || trimmed.length > 160) {
    errors.email = "Enter a valid email address.";
  }
}

export function validateProjectDraft(
  draft: ProjectDraft,
  serviceIds: ReadonlySet<string>,
): BranchFieldErrors {
  const errors: BranchFieldErrors = {};
  validateName(draft.name, errors);
  validateEmail(draft.email, errors);

  if (draft.company.trim().length > 120) {
    errors.company = "Company must be 120 characters or fewer.";
  }
  if (draft.phone.trim().length > 40) {
    errors.phone = "Phone must be 40 characters or fewer.";
  }

  const description = draft.description.trim();
  if (description.length < 10) {
    errors.description = "Tell us a little more about your project.";
  } else if (description.length > 2000) {
    errors.description = "Description must be 2000 characters or fewer.";
  }

  if (draft.serviceIds.length === 0) {
    errors.serviceIds = "Select at least one service.";
  } else if (draft.serviceIds.some((id) => !serviceIds.has(id))) {
    errors.serviceIds = "Choose a valid service.";
  }

  if (!draft.budgetId || !BUDGET_ID_SET.has(draft.budgetId)) {
    errors.budgetId = "Choose a budget range.";
  }

  return errors;
}

export function validateCareersDraft(draft: CareersDraft): BranchFieldErrors {
  const errors: BranchFieldErrors = {};
  validateName(draft.name, errors);
  validateEmail(draft.email, errors);

  if (!draft.roleId || !ROLE_ID_SET.has(draft.roleId)) {
    errors.roleId = "Choose a role.";
  }

  const portfolio = draft.portfolio.trim();
  if (portfolio && !URL_PATTERN.test(portfolio)) {
    errors.portfolio = "Enter a valid URL starting with http:// or https://.";
  } else if (portfolio.length > 300) {
    errors.portfolio = "Portfolio link must be 300 characters or fewer.";
  }

  const application = draft.application.trim();
  if (application.length < 10) {
    errors.application = "Tell us a little more about yourself.";
  } else if (application.length > 2000) {
    errors.application = "Application must be 2000 characters or fewer.";
  }

  return errors;
}

export function validateGeneralDraft(draft: GeneralDraft): BranchFieldErrors {
  const errors: BranchFieldErrors = {};
  validateName(draft.name, errors);
  validateEmail(draft.email, errors);

  if (draft.phone.trim().length > 40) {
    errors.phone = "Phone must be 40 characters or fewer.";
  }

  const message = draft.message.trim();
  if (message.length < 10) {
    errors.message = "Tell us a little more.";
  } else if (message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}

export function projectPayload(draft: ProjectDraft): BranchEnquiryPayload | null {
  if (!draft.budgetId) return null;
  return {
    type: "project",
    serviceIds: draft.serviceIds,
    budgetId: draft.budgetId,
    budgetCurrency: CONTACT_BUDGET_CURRENCY,
    name: draft.name.trim(),
    email: draft.email.trim(),
    company: draft.company.trim(),
    phone: draft.phone.trim(),
    description: draft.description.trim(),
    website: draft.website,
  };
}

export function careersPayload(draft: CareersDraft): BranchEnquiryPayload | null {
  if (!draft.roleId) return null;
  return {
    type: "careers",
    roleId: draft.roleId,
    name: draft.name.trim(),
    email: draft.email.trim(),
    portfolio: draft.portfolio.trim(),
    application: draft.application.trim(),
    website: draft.website,
  };
}

export function generalPayload(draft: GeneralDraft): BranchEnquiryPayload {
  return {
    type: "general",
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    message: draft.message.trim(),
    website: draft.website,
  };
}
