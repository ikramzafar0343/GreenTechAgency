export type ContentStatus = "draft" | "published" | "archived";

export type CmsListResponse<T> = {
  readonly items: readonly T[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
};

export type CmsAdminEntity = {
  readonly id: string;
  readonly status: ContentStatus;
  readonly version: number;
  readonly draftSlug: string;
  readonly publishedSlug: string | null;
  readonly draftDoc: Record<string, unknown>;
  readonly publishedDoc: Record<string, unknown> | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ServiceAdminRow = CmsAdminEntity & {
  readonly sortOrder: number;
  readonly featured: boolean;
};

export type BlogAdminRow = CmsAdminEntity & {
  readonly featured: boolean;
  readonly homepageOrder: number;
};

export type PortfolioAdminRow = CmsAdminEntity & {
  readonly sortOrder: number;
  readonly featured: boolean;
};

export type SubserviceAdminRow = {
  readonly id: string;
  readonly serviceId: string;
  readonly status: ContentStatus;
  readonly version: number;
  readonly sortOrder: number;
  readonly draftSlug: string;
  readonly publishedSlug: string | null;
  readonly draftDoc: Record<string, unknown>;
};

export type SectionAdminRow = {
  readonly key: string;
  readonly version: number;
  readonly visible: boolean;
  readonly draftDoc: {
    eyebrow: string | null;
    heading: string;
    introduction: string;
    ctaLabel: string | null;
    ctaHref: string | null;
    featuredIds: string[];
    maxItems: number;
  };
  readonly publishedDoc: SectionAdminRow["draftDoc"] | null;
};

export type SectionKey =
  | "services"
  | "blog"
  | "portfolio"
  | "faq"
  | "testimonials"
  | "stats";

/** Minimum row shape for {@link CmsResourceList}. */
export type CmsListRow = Pick<
  CmsAdminEntity,
  "id" | "status" | "version" | "draftDoc"
> & {
  readonly draftSlug?: string;
};

export type FaqAdminRow = CmsListRow & {
  readonly sortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedDoc: { question: string; answer: string } | null;
};

export type TestimonialAdminRow = CmsListRow & {
  readonly sortOrder: number;
  readonly featured: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedDoc: Record<string, unknown> | null;
};

export type StatAdminRow = CmsListRow & {
  readonly sortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedDoc: Record<string, unknown> | null;
};

export type EnquiryKind =
  | "contact"
  | "project"
  | "careers"
  | "general"
  | "callback";

export type EnquiryStatus = "new" | "read" | "archived" | "spam";

export type EnquiryAdminRow = {
  readonly id: string;
  readonly kind: EnquiryKind;
  readonly status: EnquiryStatus;
  readonly name: string;
  readonly email: string;
  readonly company: string | null;
  readonly phone: string | null;
  readonly service: string | null;
  readonly message: string;
  readonly meta: unknown;
  readonly createdAt: string;
};

export type SiteDocumentAdminRow = {
  readonly key: string;
  readonly version: number;
  readonly draftDoc: Record<string, unknown>;
  readonly publishedDoc: Record<string, unknown> | null;
};
