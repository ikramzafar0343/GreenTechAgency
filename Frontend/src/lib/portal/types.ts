import { type EmployeeKind, type ServicePageTechCategory, type AdminSiteGallerySectionKey, type SiteTestimonialAccent, type SitePrincipleAccent, type AdminService, type AdminPortfolioItem, type AdminBlogPost, type AdminFaq, type AdminTeamMember, type AdminEmployee, type AdminSale, type AdminLead, type AdminLeadFollowUp, type AdminSalesMessage, type AdminClient, type AdminProject, type AdminMessageAttachment, type AdminInvoiceLineItem } from "./typesPart";
import { type AdminMessage, type AdminInvoice, type AdminSalarySlip, type AdminFile, type AdminCallback, type AdminContactMessage, type AdminSiteGalleryImage, type AdminSiteTestimonial, type AdminSitePrinciple } from "./typesPart2";
export type { AdminMessage, AdminInvoice, AdminSalarySlip, SalarySlipPublic, AdminFile, AdminCallback, AdminContactMessage, AdminSiteGalleryImage, AdminSiteTestimonial, AdminSitePrinciple, AdminDemoState, SiteContactPublic } from "./typesPart2";

export type { ProjectStatus, EmployeeKind, SaleStatus, LeadStatus, ServicePageTechCategory, AdminSiteGallerySectionKey, SiteTestimonialAccent, SitePrincipleAccent, AdminService, AdminPortfolioItem, AdminBlogPost, AdminFaq, AdminTeamMemberSocial, AdminTeamMember, AdminEmployee, AdminSale, AdminLead, AdminLeadFollowUp, AdminSalesMessage, AdminClient, AdminProject, AdminMessageAttachment, AdminInvoiceLineItem } from "./typesPart";

export type AdminDomain =
  | "overview"
  | "cms-catalog"
  | "cms-team"
  | "cms-site"
  | "contact"
  | "ops"
  | "employees"
  | "crm-sales"
  | "crm-leads"
  | "security";

export type AdminDomainPayload = {
  readonly domain: AdminDomain;
  readonly services?: readonly AdminService[];
  readonly portfolio?: readonly AdminPortfolioItem[];
  readonly blog?: readonly AdminBlogPost[];
  readonly faqs?: readonly AdminFaq[];
  readonly team?: readonly AdminTeamMember[];
  readonly contactMessages?: readonly AdminContactMessage[];
  readonly callbacks?: readonly AdminCallback[];
  readonly clients?: readonly AdminClient[];
  readonly projects?: readonly AdminProject[];
  readonly invoices?: readonly AdminInvoice[];
  readonly salarySlips?: readonly AdminSalarySlip[];
  readonly messages?: readonly AdminMessage[];
  readonly files?: readonly AdminFile[];
  readonly employees?: readonly AdminEmployee[];
  readonly sales?: readonly AdminSale[];
  readonly leads?: readonly AdminLead[];
  readonly leadFollowUps?: readonly AdminLeadFollowUp[];
  readonly siteGallery?: readonly AdminSiteGalleryImage[];
  readonly siteTestimonials?: readonly AdminSiteTestimonial[];
  readonly sitePrinciples?: readonly AdminSitePrinciple[];
};

export type EmployeeDomain = "crm" | "delivery";

export type EmployeeDeliveryBootstrap = {
  readonly employee: AdminEmployee;
  readonly clients: readonly AdminClient[];
  readonly projects: readonly AdminProject[];
  readonly messages: readonly AdminMessage[];
  readonly files: readonly AdminFile[];
};

export type EmployeeCrmBootstrap = {
  readonly employee: AdminEmployee;
  readonly sales: readonly AdminSale[];
  readonly leads: readonly AdminLead[];
  readonly leadFollowUps: readonly AdminLeadFollowUp[];
  readonly salesMessages: readonly AdminSalesMessage[];
  readonly salesPeers: readonly AdminEmployee[];
};

export type ServicePageCollection =
  | "offerings"
  | "build-items"
  | "process-steps"
  | "technologies"
  | "benefits"
  | "faqs"
  | "capabilities"
  | "problems"
  | "comparison-points"
  | "related";

export type AdminServicePageListItem = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly navLabel: string;
  readonly parentId: string | null;
  readonly sortOrder: number;
  readonly publishedAt: string | null;
  readonly version: number;
  readonly updatedAt: string;
  readonly active: boolean;
};

export type AdminServicePageOffering = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly imagePath: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
};

export type AdminServicePageBuildItem = {
  readonly id: string;
  readonly label: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
};

export type AdminServicePageProcessStep = {
  readonly id: string;
  readonly stepNumber: number;
  readonly title: string;
  readonly body: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
};

export type AdminServicePageTechnology = {
  readonly id: string;
  readonly category: ServicePageTechCategory;
  readonly name: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
};

export type AdminServicePageBenefit = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
};

export type AdminServicePageFaq = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
};

export type AdminServicePageRelated = {
  readonly id: string;
  readonly relatedServicePageId: string;
  readonly title: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
};

export type AdminServicePageDetail = {
  readonly id: string;
  readonly parentId: string | null;
  readonly sortOrder: number;
  readonly slug: string;
  readonly title: string;
  readonly navLabel: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly ogImagePath: string;
  readonly heroEyebrow: string;
  readonly heroH1: string;
  readonly heroDescription: string;
  readonly heroPrimaryCtaLabel: string;
  readonly heroPrimaryCtaHref: string;
  readonly heroSecondaryCtaLabel: string;
  readonly heroSecondaryCtaHref: string;
  readonly heroImagePath: string;
  readonly introHeading: string;
  readonly introBody: string;
  readonly offeringsHeading: string;
  readonly buildHeading: string;
  readonly processHeading: string;
  readonly technologiesHeading: string;
  readonly benefitsHeading: string;
  readonly benefitsIntro: string;
  readonly capabilitiesHeading: string;
  readonly capabilitiesIntro: string;
  readonly problemsHeading: string;
  readonly problemsIntro: string;
  readonly comparisonHeading: string;
  readonly comparisonBody: string;
  readonly faqsHeading: string;
  readonly ctaHeading: string;
  readonly ctaBody: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly href: string;
  readonly publishedAt: string | null;
  readonly version: number;
  readonly updatedAt: string;
  readonly parent: {
    readonly id: string;
    readonly slug: string;
    readonly title: string;
    readonly navLabel: string;
    readonly href: string;
  } | null;
  readonly children: readonly {
    readonly id: string;
    readonly slug: string;
    readonly title: string;
    readonly navLabel: string;
    readonly heroDescription: string;
    readonly heroImagePath: string;
    readonly sortOrder: number;
    readonly href: string;
  }[];
  readonly active: boolean;
  readonly offerings: readonly AdminServicePageOffering[];
  readonly buildItems: readonly AdminServicePageBuildItem[];
  readonly processSteps: readonly AdminServicePageProcessStep[];
  readonly technologies: readonly AdminServicePageTechnology[];
  readonly benefits: readonly AdminServicePageBenefit[];
  readonly capabilities: readonly AdminServicePageBenefit[];
  readonly problems: readonly AdminServicePageBenefit[];
  readonly comparisonPoints: readonly AdminServicePageBenefit[];
  readonly faqs: readonly AdminServicePageFaq[];
  readonly related: readonly AdminServicePageRelated[];
};

export type AdminServicePageChild =
  | AdminServicePageOffering
  | AdminServicePageBuildItem
  | AdminServicePageProcessStep
  | AdminServicePageTechnology
  | AdminServicePageBenefit
  | AdminServicePageFaq
  | AdminServicePageRelated;

export type LoginFormValues = {
  readonly email: string;
  readonly password: string;
};

export type LoginFieldErrors = {
  readonly email?: string;
  readonly password?: string;
};

export type FailReason = "unauthorized" | "conflict" | "validation" | "server";

export type AdminLoginSubmitResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly fieldErrors: LoginFieldErrors }
  | { readonly ok: false; readonly reason: "credentials" | "server" };

export type EmployeeLoginSubmitResult = AdminLoginSubmitResult;

export type AdminServicePageActionResult =
  | { readonly ok: true; readonly page: AdminServicePageDetail }
  | { readonly ok: true; readonly child: AdminServicePageChild }
  | { readonly ok: true; readonly items: readonly AdminServicePageListItem[] }
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: FailReason; readonly message?: string };

export type SessionRole = "admin" | "employee" | "customer";

export type SessionPayload = {
  readonly subjectId: string;
  readonly role: SessionRole;
  readonly name: string;
  readonly email: string;
  readonly employeeId: string | null;
  readonly employeeKind: EmployeeKind | null;
};

export type Actor = {
  readonly subjectId: string;
  readonly role: "admin" | "employee" | "client";
  readonly employeeKind: EmployeeKind | null;
};
