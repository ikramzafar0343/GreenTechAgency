"use server";

import type { InvoiceDocumentModel } from "@/components/invoices/InvoiceDocument";
import type { SalarySlipDocumentModel } from "@/components/salaries/SalarySlipDocument";
import {
  getStore,
  listServicePages,
  newId,
  nowStamp,
} from "./mockStore";
import { clearSession, setPortalSession } from "./session";
import type {
  Actor,
  AdminCallback,
  AdminContactMessage,
  AdminDomain,
  AdminDomainPayload,
  AdminEmployee,
  AdminFaq,
  AdminFile,
  AdminInvoice,
  AdminLead,
  AdminLeadFollowUp,
  AdminMessage,
  AdminPortfolioItem,
  AdminProject,
  AdminSale,
  AdminSalarySlip,
  AdminSalesMessage,
  AdminServicePageChild,
  AdminServicePageDetail,
  AdminServicePageListItem,
  AdminSiteGalleryImage,
  AdminSitePrinciple,
  AdminSiteTestimonial,
  AdminTeamMember,
  EmployeeCrmBootstrap,
  EmployeeDeliveryBootstrap,
  EmployeeDomain,
  LoginFieldErrors,
  LoginFormValues,
  SalarySlipPublic,
  SaleStatus,
  SessionRole,
  SiteContactPublic,
} from "./types";

export type FailReason = "unauthorized" | "conflict" | "validation" | "server";

type Fail = { readonly ok: false; readonly reason: FailReason; readonly message?: string };
type Ok = { readonly ok: true };
type OkData<T> = { readonly ok: true; readonly data: T };

function fail(reason: FailReason = "server", message?: string): Fail {
  return message ? { ok: false, reason, message } : { ok: false, reason };
}

export type AdminLoginSubmitResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly fieldErrors: LoginFieldErrors }
  | { readonly ok: false; readonly reason: "credentials" | "server" };

export type EmployeeLoginSubmitResult = AdminLoginSubmitResult;

export async function submitAdminLogin(
  values: LoginFormValues,
): Promise<AdminLoginSubmitResult> {
  if (!values.email.includes("@") || values.password.length < 1) {
    return {
      ok: false,
      fieldErrors: {
        email: values.email.includes("@") ? undefined : "Enter a valid email.",
        password: values.password.length > 0 ? undefined : "Password is required.",
      },
    };
  }
  await setPortalSession({
    role: "admin",
    email: values.email,
    name: "Owner Admin",
  });
  return { ok: true };
}

export async function submitEmployeeLogin(
  values: LoginFormValues,
): Promise<EmployeeLoginSubmitResult> {
  if (!values.email.includes("@") || values.password.length < 1) {
    return {
      ok: false,
      fieldErrors: {
        email: values.email.includes("@") ? undefined : "Enter a valid email.",
        password: values.password.length > 0 ? undefined : "Password is required.",
      },
    };
  }
  const kind = values.email.toLowerCase().includes("sales")
    ? "sales"
    : "delivery";
  await setPortalSession({
    role: "employee",
    email: values.email,
    name: kind === "sales" ? "Sam Chen" : "Alex Rivera",
    employeeKind: kind,
  });
  return { ok: true };
}

export async function submitSignOut(_role: SessionRole): Promise<void> {
  await clearSession();
}

export async function submitForgotPassword(_input: {
  readonly email: string;
}): Promise<{ readonly ok: true } | { readonly ok: false; readonly reason: "validation" | "server" }> {
  return { ok: true };
}

export async function loadAdminDomainAction(
  domain: AdminDomain,
): Promise<AdminDomainPayload> {
  const { state } = getStore();
  switch (domain) {
    case "overview":
    case "cms-catalog":
      return {
        domain,
        services: state.services,
        portfolio: state.portfolio,
        blog: state.blog,
        faqs: state.faqs,
      };
    case "cms-team":
      return { domain, team: state.team };
    case "cms-site":
      return {
        domain,
        siteGallery: state.siteGallery,
        siteTestimonials: state.siteTestimonials,
        sitePrinciples: state.sitePrinciples,
      };
    case "contact":
      return { domain, contactMessages: state.contactMessages };
    case "callbacks":
      return { domain, callbacks: state.callbacks };
    case "ops":
      return {
        domain,
        clients: state.clients,
        projects: state.projects,
        invoices: state.invoices,
        salarySlips: state.salarySlips,
        messages: state.messages,
        files: state.files,
        employees: state.employees,
      };
    case "employees":
      return { domain, employees: state.employees };
    case "crm-sales":
      return { domain, sales: state.sales, employees: state.employees };
    case "crm-leads":
      return {
        domain,
        leads: state.leads,
        employees: state.employees,
        leadFollowUps: state.leadFollowUps,
      };
    default:
      return { domain };
  }
}

export async function loadEmployeeDomainAction(
  domain: EmployeeDomain,
): Promise<EmployeeCrmBootstrap | EmployeeDeliveryBootstrap> {
  const { state } = getStore();
  const employee = state.employees[0] ?? {
    id: "emp-delivery-1",
    name: "Alex Rivera",
    email: "employee@example.com",
    role: "Delivery",
    department: "Delivery",
    kind: "delivery" as const,
    image: "",
    version: 1,
    active: true,
    teamMemberId: null,
    updatedAt: nowStamp(),
  };
  if (domain === "crm") {
    return {
      employee: state.employees.find((item) => item.kind === "sales") ?? employee,
      sales: state.sales,
      leads: state.leads,
      leadFollowUps: state.leadFollowUps,
      salesMessages: state.salesMessages,
      salesPeers: state.employees.filter((item) => item.kind === "sales"),
    };
  }
  return {
    employee: state.employees.find((item) => item.kind === "delivery") ?? employee,
    clients: state.clients,
    projects: state.projects,
    messages: state.messages,
    files: state.files,
  };
}

export async function loadEmployeeSelf(
  _actor: Actor,
  employeeId: string,
): Promise<AdminEmployee> {
  const found = getStore().state.employees.find((item) => item.id === employeeId);
  if (found) {
    return found;
  }
  return getStore().state.employees[0]!;
}

export async function getAdminSiteContactAction(): Promise<
  | { readonly ok: true; readonly data: SiteContactPublic }
  | Fail
> {
  return { ok: true, data: getStore().siteContact };
}

export async function updateAdminSiteContactAction(input: {
  readonly version: number;
  readonly email: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly addressLabel: string;
  readonly addressLine1: string;
  readonly addressLine2: string;
  readonly addressLine3: string;
  readonly locationLede: string;
  readonly mapEmbedUrl: string;
  readonly socialLinkedinUrl: string;
  readonly socialInstagramUrl: string;
  readonly socialFacebookUrl: string;
  readonly socialXUrl: string;
}): Promise<{ readonly ok: true; readonly data: SiteContactPublic } | Fail> {
  const store = getStore();
  store.siteContact = {
    ...store.siteContact,
    email: input.email,
    phone: input.phone,
    phoneHref: input.phoneHref,
    addressLabel: input.addressLabel,
    addressLines: [input.addressLine1, input.addressLine2, input.addressLine3].filter(
      (line) => line.length > 0,
    ),
    locationLede: input.locationLede,
    mapEmbedUrl: input.mapEmbedUrl,
    socialLinkedinUrl: input.socialLinkedinUrl,
    socialInstagramUrl: input.socialInstagramUrl,
    socialFacebookUrl: input.socialFacebookUrl,
    socialXUrl: input.socialXUrl,
    version: input.version + 1,
    updatedAt: new Date().toISOString(),
  };
  return { ok: true, data: store.siteContact };
}

export async function uploadCmsMediaAction(
  _formData: FormData,
): Promise<{ readonly ok: true; readonly imagePath: string } | Fail> {
  return { ok: true, imagePath: "/portal/logo.png" };
}

export async function getAdminMeAction(): Promise<
  | {
      readonly ok: true;
      readonly profile: {
        readonly id: string;
        readonly version: number;
        readonly name: string;
        readonly email: string;
        readonly title: string | null;
        readonly role: string;
        readonly imagePath: string;
      };
    }
  | Fail
> {
  return { ok: true, profile: getStore().profile };
}

export async function updateAdminAccountAction(input: {
  readonly userId: string;
  readonly version: number;
  readonly name: string;
  readonly email: string;
  readonly title: string;
}): Promise<
  | {
      readonly ok: true;
      readonly account: {
        readonly version: number;
        readonly name: string;
        readonly email: string;
        readonly title: string | null;
        readonly imagePath: string;
      };
    }
  | Fail
> {
  const store = getStore();
  store.profile = {
    ...store.profile,
    name: input.name,
    email: input.email,
    title: input.title,
    version: input.version + 1,
  };
  return {
    ok: true,
    account: {
      version: store.profile.version,
      name: store.profile.name,
      email: store.profile.email,
      title: store.profile.title,
      imagePath: store.profile.imagePath,
    },
  };
}

export async function updateAdminMeImageAction(input: {
  readonly imagePath: string;
}): Promise<Ok | Fail> {
  getStore().profile.imagePath = input.imagePath;
  return { ok: true };
}

export async function changeAdminPasswordAction(_input: {
  readonly currentPassword: string;
  readonly nextPassword: string;
}): Promise<Ok | Fail> {
  return { ok: true };
}

function replaceList<T extends { id: string }>(
  items: readonly T[],
  next: T,
): T[] {
  return items.map((item) => (item.id === next.id ? next : item));
}

export async function getSalarySlipAction(
  id: string,
): Promise<OkData<SalarySlipPublic> | Fail> {
  const detail = getStore().salaryDetails[id];
  if (!detail) {
    return fail("server");
  }
  return { ok: true, data: detail };
}

export async function createSalarySlipAction(input: {
  readonly employeeId: string | null;
  readonly employeeName: string;
  readonly designation?: string;
  readonly slipDate: string;
  readonly salaryMonth: string;
  readonly basicSalary: string;
  readonly punctuality: string;
  readonly medicalAllowance: string;
  readonly incentives: string;
  readonly bonus: string;
  readonly advance: string;
  readonly incomeTax: string;
  readonly whTax: string;
  readonly fuelAdvances: string;
  readonly unpaidDays: string;
  readonly currency?: string;
  readonly statusCode?: "draft" | "issued";
  readonly fromCompany: string;
  readonly fromEmail: string;
  readonly fromPhone: string;
}): Promise<OkData<AdminSalarySlip> | Fail> {
  const earnings =
    Number(input.basicSalary) +
    Number(input.punctuality) +
    Number(input.medicalAllowance) +
    Number(input.incentives) +
    Number(input.bonus);
  const deduction =
    Number(input.advance) +
    Number(input.incomeTax) +
    Number(input.whTax) +
    Number(input.fuelAdvances) +
    Number(input.unpaidDays);
  const id = newId("slip");
  const detail: SalarySlipPublic = {
    id,
    employeeId: input.employeeId,
    employeeName: input.employeeName,
    designation: input.designation ?? "",
    slipDate: input.slipDate,
    salaryMonth: input.salaryMonth,
    basicSalary: input.basicSalary,
    punctuality: input.punctuality,
    medicalAllowance: input.medicalAllowance,
    incentives: input.incentives,
    bonus: input.bonus,
    advance: input.advance,
    incomeTax: input.incomeTax,
    whTax: input.whTax,
    fuelAdvances: input.fuelAdvances,
    unpaidDays: input.unpaidDays,
    totalEarnings: earnings.toFixed(2),
    totalDeduction: deduction.toFixed(2),
    netSalary: (earnings - deduction).toFixed(2),
    currency: input.currency ?? "PKR",
    status: input.statusCode ?? "draft",
    statusCode: input.statusCode ?? "draft",
    fromCompany: input.fromCompany,
    fromEmail: input.fromEmail,
    fromPhone: input.fromPhone,
    version: 1,
    updatedAt: nowStamp(),
  };
  const store = getStore();
  store.salaryDetails[id] = detail;
  const listItem: AdminSalarySlip = {
    id,
    employeeId: detail.employeeId,
    employeeName: detail.employeeName,
    designation: detail.designation,
    slipDate: detail.slipDate,
    salaryMonth: detail.salaryMonth,
    netSalary: detail.netSalary,
    currency: detail.currency,
    status: detail.status,
    version: 1,
    updatedAt: detail.updatedAt,
  };
  store.state = { ...store.state, salarySlips: [listItem, ...store.state.salarySlips] };
  return { ok: true, data: listItem };
}

export async function updateSalarySlipAction(input: {
  readonly id: string;
  readonly version: number;
  readonly employeeName: string;
  readonly designation: string;
  readonly slipDate: string;
  readonly salaryMonth: string;
  readonly basicSalary: string;
  readonly punctuality: string;
  readonly medicalAllowance: string;
  readonly incentives: string;
  readonly bonus: string;
  readonly advance: string;
  readonly incomeTax: string;
  readonly whTax: string;
  readonly fuelAdvances: string;
  readonly unpaidDays: string;
  readonly currency: string;
  readonly statusCode: "draft" | "issued";
  readonly fromCompany: string;
  readonly fromEmail: string;
  readonly fromPhone: string;
}): Promise<OkData<AdminSalarySlip> | Fail> {
  const store = getStore();
  const existing = store.salaryDetails[input.id];
  if (!existing) {
    return fail("server");
  }
  const earnings =
    Number(input.basicSalary) +
    Number(input.punctuality) +
    Number(input.medicalAllowance) +
    Number(input.incentives) +
    Number(input.bonus);
  const deduction =
    Number(input.advance) +
    Number(input.incomeTax) +
    Number(input.whTax) +
    Number(input.fuelAdvances) +
    Number(input.unpaidDays);
  const detail: SalarySlipPublic = {
    ...existing,
    ...input,
    status: input.statusCode,
    totalEarnings: earnings.toFixed(2),
    totalDeduction: deduction.toFixed(2),
    netSalary: (earnings - deduction).toFixed(2),
    version: input.version + 1,
    updatedAt: nowStamp(),
  };
  store.salaryDetails[input.id] = detail;
  const listItem: AdminSalarySlip = {
    id: detail.id,
    employeeId: detail.employeeId,
    employeeName: detail.employeeName,
    designation: detail.designation,
    slipDate: detail.slipDate,
    salaryMonth: detail.salaryMonth,
    netSalary: detail.netSalary,
    currency: detail.currency,
    status: detail.status,
    version: detail.version,
    updatedAt: detail.updatedAt,
  };
  store.state = {
    ...store.state,
    salarySlips: replaceList(store.state.salarySlips, listItem),
  };
  return { ok: true, data: listItem };
}

export async function archiveSalarySlipAction(_input: {
  readonly id: string;
  readonly version: number;
}): Promise<Ok | Fail> {
  const store = getStore();
  store.state = {
    ...store.state,
    salarySlips: store.state.salarySlips.filter((item) => item.id !== _input.id),
  };
  delete store.salaryDetails[_input.id];
  return { ok: true };
}

export async function createInvoiceAction(input: {
  readonly clientId: string | null;
  readonly number: string;
  readonly title: string;
  readonly amount: string;
  readonly currency: string;
  readonly billToCompany: string;
  readonly billToName: string;
  readonly billToEmail: string;
  readonly billToPhone: string;
  readonly billToLocation: string;
  readonly fromCompany: string;
  readonly fromEmail: string;
  readonly fromPhone: string;
  readonly statusCode: "draft" | "sent" | "paid";
  readonly issuedOn: string | null;
  readonly dueDate: string | null;
  readonly lineItems: readonly {
    readonly description: string;
    readonly amount: string;
    readonly sortOrder: number;
  }[];
}): Promise<OkData<AdminInvoice> | Fail> {
  const invoice: AdminInvoice = {
    id: newId("inv"),
    clientId: input.clientId,
    number: input.number,
    title: input.title,
    amount: input.amount,
    currency: input.currency,
    billToCompany: input.billToCompany,
    billToName: input.billToName,
    billToEmail: input.billToEmail,
    billToPhone: input.billToPhone,
    billToLocation: input.billToLocation,
    fromCompany: input.fromCompany,
    fromEmail: input.fromEmail,
    fromPhone: input.fromPhone,
    status: input.statusCode,
    issuedOn: input.issuedOn,
    dueDate: input.dueDate,
    lineItems: input.lineItems.map((line, index) => ({
      id: newId("line"),
      description: line.description,
      amount: line.amount,
      sortOrder: line.sortOrder ?? index,
    })),
    version: 1,
    updatedAt: nowStamp(),
  };
  const store = getStore();
  store.state = { ...store.state, invoices: [invoice, ...store.state.invoices] };
  return { ok: true, data: invoice };
}

export async function updateInvoiceAction(input: {
  readonly id: string;
  readonly version: number;
  readonly clientId: string | null;
  readonly number: string;
  readonly title: string;
  readonly amount: string;
  readonly currency: string;
  readonly billToCompany: string;
  readonly billToName: string;
  readonly billToEmail: string;
  readonly billToPhone: string;
  readonly billToLocation: string;
  readonly fromCompany: string;
  readonly fromEmail: string;
  readonly fromPhone: string;
  readonly statusCode: "draft" | "sent" | "paid";
  readonly issuedOn: string | null;
  readonly dueDate: string | null;
  readonly lineItems: readonly {
    readonly id?: string;
    readonly description: string;
    readonly amount: string;
    readonly sortOrder: number;
  }[];
}): Promise<OkData<AdminInvoice> | Fail> {
  const store = getStore();
  const existing = store.state.invoices.find((item) => item.id === input.id);
  if (!existing) {
    return fail("server");
  }
  const invoice: AdminInvoice = {
    ...existing,
    ...input,
    status: input.statusCode,
    lineItems: input.lineItems.map((line, index) => ({
      id: line.id ?? newId("line"),
      description: line.description,
      amount: line.amount,
      sortOrder: line.sortOrder ?? index,
    })),
    version: input.version + 1,
    updatedAt: nowStamp(),
  };
  store.state = {
    ...store.state,
    invoices: replaceList(store.state.invoices, invoice),
  };
  return { ok: true, data: invoice };
}

export async function archiveInvoiceAction(input: {
  readonly id: string;
  readonly version: number;
}): Promise<Ok | Fail> {
  const store = getStore();
  store.state = {
    ...store.state,
    invoices: store.state.invoices.filter((item) => item.id !== input.id),
  };
  return { ok: true };
}

export async function createProjectAction(input: {
  readonly clientId: string;
  readonly serviceId: string;
  readonly title: string;
  readonly notes?: string;
}): Promise<OkData<AdminProject> | Fail> {
  const project: AdminProject = {
    id: newId("proj"),
    clientId: input.clientId,
    title: input.title,
    service: input.serviceId,
    status: "requested",
    notes: input.notes ?? "",
    version: 1,
    updatedAt: nowStamp(),
  };
  const store = getStore();
  store.state = { ...store.state, projects: [project, ...store.state.projects] };
  return { ok: true, data: project };
}

export async function changeProjectStatusAction(input: {
  readonly id: string;
  readonly version: number;
  readonly statusCode: AdminProject["status"];
}): Promise<OkData<AdminProject> | Fail> {
  const store = getStore();
  const existing = store.state.projects.find((item) => item.id === input.id);
  if (!existing) {
    return fail("server");
  }
  const next = {
    ...existing,
    status: input.statusCode,
    version: input.version + 1,
    updatedAt: nowStamp(),
  };
  store.state = { ...store.state, projects: replaceList(store.state.projects, next) };
  return { ok: true, data: next };
}

export async function putAssignmentsAction(input: {
  readonly clientId: string;
  readonly employeeIds: readonly string[];
}): Promise<Ok | Fail> {
  const store = getStore();
  store.state = {
    ...store.state,
    clients: store.state.clients.map((client) =>
      client.id === input.clientId
        ? { ...client, assignedEmployeeIds: [...input.employeeIds] }
        : client,
    ),
  };
  return { ok: true };
}

export async function createMessageAction(input: {
  readonly clientId: string;
  readonly body: string;
}): Promise<OkData<AdminMessage> | Fail> {
  const message: AdminMessage = {
    id: newId("msg"),
    clientId: input.clientId,
    from: "admin",
    body: input.body,
    at: nowStamp(),
    createdAt: new Date().toISOString(),
    read: true,
    attachments: [],
  };
  const store = getStore();
  store.state = { ...store.state, messages: [...store.state.messages, message] };
  return { ok: true, data: message };
}

export async function archiveFileAction(input: {
  readonly id: string;
}): Promise<Ok | Fail> {
  const store = getStore();
  store.state = {
    ...store.state,
    files: store.state.files.filter((item) => item.id !== input.id),
  };
  return { ok: true };
}

export async function uploadFileAction(
  formData: FormData,
): Promise<OkData<AdminFile> | Fail> {
  const clientId = String(formData.get("clientId") ?? "");
  const name = String(formData.get("name") ?? "file");
  const file: AdminFile = {
    id: newId("file"),
    clientId,
    name,
    kind: "upload",
    url: null,
    updatedAt: nowStamp(),
  };
  const store = getStore();
  store.state = { ...store.state, files: [file, ...store.state.files] };
  return { ok: true, data: file };
}

export async function updateAdminClientContactAction(input: {
  readonly id: string;
  readonly version: number;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly phone: string;
  readonly location: string;
  readonly clientContactTitle: string;
}): Promise<{ readonly ok: true; readonly client: AdminClient } | Fail> {
  const store = getStore();
  const existing = store.state.clients.find((item) => item.id === input.id);
  if (!existing) {
    return fail("server");
  }
  const client = {
    ...existing,
    ...input,
    version: input.version + 1,
    updatedAt: nowStamp(),
  };
  store.state = { ...store.state, clients: replaceList(store.state.clients, client) };
  return { ok: true, client };
}

export async function archiveAdminClientAction(_input: {
  readonly id: string;
  readonly version: number;
}): Promise<Ok | Fail> {
  const store = getStore();
  store.state = {
    ...store.state,
    clients: store.state.clients.filter((item) => item.id !== _input.id),
  };
  return { ok: true };
}

export type AdminServicePageActionResult =
  | { readonly ok: true; readonly page: AdminServicePageDetail }
  | { readonly ok: true; readonly child: AdminServicePageChild }
  | { readonly ok: true; readonly items: readonly AdminServicePageListItem[] }
  | { readonly ok: true }
  | Fail;

export async function listAdminServicePagesAction(): Promise<AdminServicePageActionResult> {
  return { ok: true, items: listServicePages() };
}

export async function getAdminServicePageBySlugAction(
  slug: string,
): Promise<AdminServicePageActionResult> {
  const page = getStore().servicePages[slug];
  if (!page) {
    return fail("server");
  }
  return { ok: true, page };
}

export async function updateAdminServicePageAction(
  input: AdminServicePageDetail & { readonly id: string; readonly version: number },
): Promise<AdminServicePageActionResult> {
  const store = getStore();
  const next = {
    ...input,
    version: input.version + 1,
    updatedAt: new Date().toISOString(),
  };
  store.servicePages[input.slug] = next;
  return { ok: true, page: next };
}

export async function archiveAdminServicePageAction(_input: {
  readonly id: string;
  readonly version: number;
  readonly slug: string;
}): Promise<AdminServicePageActionResult> {
  delete getStore().servicePages[_input.slug];
  return { ok: true };
}

export async function restoreAdminServicePageAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function createAdminServicePageChildAction(_input: {
  readonly collection: string;
  readonly servicePageId: string;
  readonly slug: string;
  readonly payload: Record<string, unknown>;
}): Promise<AdminServicePageActionResult> {
  const child = {
    id: newId("child"),
    title: String(_input.payload.title ?? "Item"),
    description: String(_input.payload.description ?? ""),
    ctaLabel: "",
    ctaHref: "",
    imagePath: "",
    sortOrder: 0,
    active: true,
    version: 1,
    publishedAt: new Date().toISOString(),
  };
  return { ok: true, child };
}

export async function updateAdminServicePageChildAction(_input: {
  readonly collection: string;
  readonly servicePageId: string;
  readonly childId: string;
  readonly slug: string;
  readonly payload: Record<string, unknown>;
}): Promise<AdminServicePageActionResult> {
  return createAdminServicePageChildAction(_input);
}

export async function archiveAdminServicePageChildAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function restoreAdminServicePageChildAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function reorderAdminServicePageChildrenAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

type NamedResult<K extends string, T> =
  | ({ readonly ok: true } & Record<K, T>)
  | Fail;

export async function createAdminBlogPostAction(input: Record<string, unknown>) {
  return { ok: true as const, post: { id: newId("blog"), ...input, version: 1, updatedAt: nowStamp(), active: true, publishedAt: null } };
}
export async function updateAdminBlogPostAction(input: Record<string, unknown>) {
  return createAdminBlogPostAction(input);
}
export async function archiveAdminBlogPostAction(_input: unknown) {
  return { ok: true as const };
}
export async function getAdminBlogPostAction(input: { readonly id: string }) {
  const post = getStore().state.blog.find((item) => item.id === input.id);
  return post ? { ok: true as const, post } : fail();
}

export async function createAdminPortfolioAction(input: Record<string, unknown>) {
  return { ok: true as const, item: { id: newId("port"), ...input, version: 1, updatedAt: nowStamp() } };
}
export async function updateAdminPortfolioAction(input: Record<string, unknown>) {
  return createAdminPortfolioAction(input);
}
export async function archiveAdminPortfolioAction(_input: unknown) {
  return { ok: true as const };
}

export async function createAdminFaqAction(input: Record<string, unknown>) {
  const faq: AdminFaq = {
    id: newId("faq"),
    question: String(input.question ?? ""),
    answer: String(input.answer ?? ""),
    sortOrder: Number(input.sortOrder ?? 0),
    active: Boolean(input.active ?? true),
    version: 1,
    publishedAt: new Date().toISOString(),
    updatedAt: nowStamp(),
  };
  const store = getStore();
  store.state = { ...store.state, faqs: [...store.state.faqs, faq] };
  return { ok: true as const, faq };
}
export async function updateAdminFaqAction(input: Record<string, unknown> & { id: string }) {
  return createAdminFaqAction(input);
}
export async function archiveAdminFaqAction(input: { id: string }) {
  const store = getStore();
  store.state = { ...store.state, faqs: store.state.faqs.filter((item) => item.id !== input.id) };
  return { ok: true as const };
}
export async function reorderAdminFaqAction(_input: unknown) {
  return { ok: true as const };
}

export async function createAdminTeamMemberAction(input: Record<string, unknown>) {
  const member = {
    id: newId("team"),
    name: String(input.name ?? ""),
    role: String(input.role ?? ""),
    bio: String(input.bio ?? ""),
    image: String(input.image ?? ""),
    active: true,
    employeeId: null,
    sortOrder: 0,
    version: 1,
    publishedAt: new Date().toISOString(),
    socials: [],
    updatedAt: nowStamp(),
  } satisfies AdminTeamMember;
  return { ok: true as const, member };
}
export async function updateAdminTeamMemberAction(input: Record<string, unknown>) {
  return createAdminTeamMemberAction(input);
}
export async function archiveAdminTeamMemberAction(_input: unknown) {
  return { ok: true as const };
}
export async function reorderAdminTeamMemberAction(_input: unknown) {
  return { ok: true as const };
}

export async function createAdminEmployeeAction(input: Record<string, unknown>) {
  const employee: AdminEmployee = {
    id: newId("emp"),
    name: String(input.name ?? ""),
    email: String(input.email ?? ""),
    role: String(input.role ?? ""),
    department: String(input.department ?? ""),
    kind: (input.kind as AdminEmployee["kind"]) ?? "delivery",
    image: String(input.image ?? ""),
    version: 1,
    active: true,
    teamMemberId: null,
    updatedAt: nowStamp(),
  };
  const store = getStore();
  store.state = { ...store.state, employees: [employee, ...store.state.employees] };
  return { ok: true as const, employee };
}
export async function updateAdminEmployeeAction(input: Record<string, unknown> & { id: string }) {
  return createAdminEmployeeAction(input);
}
export async function setAdminEmployeePasswordAction(_input: unknown) {
  return { ok: true as const };
}
export async function archiveAdminEmployeeAction(input: { id: string }) {
  const store = getStore();
  store.state = {
    ...store.state,
    employees: store.state.employees.filter((item) => item.id !== input.id),
  };
  return { ok: true as const };
}

export async function createAdminSiteGalleryImageAction(input: {
  readonly sectionKey: AdminSiteGalleryImage["sectionKey"];
  readonly image: string;
  readonly altText: string;
  readonly sortOrder: number;
  readonly active: boolean;
}): Promise<NamedResult<"galleryImage", AdminSiteGalleryImage>> {
  const galleryImage: AdminSiteGalleryImage = {
    id: newId("gal"),
    ...input,
    version: 1,
    publishedAt: input.active ? new Date().toISOString() : null,
    updatedAt: nowStamp(),
  };
  const store = getStore();
  store.state = { ...store.state, siteGallery: [...store.state.siteGallery, galleryImage] };
  return { ok: true, galleryImage };
}
export async function updateAdminSiteGalleryImageAction(
  input: AdminSiteGalleryImage,
): Promise<NamedResult<"galleryImage", AdminSiteGalleryImage>> {
  return { ok: true, galleryImage: { ...input, version: input.version + 1 } };
}
export async function archiveAdminSiteGalleryImageAction(input: { id: string }) {
  const store = getStore();
  store.state = {
    ...store.state,
    siteGallery: store.state.siteGallery.filter((item) => item.id !== input.id),
  };
  return { ok: true as const };
}
export async function reorderAdminSiteGalleryImagesAction(_items: unknown) {
  return { ok: true as const };
}

export async function createAdminSiteTestimonialAction(input: Record<string, unknown>) {
  const testimonial = { id: newId("tst"), ...input, version: 1, updatedAt: nowStamp() } as AdminSiteTestimonial;
  return { ok: true as const, testimonial };
}
export async function updateAdminSiteTestimonialAction(input: Record<string, unknown>) {
  return createAdminSiteTestimonialAction(input);
}
export async function archiveAdminSiteTestimonialAction(_input: unknown) {
  return { ok: true as const };
}
export async function reorderAdminSiteTestimonialsAction(_input: unknown) {
  return { ok: true as const };
}

export async function createAdminSitePrincipleAction(input: Record<string, unknown>) {
  const principle = { id: newId("prn"), ...input, version: 1, updatedAt: nowStamp() } as AdminSitePrinciple;
  return { ok: true as const, principle };
}
export async function updateAdminSitePrincipleAction(input: Record<string, unknown>) {
  return createAdminSitePrincipleAction(input);
}
export async function archiveAdminSitePrincipleAction(_input: unknown) {
  return { ok: true as const };
}
export async function reorderAdminSitePrinciplesAction(_input: unknown) {
  return { ok: true as const };
}

export async function markAdminContactMessageReadAction(input: { id: string }) {
  const store = getStore();
  const message = store.state.contactMessages.find((item) => item.id === input.id);
  if (!message) {
    return fail();
  }
  const next: AdminContactMessage = { ...message, status: "read" };
  store.state = {
    ...store.state,
    contactMessages: replaceList(store.state.contactMessages, next),
  };
  return { ok: true as const, message: next };
}
export async function deleteAdminContactMessageAction(input: { id: string }) {
  const store = getStore();
  store.state = {
    ...store.state,
    contactMessages: store.state.contactMessages.filter((item) => item.id !== input.id),
  };
  return { ok: true as const };
}

export async function resolveAdminCallbackAction(input: { id: string }) {
  const store = getStore();
  const found = store.state.callbacks.find((item) => item.id === input.id);
  if (!found) {
    return fail();
  }
  const callback: AdminCallback = { ...found, status: "resolved" };
  store.state = { ...store.state, callbacks: replaceList(store.state.callbacks, callback) };
  return { ok: true as const, callback };
}
export async function deleteAdminCallbackAction(input: { id: string }) {
  const store = getStore();
  store.state = {
    ...store.state,
    callbacks: store.state.callbacks.filter((item) => item.id !== input.id),
  };
  return { ok: true as const };
}

export async function createSaleSheetAction(input: Record<string, unknown>) {
  const sale = { id: newId("sale"), ...input, version: 1, updatedAt: nowStamp() } as AdminSale;
  const store = getStore();
  store.state = { ...store.state, sales: [sale, ...store.state.sales] };
  return { ok: true as const, data: sale };
}
export async function updateSaleSheetAction(input: Record<string, unknown> & { id: string }) {
  return createSaleSheetAction(input);
}
export async function archiveSaleAction(input: { id: string }) {
  const store = getStore();
  store.state = { ...store.state, sales: store.state.sales.filter((item) => item.id !== input.id) };
  return { ok: true as const };
}
export async function changeSaleStatusAction(input: { id: string; statusCode: SaleStatus }) {
  const store = getStore();
  const existing = store.state.sales.find((item) => item.id === input.id);
  if (!existing) {
    return fail();
  }
  const data = { ...existing, status: input.statusCode };
  store.state = { ...store.state, sales: replaceList(store.state.sales, data) };
  return { ok: true as const, data };
}
export async function createLeadAction(input: Record<string, unknown>) {
  const lead = { id: newId("lead"), ...input, version: 1, updatedAt: nowStamp() } as AdminLead;
  const store = getStore();
  store.state = { ...store.state, leads: [lead, ...store.state.leads] };
  return { ok: true as const, data: lead };
}
export async function updateLeadAction(input: Record<string, unknown>) {
  return createLeadAction(input);
}
export async function archiveLeadAction(input: { id: string }) {
  const store = getStore();
  store.state = { ...store.state, leads: store.state.leads.filter((item) => item.id !== input.id) };
  return { ok: true as const };
}
export async function changeLeadStatusAction(input: { id: string; statusCode: AdminLead["status"] }) {
  const store = getStore();
  const existing = store.state.leads.find((item) => item.id === input.id);
  if (!existing) {
    return fail();
  }
  const data = { ...existing, status: input.statusCode };
  store.state = { ...store.state, leads: replaceList(store.state.leads, data) };
  return { ok: true as const, data };
}
export async function createLeadFollowUpAction(input: Record<string, unknown>) {
  const followUp = { id: newId("fu"), ...input } as AdminLeadFollowUp;
  const store = getStore();
  store.state = { ...store.state, leadFollowUps: [...store.state.leadFollowUps, followUp] };
  return { ok: true as const, data: followUp };
}
export async function updateLeadFollowUpAction(input: Record<string, unknown>) {
  return createLeadFollowUpAction(input);
}
export async function deleteLeadFollowUpAction(input: { id: string }) {
  const store = getStore();
  store.state = {
    ...store.state,
    leadFollowUps: store.state.leadFollowUps.filter((item) => item.id !== input.id),
  };
  return { ok: true as const };
}
export async function createSalesMessageAction(input: Record<string, unknown>) {
  const data = {
    id: newId("smsg"),
    fromRepId: String(input.fromRepId ?? ""),
    toRepId: String(input.toRepId ?? ""),
    body: String(input.body ?? ""),
    at: nowStamp(),
    read: false,
  } satisfies AdminSalesMessage;
  const store = getStore();
  store.state = { ...store.state, salesMessages: [...store.state.salesMessages, data] };
  return { ok: true as const, data };
}
export async function markSalesMessageReadAction(input: { id: string }) {
  const store = getStore();
  const existing = store.state.salesMessages.find((item) => item.id === input.id);
  if (!existing) {
    return fail();
  }
  const data = { ...existing, read: true };
  store.state = { ...store.state, salesMessages: replaceList(store.state.salesMessages, data) };
  return { ok: true as const, data };
}
export async function deleteSalesMessageAction(input: { id: string }) {
  const store = getStore();
  store.state = {
    ...store.state,
    salesMessages: store.state.salesMessages.filter((item) => item.id !== input.id),
  };
  return { ok: true as const };
}
export async function revealCarrierTaxIdAction(_input: { carrierId: string }) {
  return { ok: true as const, data: { taxId: "12-3456789" } };
}

export async function updateProjectNotesAction(input: {
  readonly id: string;
  readonly notes: string;
  readonly version: number;
}) {
  return changeProjectStatusAction({
    id: input.id,
    version: input.version,
    statusCode: "in_progress",
  });
}
export async function changeDeliveryProjectStatusAction(input: {
  readonly id: string;
  readonly version: number;
  readonly statusCode: AdminProject["status"];
}) {
  return changeProjectStatusAction(input);
}
export async function createDeliveryMessageAction(input: {
  readonly clientId: string;
  readonly body: string;
}) {
  return createMessageAction(input);
}
export async function markDeliveryMessageReadAction(_input: { id: string }) {
  return { ok: true as const };
}
export async function uploadDeliveryFileAction(formData: FormData) {
  return uploadFileAction(formData);
}
export async function archiveDeliveryFileAction(input: { id: string }) {
  return archiveFileAction(input);
}
export async function updateDeliveryUserSelfAction(_input: unknown) {
  return { ok: true as const };
}
export async function changeDeliveryPasswordAction(_input: unknown) {
  return { ok: true as const };
}
export async function updateEmployeeSelfImageAction(input: { imagePath: string }) {
  const store = getStore();
  if (store.state.employees[0]) {
    store.state = {
      ...store.state,
      employees: store.state.employees.map((item, index) =>
        index === 0 ? { ...item, image: input.imagePath } : item,
      ),
    };
  }
  return { ok: true as const };
}

export async function loadInvoiceDocument(
  _actor: Actor,
  invoiceId: string,
): Promise<InvoiceDocumentModel | null> {
  const invoice = getStore().state.invoices.find((item) => item.id === invoiceId);
  if (!invoice) {
    return null;
  }
  const contact = getStore().siteContact;
  return {
    number: invoice.number,
    title: invoice.title,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.status,
    issuedOn: invoice.issuedOn,
    dueDate: invoice.dueDate,
    createdAt: new Date().toISOString(),
    lineItems: invoice.lineItems.map((line) => ({
      description: line.description,
      amount: line.amount,
    })),
    company: {
      legalName: invoice.fromCompany,
      email: invoice.fromEmail,
      phone: invoice.fromPhone,
    },
    client: {
      company: invoice.billToCompany,
      name: invoice.billToName,
      email: invoice.billToEmail,
      phone: invoice.billToPhone,
      location: invoice.billToLocation,
    },
    footer: {
      phone: contact.phone,
      email: contact.email,
      locationLines: contact.addressLines,
    },
  };
}

export async function loadSalarySlipDocument(
  _actor: Actor,
  slipId: string,
): Promise<SalarySlipDocumentModel | null> {
  const slip = getStore().salaryDetails[slipId];
  if (!slip) {
    return null;
  }
  const contact = getStore().siteContact;
  return {
    employeeName: slip.employeeName,
    designation: slip.designation,
    slipDate: slip.slipDate,
    salaryMonth: slip.salaryMonth,
    basicSalary: slip.basicSalary,
    punctuality: slip.punctuality,
    medicalAllowance: slip.medicalAllowance,
    incentives: slip.incentives,
    bonus: slip.bonus,
    advance: slip.advance,
    incomeTax: slip.incomeTax,
    whTax: slip.whTax,
    fuelAdvances: slip.fuelAdvances,
    unpaidDays: slip.unpaidDays,
    totalEarnings: slip.totalEarnings,
    totalDeduction: slip.totalDeduction,
    netSalary: slip.netSalary,
    currency: slip.currency,
    status: slip.status,
    company: {
      legalName: slip.fromCompany,
      email: slip.fromEmail,
      phone: slip.fromPhone,
    },
    footer: {
      phone: contact.phone,
      email: contact.email,
      locationLines: contact.addressLines,
    },
  };
}
