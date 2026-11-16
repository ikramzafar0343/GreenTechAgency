import { type AdminSiteGallerySectionKey, type SiteTestimonialAccent, type SitePrincipleAccent, type AdminService, type AdminPortfolioItem, type AdminBlogPost, type AdminFaq, type AdminTeamMember, type AdminEmployee, type AdminSale, type AdminLead, type AdminLeadFollowUp, type AdminSalesMessage, type AdminClient, type AdminProject, type AdminMessageAttachment, type AdminInvoiceLineItem } from "./typesPart";

export type AdminMessage = {
  readonly id: string;
  readonly clientId: string;
  readonly from: "admin" | "client" | "employee";
  readonly body: string;
  readonly at: string;
  readonly createdAt: string;
  readonly read: boolean;
  readonly attachments: readonly AdminMessageAttachment[];
};

export type AdminInvoice = {
  readonly id: string;
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
  readonly status: "draft" | "sent" | "paid";
  readonly issuedOn: string | null;
  readonly dueDate: string | null;
  readonly lineItems: readonly AdminInvoiceLineItem[];
  readonly version: number;
  readonly updatedAt: string;
};

export type AdminSalarySlip = {
  readonly id: string;
  readonly employeeId: string | null;
  readonly employeeName: string;
  readonly designation: string;
  readonly slipDate: string;
  readonly salaryMonth: string;
  readonly netSalary: string;
  readonly currency: string;
  readonly status: "draft" | "issued";
  readonly version: number;
  readonly updatedAt: string;
};

export type SalarySlipPublic = AdminSalarySlip & {
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
  readonly totalEarnings: string;
  readonly totalDeduction: string;
  readonly statusCode: "draft" | "issued";
  readonly fromCompany: string;
  readonly fromEmail: string;
  readonly fromPhone: string;
};

export type AdminFile = {
  readonly id: string;
  readonly clientId: string;
  readonly name: string;
  readonly kind: string;
  readonly url: string | null;
  readonly updatedAt: string;
};

export type AdminCallback = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly note: string;
  readonly status: "new" | "resolved";
  readonly version: number;
  readonly updatedAt: string;
};

export type AdminContactMessage = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly body: string;
  readonly status: "new" | "read";
  readonly version: number;
  readonly updatedAt: string;
};

export type AdminSiteGalleryImage = {
  readonly id: string;
  readonly sectionKey: AdminSiteGallerySectionKey;
  readonly image: string;
  readonly altText: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly updatedAt: string;
};

export type AdminSiteTestimonial = {
  readonly id: string;
  readonly quote: string;
  readonly authorName: string;
  readonly roleTitle: string;
  readonly company: string;
  readonly accent: SiteTestimonialAccent;
  readonly image: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly updatedAt: string;
};

export type AdminSitePrinciple = {
  readonly id: string;
  readonly indexLabel: string;
  readonly title: string;
  readonly body: string;
  readonly accent: SitePrincipleAccent;
  readonly image: string;
  readonly imageAlt: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly updatedAt: string;
};

export type AdminDemoState = {
  readonly services: readonly AdminService[];
  readonly portfolio: readonly AdminPortfolioItem[];
  readonly blog: readonly AdminBlogPost[];
  readonly faqs: readonly AdminFaq[];
  readonly team: readonly AdminTeamMember[];
  readonly employees: readonly AdminEmployee[];
  readonly clients: readonly AdminClient[];
  readonly projects: readonly AdminProject[];
  readonly messages: readonly AdminMessage[];
  readonly invoices: readonly AdminInvoice[];
  readonly salarySlips: readonly AdminSalarySlip[];
  readonly files: readonly AdminFile[];
  readonly callbacks: readonly AdminCallback[];
  readonly contactMessages: readonly AdminContactMessage[];
  readonly sales: readonly AdminSale[];
  readonly leads: readonly AdminLead[];
  readonly leadFollowUps: readonly AdminLeadFollowUp[];
  readonly salesMessages: readonly AdminSalesMessage[];
  readonly siteGallery: readonly AdminSiteGalleryImage[];
  readonly siteTestimonials: readonly AdminSiteTestimonial[];
  readonly sitePrinciples: readonly AdminSitePrinciple[];
};

export type SiteContactPublic = {
  readonly id: string;
  readonly email: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly addressLabel: string;
  readonly addressLines: readonly string[];
  readonly locationLede: string;
  readonly mapEmbedUrl: string;
  readonly socialLinkedinUrl: string;
  readonly socialInstagramUrl: string;
  readonly socialFacebookUrl: string;
  readonly socialXUrl: string;
  readonly version: number;
  readonly updatedAt: string;
};
