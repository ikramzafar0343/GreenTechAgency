import type {
  ContactBudgetId,
  ContactCareersRoleId,
  ContactChoiceId,
} from "@/features/contact/model/contactPageContent";

export type ContactScreen =
  | "choice"
  | "projectServices"
  | "projectBudget"
  | "projectDetails"
  | "careersRole"
  | "careersDetails"
  | "general"
  | "success"
  | "unavailable";

export type ProjectDraft = {
  serviceIds: string[];
  budgetId: ContactBudgetId | null;
  name: string;
  email: string;
  company: string;
  phone: string;
  description: string;
  website: string;
};

export type CareersDraft = {
  roleId: ContactCareersRoleId | null;
  name: string;
  email: string;
  portfolio: string;
  application: string;
  website: string;
};

export type GeneralDraft = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

export type ContactFlowState = {
  screen: ContactScreen;
  branch: ContactChoiceId | null;
  project: ProjectDraft;
  careers: CareersDraft;
  general: GeneralDraft;
  statusMessage: string | null;
  fieldErrors: Record<string, string>;
  submitting: boolean;
  servicesHint: boolean;
};

export const EMPTY_PROJECT_DRAFT: ProjectDraft = {
  serviceIds: [],
  budgetId: null,
  name: "",
  email: "",
  company: "",
  phone: "",
  description: "",
  website: "",
};

export const EMPTY_CAREERS_DRAFT: CareersDraft = {
  roleId: null,
  name: "",
  email: "",
  portfolio: "",
  application: "",
  website: "",
};

export const EMPTY_GENERAL_DRAFT: GeneralDraft = {
  name: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

export const INITIAL_CONTACT_FLOW: ContactFlowState = {
  screen: "choice",
  branch: null,
  project: EMPTY_PROJECT_DRAFT,
  careers: EMPTY_CAREERS_DRAFT,
  general: EMPTY_GENERAL_DRAFT,
  statusMessage: null,
  fieldErrors: {},
  submitting: false,
  servicesHint: false,
};

export type ContactFlowAction =
  | { type: "selectChoice"; choice: ContactChoiceId }
  | { type: "toggleService"; serviceId: string }
  | { type: "continueServices" }
  | { type: "selectBudget"; budgetId: ContactBudgetId }
  | { type: "selectRole"; roleId: ContactCareersRoleId }
  | { type: "patchProject"; patch: Partial<ProjectDraft> }
  | { type: "patchCareers"; patch: Partial<CareersDraft> }
  | { type: "patchGeneral"; patch: Partial<GeneralDraft> }
  | { type: "goBack" }
  | { type: "submitStart" }
  | {
      type: "submitResult";
      result:
        | { status: "success" }
        | { status: "unavailable"; message: string }
        | { status: "error"; message: string; fieldErrors?: Record<string, string> };
    }
  | { type: "returnToChoice" }
  | { type: "clearServicesHint" };

export function contactFlowReducer(
  state: ContactFlowState,
  action: ContactFlowAction,
): ContactFlowState {
  switch (action.type) {
    case "selectChoice": {
      if (action.choice === "project") {
        return {
          ...state,
          branch: "project",
          screen: "projectServices",
          statusMessage: null,
          fieldErrors: {},
          servicesHint: false,
        };
      }
      if (action.choice === "careers") {
        return {
          ...state,
          branch: "careers",
          screen: "careersRole",
          statusMessage: null,
          fieldErrors: {},
        };
      }
      return {
        ...state,
        branch: "general",
        screen: "general",
        statusMessage: null,
        fieldErrors: {},
      };
    }
    case "toggleService": {
      const set = new Set(state.project.serviceIds);
      if (set.has(action.serviceId)) {
        set.delete(action.serviceId);
      } else {
        set.add(action.serviceId);
      }
      return {
        ...state,
        project: { ...state.project, serviceIds: [...set] },
        servicesHint: false,
      };
    }
    case "continueServices": {
      if (state.project.serviceIds.length === 0) {
        return { ...state, servicesHint: true };
      }
      return {
        ...state,
        screen: "projectBudget",
        servicesHint: false,
      };
    }
    case "selectBudget": {
      return {
        ...state,
        project: { ...state.project, budgetId: action.budgetId },
        screen: "projectDetails",
        fieldErrors: {},
        statusMessage: null,
      };
    }
    case "selectRole": {
      return {
        ...state,
        careers: { ...state.careers, roleId: action.roleId },
        screen: "careersDetails",
        fieldErrors: {},
        statusMessage: null,
      };
    }
    case "patchProject":
      return {
        ...state,
        project: { ...state.project, ...action.patch },
      };
    case "patchCareers":
      return {
        ...state,
        careers: { ...state.careers, ...action.patch },
      };
    case "patchGeneral":
      return {
        ...state,
        general: { ...state.general, ...action.patch },
      };
    case "goBack": {
      switch (state.screen) {
        case "projectServices":
          return { ...state, screen: "choice", branch: null, servicesHint: false };
        case "projectBudget":
          return { ...state, screen: "projectServices" };
        case "projectDetails":
          return { ...state, screen: "projectBudget", fieldErrors: {}, statusMessage: null };
        case "careersRole":
          return { ...state, screen: "choice", branch: null };
        case "careersDetails":
          return { ...state, screen: "careersRole", fieldErrors: {}, statusMessage: null };
        case "general":
          return { ...state, screen: "choice", branch: null, fieldErrors: {}, statusMessage: null };
        case "success":
        case "unavailable":
          return {
            ...INITIAL_CONTACT_FLOW,
            project: state.project,
            careers: state.careers,
            general: state.general,
          };
        default:
          return state;
      }
    }
    case "submitStart":
      return { ...state, submitting: true, statusMessage: null, fieldErrors: {} };
    case "submitResult": {
      if (action.result.status === "success") {
        return {
          ...state,
          submitting: false,
          screen: "success",
          statusMessage: null,
          fieldErrors: {},
        };
      }
      if (action.result.status === "unavailable") {
        return {
          ...state,
          submitting: false,
          screen: "unavailable",
          statusMessage: action.result.message,
          fieldErrors: {},
        };
      }
      return {
        ...state,
        submitting: false,
        statusMessage: action.result.message,
        fieldErrors: action.result.fieldErrors ?? {},
      };
    }
    case "returnToChoice":
      return { ...INITIAL_CONTACT_FLOW };
    case "clearServicesHint":
      return { ...state, servicesHint: false };
    default:
      return state;
  }
}
