"use server";

import type {
  AdminDomain,
  AdminDomainPayload,
} from "@/lib/portal/types";
import {
  getOpsOverview,
  listOpsResource,
} from "@/server/backend/opsClient";
import { backendAdminGet } from "@/server/backend/client";

async function listEnquiries() {
  try {
    const data = await backendAdminGet<{
      items: Array<Record<string, unknown>>;
    }>("/api/admin/enquiries?limit=50&offset=0");
    return data.items;
  } catch {
    return [];
  }
}

/** Loads admin domain data from Backend Ops APIs (no mockStore). */
export async function loadAdminDomainFromBackend(
  domain: AdminDomain,
): Promise<AdminDomainPayload> {
  switch (domain) {
    case "overview": {
      const counts = await getOpsOverview();
      return {
        domain,
        services: [],
        portfolio: [],
        blog: [],
        faqs: [],
        // overview UI can use counts via clients length placeholders
        clients: Array.from({ length: counts.clients ?? 0 }, (_, i) => ({
          id: `count-${i}`,
        })) as never,
      };
    }
    case "cms-catalog":
      return { domain, services: [], portfolio: [], blog: [], faqs: [] };
    case "cms-team":
      return {
        domain,
        team: (await listOpsResource("team")) as never,
      };
    case "cms-site":
      return {
        domain,
        siteGallery: (await listOpsResource("site-gallery")) as never,
        siteTestimonials: [],
        sitePrinciples: (await listOpsResource("site-principles")) as never,
      };
    case "contact":
      return {
        domain,
        contactMessages: (await listEnquiries()) as never,
      };
    case "ops":
      return {
        domain,
        clients: (await listOpsResource("clients")) as never,
        projects: (await listOpsResource("projects")) as never,
        invoices: (await listOpsResource("invoices")) as never,
        salarySlips: (await listOpsResource("salary-slips")) as never,
        messages: (await listOpsResource("messages")) as never,
        files: (await listOpsResource("files")) as never,
        employees: (await listOpsResource("employees")) as never,
      };
    case "employees":
      return {
        domain,
        employees: (await listOpsResource("employees")) as never,
      };
    case "crm-sales":
      return {
        domain,
        sales: (await listOpsResource("sales")) as never,
        employees: (await listOpsResource("employees")) as never,
      };
    case "crm-leads":
      return {
        domain,
        leads: (await listOpsResource("leads")) as never,
        employees: (await listOpsResource("employees")) as never,
        leadFollowUps: (await listOpsResource("lead-follow-ups")) as never,
      };
    default:
      return { domain };
  }
}
