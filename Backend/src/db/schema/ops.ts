import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

function opsPayloadTable(
  name: string,
  extra: Record<string, ReturnType<typeof text>> = {},
) {
  return pgTable(
    name,
    {
      id: text("id").primaryKey(),
      status: text("status").notNull().default("active"),
      version: integer("version").notNull().default(1),
      payload: jsonb("payload").notNull(),
      ...extra,
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    },
    (t) => [index(`${name}_status_idx`).on(t.status)],
  );
}

export const opsTeamMember = opsPayloadTable("ops_team_member");
export const opsEmployee = opsPayloadTable("ops_employee");
export const opsClient = opsPayloadTable("ops_client");
export const opsProject = opsPayloadTable("ops_project", {
  clientId: text("client_id"),
});
export const opsMessage = opsPayloadTable("ops_message");
export const opsInvoice = opsPayloadTable("ops_invoice", {
  clientId: text("client_id"),
});
export const opsSalarySlip = opsPayloadTable("ops_salary_slip");
export const opsFile = opsPayloadTable("ops_file");
export const opsCallback = opsPayloadTable("ops_callback");
export const opsSale = opsPayloadTable("ops_sale");
export const opsLead = opsPayloadTable("ops_lead");
export const opsLeadFollowUp = opsPayloadTable("ops_lead_follow_up", {
  leadId: text("lead_id"),
});
export const opsSalesMessage = opsPayloadTable("ops_sales_message");
export const opsSiteGallery = opsPayloadTable("ops_site_gallery");
export const opsSitePrinciple = opsPayloadTable("ops_site_principle");

export type OpsResourceTable =
  | typeof opsTeamMember
  | typeof opsEmployee
  | typeof opsClient
  | typeof opsProject
  | typeof opsMessage
  | typeof opsInvoice
  | typeof opsSalarySlip
  | typeof opsFile
  | typeof opsCallback
  | typeof opsSale
  | typeof opsLead
  | typeof opsLeadFollowUp
  | typeof opsSalesMessage
  | typeof opsSiteGallery
  | typeof opsSitePrinciple;

export const OPS_OVERVIEW_TABLES = [
  { key: "team", table: opsTeamMember },
  { key: "employees", table: opsEmployee },
  { key: "clients", table: opsClient },
  { key: "projects", table: opsProject },
  { key: "messages", table: opsMessage },
  { key: "invoices", table: opsInvoice },
  { key: "salarySlips", table: opsSalarySlip },
  { key: "files", table: opsFile },
  { key: "callbacks", table: opsCallback },
  { key: "sales", table: opsSale },
  { key: "leads", table: opsLead },
  { key: "leadFollowUps", table: opsLeadFollowUp },
  { key: "salesMessages", table: opsSalesMessage },
  { key: "siteGallery", table: opsSiteGallery },
  { key: "sitePrinciples", table: opsSitePrinciple },
] as const;
