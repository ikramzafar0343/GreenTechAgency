import { Router } from "express";
import { count, eq } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import {
  OPS_OVERVIEW_TABLES,
  opsCallback,
  opsClient,
  opsEmployee,
  opsFile,
  opsInvoice,
  opsLead,
  opsLeadFollowUp,
  opsMessage,
  opsProject,
  opsSalarySlip,
  opsSale,
  opsSalesMessage,
  opsSiteGallery,
  opsSitePrinciple,
  opsTeamMember,
} from "../../db/schema/ops.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { requireCsrf } from "../../http/csrf.js";
import { parseListQuery } from "../../http/pagination.js";
import { rateLimitAdminWrites } from "../../http/rateLimit.js";
import {
  getStaffActorId,
  requireStaff,
  type StaffRequest,
} from "../../http/requireStaff.js";
import {
  createOpsResourceCrud,
  OPS_STATUSES,
  type OpsResourceCrud,
} from "./resourceCrud.js";
import {
  createEmployeeWithCredentials,
  setEmployeePassword,
} from "./employeeCredentials.js";
import { AppError } from "../../http/errors.js";

export const adminOpsRouter = Router();

/** Admin and employee (staff) share Ops CRUD so portals stay on one API. */
adminOpsRouter.use(requireStaff, requireCsrf, rateLimitAdminWrites);

function requireAdminActor(req: StaffRequest): string {
  const session = req.staffSession;
  const role =
    session && "role" in session.user ? String(session.user.role ?? "") : "";
  if (role !== "admin") {
    throw new AppError("FORBIDDEN", "Admin role required");
  }
  return getStaffActorId(req);
}

const teamCrud = createOpsResourceCrud({
  table: opsTeamMember,
  entityType: "ops_team_member",
});
const employeesCrud = createOpsResourceCrud({
  table: opsEmployee,
  entityType: "ops_employee",
});
const clientsCrud = createOpsResourceCrud({
  table: opsClient,
  entityType: "ops_client",
});
const projectsCrud = createOpsResourceCrud({
  table: opsProject,
  entityType: "ops_project",
  extraFromBody: (body) => ({
    clientId:
      body.clientId === null || body.clientId === undefined
        ? undefined
        : String(body.clientId).trim() || null,
  }),
});
const messagesCrud = createOpsResourceCrud({
  table: opsMessage,
  entityType: "ops_message",
});
const invoicesCrud = createOpsResourceCrud({
  table: opsInvoice,
  entityType: "ops_invoice",
  extraFromBody: (body) => ({
    clientId:
      body.clientId === null || body.clientId === undefined
        ? undefined
        : String(body.clientId).trim() || null,
  }),
});
const salarySlipsCrud = createOpsResourceCrud({
  table: opsSalarySlip,
  entityType: "ops_salary_slip",
});
const filesCrud = createOpsResourceCrud({
  table: opsFile,
  entityType: "ops_file",
});
const callbacksCrud = createOpsResourceCrud({
  table: opsCallback,
  entityType: "ops_callback",
});
const salesCrud = createOpsResourceCrud({
  table: opsSale,
  entityType: "ops_sale",
});
const leadsCrud = createOpsResourceCrud({
  table: opsLead,
  entityType: "ops_lead",
});
const leadFollowUpsCrud = createOpsResourceCrud({
  table: opsLeadFollowUp,
  entityType: "ops_lead_follow_up",
  extraFromBody: (body) => ({
    leadId:
      body.leadId === null || body.leadId === undefined
        ? undefined
        : String(body.leadId).trim() || null,
  }),
});
const salesMessagesCrud = createOpsResourceCrud({
  table: opsSalesMessage,
  entityType: "ops_sales_message",
});
const siteGalleryCrud = createOpsResourceCrud({
  table: opsSiteGallery,
  entityType: "ops_site_gallery",
});
const sitePrinciplesCrud = createOpsResourceCrud({
  table: opsSitePrinciple,
  entityType: "ops_site_principle",
});

function mountOpsResource(router: Router, path: string, crud: OpsResourceCrud) {
  const sub = Router();
  sub.get(
    "/",
    asyncHandler(async (req, res) => {
      const query = parseListQuery(
        req.query as Record<string, unknown>,
        OPS_STATUSES,
      );
      res.json(await crud.list(query));
    }),
  );
  sub.post(
    "/",
    asyncHandler(async (req, res) => {
      const actorId = getStaffActorId(req as StaffRequest);
      res.status(201).json(await crud.create(actorId, req.body ?? {}));
    }),
  );
  sub.get(
    "/:id",
    asyncHandler(async (req, res) => {
      res.json(await crud.get(String(req.params.id)));
    }),
  );
  sub.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const actorId = getStaffActorId(req as StaffRequest);
      res.json(
        await crud.update(actorId, String(req.params.id), req.body ?? {}),
      );
    }),
  );
  sub.post(
    "/:id/archive",
    asyncHandler(async (req, res) => {
      const actorId = getStaffActorId(req as StaffRequest);
      res.json(
        await crud.archive(actorId, String(req.params.id), req.body ?? {}),
      );
    }),
  );
  sub.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const actorId = getStaffActorId(req as StaffRequest);
      res.json(await crud.delete(actorId, String(req.params.id)));
    }),
  );
  router.use(path, sub);
}

function mountEmployeesResource(router: Router, crud: OpsResourceCrud) {
  const sub = Router();
  sub.get(
    "/",
    asyncHandler(async (req, res) => {
      const query = parseListQuery(
        req.query as Record<string, unknown>,
        OPS_STATUSES,
      );
      res.json(await crud.list(query));
    }),
  );
  sub.post(
    "/",
    asyncHandler(async (req, res) => {
      const actorId = requireAdminActor(req as StaffRequest);
      res
        .status(201)
        .json(await createEmployeeWithCredentials(actorId, req.body ?? {}));
    }),
  );
  sub.post(
    "/:id/password",
    asyncHandler(async (req, res) => {
      const actorId = requireAdminActor(req as StaffRequest);
      res.json(
        await setEmployeePassword(
          actorId,
          String(req.params.id),
          req.body ?? {},
        ),
      );
    }),
  );
  sub.get(
    "/:id",
    asyncHandler(async (req, res) => {
      res.json(await crud.get(String(req.params.id)));
    }),
  );
  sub.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const actorId = getStaffActorId(req as StaffRequest);
      res.json(
        await crud.update(actorId, String(req.params.id), req.body ?? {}),
      );
    }),
  );
  sub.post(
    "/:id/archive",
    asyncHandler(async (req, res) => {
      const actorId = getStaffActorId(req as StaffRequest);
      res.json(
        await crud.archive(actorId, String(req.params.id), req.body ?? {}),
      );
    }),
  );
  sub.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const actorId = getStaffActorId(req as StaffRequest);
      res.json(await crud.delete(actorId, String(req.params.id)));
    }),
  );
  router.use("/employees", sub);
}

mountOpsResource(adminOpsRouter, "/team", teamCrud);
mountEmployeesResource(adminOpsRouter, employeesCrud);
mountOpsResource(adminOpsRouter, "/clients", clientsCrud);
mountOpsResource(adminOpsRouter, "/projects", projectsCrud);
mountOpsResource(adminOpsRouter, "/messages", messagesCrud);
mountOpsResource(adminOpsRouter, "/invoices", invoicesCrud);
mountOpsResource(adminOpsRouter, "/salary-slips", salarySlipsCrud);
mountOpsResource(adminOpsRouter, "/files", filesCrud);
mountOpsResource(adminOpsRouter, "/callbacks", callbacksCrud);
mountOpsResource(adminOpsRouter, "/sales", salesCrud);
mountOpsResource(adminOpsRouter, "/leads", leadsCrud);
mountOpsResource(adminOpsRouter, "/lead-follow-ups", leadFollowUpsCrud);
mountOpsResource(adminOpsRouter, "/sales-messages", salesMessagesCrud);
mountOpsResource(adminOpsRouter, "/site-gallery", siteGalleryCrud);
mountOpsResource(adminOpsRouter, "/site-principles", sitePrinciplesCrud);

adminOpsRouter.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const db = getDb();
    const counts: Record<string, number> = {};
    for (const { key, table } of OPS_OVERVIEW_TABLES) {
      const [row] = await db
        .select({ value: count() })
        .from(table)
        .where(eq(table.status, "active"));
      counts[key] = row?.value ?? 0;
    }
    res.json({ counts });
  }),
);
