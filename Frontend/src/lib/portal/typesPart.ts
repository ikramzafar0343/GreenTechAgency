
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

export type AdminInvoiceLineItem = {
  readonly id: string;
  readonly description: string;
  readonly amount: string;
  readonly sortOrder: number;
};
