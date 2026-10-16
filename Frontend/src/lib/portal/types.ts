export type ProjectStatus =
  | "requested"
  | "approved"
  | "in_progress"
  | "completed";

export type EmployeeKind = "delivery" | "sales";
export type SaleStatus = "draft" | "quoted" | "won" | "lost";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "closed";

export type ServicePageTechCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "commerce"
  | "database"
  | "cloud";

export type AdminSiteGallerySectionKey =
  | "about_gallery"
  | "studio_flow"
  | "services_fan"
  | "portfolio_marquee";

export type SiteTestimonialAccent = "brand" | "secondary" | "dark";
export type SitePrincipleAccent = "brand" | "secondary";

export type AdminService = {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string;
  readonly path: string;
  readonly image: string;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly updatedAt: string;
};

export type AdminPortfolioItem = {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly category: string;
  readonly summary: string;
  readonly image: string;
  readonly websiteUrl: string;
  readonly fullPageImage: string;
  readonly fullPageImageAlt: string;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly updatedAt: string;
};

export type AdminBlogPost = {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly body: string;
  readonly image: string;
  readonly category: string;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly updatedAt: string;
};

export type AdminFaq = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly sortOrder: number;
  readonly active: boolean;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly updatedAt: string;
};

export type AdminTeamMemberSocial = {
  readonly network: "linkedin" | "instagram" | "x";
  readonly label: string;
  readonly href: string;
};

export type AdminTeamMember = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly image: string;
  readonly active: boolean;
  readonly employeeId: string | null;
  readonly sortOrder: number;
  readonly version: number;
  readonly publishedAt: string | null;
  readonly socials: readonly AdminTeamMemberSocial[];
  readonly updatedAt: string;
};

export type AdminEmployee = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly department: string;
  readonly kind: EmployeeKind;
  readonly image: string;
  readonly version: number;
  readonly active: boolean;
  readonly teamMemberId: string | null;
  readonly updatedAt: string;
};

export type AdminSale = {
  readonly id: string;
  readonly carrierId: string;
  readonly repId: string;
  readonly status: SaleStatus;
  readonly amount: string;
  readonly currency: string;
  readonly usDot: string;
  readonly mc: string;
  readonly legalName: string;
  readonly dba: string;
  readonly businessAddress: string;
  readonly ownerOperatorDriver: string;
  readonly taxId: string;
  readonly salesAgent: string;
  readonly businessTelephone: string;
  readonly truckType: string;
  readonly contactName: string;
  readonly contactPhone: string;
  readonly contactEmail: string;
  readonly truck: string;
  readonly trailer: string;
  readonly insuranceName: string;
  readonly insurancePhone: string;
  readonly insuranceStreet: string;
  readonly insuranceCityStateZip: string;
  readonly insuranceEmail: string;
  readonly factoringName: string;
  readonly factoringPhone: string;
  readonly factoringStreet: string;
  readonly factoringCityStateZip: string;
  readonly factoringEmail: string;
  readonly approvedBy: string;
  readonly version: number;
  readonly updatedAt: string;
};

export type AdminLead = {
  readonly id: string;
  readonly repId: string;
  readonly company: string;
  readonly contactName: string;
  readonly phone: string;
  readonly email: string;
  readonly source: string;
  readonly status: LeadStatus;
  readonly notes: string;
  readonly version: number;
  readonly updatedAt: string;
};

export type AdminLeadFollowUp = {
  readonly id: string;
  readonly leadId: string;
  readonly at: string;
  readonly note: string;
  readonly outcome: string;
};

export type AdminSalesMessage = {
  readonly id: string;
  readonly fromRepId: string;
  readonly toRepId: string;
  readonly body: string;
  readonly at: string;
  readonly read: boolean;
};

export type AdminClient = {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly phone: string;
  readonly location: string;
  readonly plan: string;
  readonly clientContactTitle: string;
  readonly status: "active" | "paused";
  readonly initials: string;
  readonly memberSince: string;
  readonly assignedEmployeeIds: readonly string[];
  readonly version: number;
  readonly updatedAt: string;
};

export type AdminProject = {
  readonly id: string;
  readonly clientId: string;
  readonly title: string;
  readonly service: string;
  readonly status: ProjectStatus;
  readonly notes: string;
  readonly version: number;
  readonly updatedAt: string;
};

export type AdminMessageAttachment = {
  readonly fileId: string;
  readonly name: string;
  readonly contentType: string;
  readonly sizeBytes: number;
};

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

export type AdminInvoiceLineItem = {
  readonly id: string;
  readonly description: string;
  readonly amount: string;
  readonly sortOrder: number;
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
