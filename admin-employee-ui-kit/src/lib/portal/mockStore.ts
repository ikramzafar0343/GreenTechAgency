import type {
  AdminClient,
  AdminDemoState,
  AdminEmployee,
  AdminInvoice,
  AdminServicePageDetail,
  AdminServicePageListItem,
  SalarySlipPublic,
  SiteContactPublic,
} from "./types";

function nowLabel(): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

const EMP_DELIVERY: AdminEmployee = {
  id: "emp-delivery-1",
  name: "Alex Rivera",
  email: "employee@example.com",
  role: "Delivery",
  department: "Delivery",
  kind: "delivery",
  image: "",
  version: 1,
  active: true,
  teamMemberId: null,
  updatedAt: nowLabel(),
};

const EMP_SALES: AdminEmployee = {
  id: "emp-sales-1",
  name: "Sam Chen",
  email: "sales@example.com",
  role: "Sales",
  department: "Sales",
  kind: "sales",
  image: "",
  version: 1,
  active: true,
  teamMemberId: null,
  updatedAt: nowLabel(),
};

const CLIENT: AdminClient = {
  id: "client-1",
  userId: "user-client-1",
  name: "Jordan Blake",
  email: "jordan@acme.test",
  company: "Acme Co",
  phone: "+1 555 0100",
  location: "Austin, TX",
  plan: "Retainer",
  clientContactTitle: "Ops lead",
  status: "active",
  initials: "JB",
  memberSince: "Jan 2025",
  assignedEmployeeIds: ["emp-delivery-1"],
  version: 1,
  updatedAt: nowLabel(),
};

const INVOICE: AdminInvoice = {
  id: "inv-1",
  clientId: "client-1",
  number: "INV-2026-001",
  title: "Website retainers — October",
  amount: "2400.00",
  currency: "USD",
  billToCompany: "Acme Co",
  billToName: "Jordan Blake",
  billToEmail: "jordan@acme.test",
  billToPhone: "+1 555 0100",
  billToLocation: "Austin, TX",
  fromCompany: "Your Company",
  fromEmail: "hello@example.com",
  fromPhone: "+1 555 0199",
  status: "sent",
  issuedOn: "2026-10-01",
  dueDate: "2026-10-15",
  lineItems: [
    {
      id: "line-1",
      description: "Monthly retainer",
      amount: "2400.00",
      sortOrder: 0,
    },
  ],
  version: 1,
  updatedAt: nowLabel(),
};

export const seedSiteContact: SiteContactPublic = {
  id: "site-contact-1",
  email: "hello@example.com",
  phone: "+1 555 0199",
  phoneHref: "tel:+15550199",
  addressLabel: "Studio",
  addressLines: ["123 Main St", "Austin, TX"],
  locationLede: "Austin, Texas",
  mapEmbedUrl: "",
  socialLinkedinUrl: "",
  socialInstagramUrl: "",
  socialFacebookUrl: "",
  socialXUrl: "",
  version: 1,
  updatedAt: new Date().toISOString(),
};

const SLIP: SalarySlipPublic = {
  id: "slip-1",
  employeeId: "emp-delivery-1",
  employeeName: "Alex Rivera",
  designation: "Delivery",
  slipDate: "2026-10-01",
  salaryMonth: "October 2026",
  basicSalary: "80000.00",
  punctuality: "2000.00",
  medicalAllowance: "3000.00",
  incentives: "0.00",
  bonus: "0.00",
  advance: "0.00",
  incomeTax: "2000.00",
  whTax: "0.00",
  fuelAdvances: "0.00",
  unpaidDays: "0.00",
  totalEarnings: "85000.00",
  totalDeduction: "2000.00",
  netSalary: "83000.00",
  currency: "PKR",
  status: "issued",
  statusCode: "issued",
  fromCompany: "Your Company",
  fromEmail: "hello@example.com",
  fromPhone: "+1 555 0199",
  version: 1,
  updatedAt: nowLabel(),
};

const SERVICE_PAGE: AdminServicePageDetail = {
  id: "sp-1",
  parentId: null,
  sortOrder: 10,
  slug: "web-development",
  title: "Web Development",
  navLabel: "Web Development",
  metaTitle: "Web Development",
  metaDescription: "Custom websites.",
  ogTitle: "Web Development",
  ogDescription: "Custom websites.",
  ogImagePath: "",
  heroEyebrow: "Services",
  heroH1: "Web development",
  heroDescription: "Sites built to convert.",
  heroPrimaryCtaLabel: "Start",
  heroPrimaryCtaHref: "/contact",
  heroSecondaryCtaLabel: "",
  heroSecondaryCtaHref: "",
  heroImagePath: "",
  introHeading: "What we build",
  introBody: "Marketing sites and product front-ends.",
  offeringsHeading: "Offerings",
  buildHeading: "Build",
  processHeading: "Process",
  technologiesHeading: "Tech",
  benefitsHeading: "Benefits",
  benefitsIntro: "",
  capabilitiesHeading: "Capabilities",
  capabilitiesIntro: "",
  problemsHeading: "Problems",
  problemsIntro: "",
  comparisonHeading: "Compare",
  comparisonBody: "",
  faqsHeading: "FAQs",
  ctaHeading: "Ready?",
  ctaBody: "Tell us what you need.",
  ctaLabel: "Contact",
  ctaHref: "/contact",
  href: "/services/web-development",
  publishedAt: new Date().toISOString(),
  version: 1,
  updatedAt: new Date().toISOString(),
  parent: null,
  children: [],
  active: true,
  offerings: [],
  buildItems: [],
  processSteps: [],
  technologies: [],
  benefits: [],
  capabilities: [],
  problems: [],
  comparisonPoints: [],
  faqs: [],
  related: [],
};

function emptyState(): AdminDemoState {
  return {
    services: [
      {
        id: "svc-1",
        title: "Web Development",
        slug: "web-development",
        description: "Custom websites.",
        path: "/services/web-development",
        image: "",
        active: true,
        version: 1,
        publishedAt: new Date().toISOString(),
        updatedAt: nowLabel(),
      },
    ],
    portfolio: [],
    blog: [],
    faqs: [
      {
        id: "faq-1",
        question: "How do we start?",
        answer: "Share a brief. We reply with a scoped next step.",
        sortOrder: 10,
        active: true,
        version: 1,
        publishedAt: new Date().toISOString(),
        updatedAt: nowLabel(),
      },
    ],
    team: [],
    employees: [EMP_DELIVERY, EMP_SALES],
    clients: [CLIENT],
    projects: [
      {
        id: "proj-1",
        clientId: "client-1",
        title: "Marketing site rebuild",
        service: "Web Development",
        status: "in_progress",
        notes: "Homepage in review.",
        version: 1,
        updatedAt: nowLabel(),
      },
    ],
    messages: [
      {
        id: "msg-1",
        clientId: "client-1",
        from: "client",
        body: "Can we review the homepage this week?",
        at: nowLabel(),
        createdAt: new Date().toISOString(),
        read: false,
        attachments: [],
      },
    ],
    invoices: [INVOICE],
    salarySlips: [
      {
        id: SLIP.id,
        employeeId: SLIP.employeeId,
        employeeName: SLIP.employeeName,
        designation: SLIP.designation,
        slipDate: SLIP.slipDate,
        salaryMonth: SLIP.salaryMonth,
        netSalary: SLIP.netSalary,
        currency: SLIP.currency,
        status: SLIP.status,
        version: SLIP.version,
        updatedAt: SLIP.updatedAt,
      },
    ],
    files: [],
    callbacks: [],
    contactMessages: [],
    sales: [
      {
        id: "sale-1",
        carrierId: "carrier-1",
        repId: "emp-sales-1",
        status: "quoted",
        amount: "1500.00",
        currency: "USD",
        usDot: "",
        mc: "",
        legalName: "Northline Logistics",
        dba: "",
        businessAddress: "",
        ownerOperatorDriver: "",
        taxId: "XX-XXXXXXX",
        salesAgent: "Sam Chen",
        businessTelephone: "",
        truckType: "",
        contactName: "Pat Lee",
        contactPhone: "+1 555 0112",
        contactEmail: "pat@northline.test",
        truck: "",
        trailer: "",
        insuranceName: "",
        insurancePhone: "",
        insuranceStreet: "",
        insuranceCityStateZip: "",
        insuranceEmail: "",
        factoringName: "",
        factoringPhone: "",
        factoringStreet: "",
        factoringCityStateZip: "",
        factoringEmail: "",
        approvedBy: "",
        version: 1,
        updatedAt: nowLabel(),
      },
    ],
    leads: [
      {
        id: "lead-1",
        repId: "emp-sales-1",
        company: "Brighthaul",
        contactName: "Casey Ng",
        phone: "+1 555 0144",
        email: "casey@brighthaul.test",
        source: "Referral",
        status: "contacted",
        notes: "Follow up Friday.",
        version: 1,
        updatedAt: nowLabel(),
      },
    ],
    leadFollowUps: [],
    salesMessages: [],
    siteGallery: [],
    siteTestimonials: [],
    sitePrinciples: [],
  };
}

type Store = {
  state: AdminDemoState;
  siteContact: SiteContactPublic;
  salaryDetails: Record<string, SalarySlipPublic>;
  servicePages: Record<string, AdminServicePageDetail>;
  profile: {
    id: string;
    version: number;
    name: string;
    email: string;
    title: string | null;
    role: string;
    imagePath: string;
  };
};

const store: Store = {
  state: emptyState(),
  siteContact: seedSiteContact,
  salaryDetails: { [SLIP.id]: SLIP },
  servicePages: { "web-development": SERVICE_PAGE },
  profile: {
    id: "admin-1",
    version: 1,
    name: "Owner Admin",
    email: "admin@example.com",
    title: "Owner",
    role: "admin",
    imagePath: "",
  },
};

export function getStore(): Store {
  return store;
}

export function nowStamp(): string {
  return nowLabel();
}

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function toListItem(
  page: AdminServicePageDetail,
): AdminServicePageListItem {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    navLabel: page.navLabel,
    parentId: page.parentId,
    sortOrder: page.sortOrder,
    publishedAt: page.publishedAt,
    version: page.version,
    updatedAt: page.updatedAt,
    active: page.active,
  };
}

export function listServicePages(): AdminServicePageListItem[] {
  return Object.values(store.servicePages).map(toListItem);
}
