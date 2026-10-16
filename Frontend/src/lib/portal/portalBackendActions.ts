"use server";

import type { InvoiceDocumentModel } from "@/components/invoices/InvoiceDocument";
import type { SalarySlipDocumentModel } from "@/components/salaries/SalarySlipDocument";
import type {
  Actor,
  AdminServicePageListItem,
  FailReason,
  SiteContactPublic,
} from "@/lib/portal/types";
import {
  backendAdminGet,
  backendAdminMutate,
  backendFetch,
} from "@/server/backend/client";
import { getBackendUrl } from "@/server/backend/env";
import { cookies, headers } from "next/headers";
import { opsGet } from "./opsMutations";

type Fail = { readonly ok: false; readonly reason: FailReason; readonly message?: string };

function fail(reason: FailReason = "server", message?: string): Fail {
  return message ? { ok: false, reason, message } : { ok: false, reason };
}

type FooterAdminRow = {
  key: string;
  version: number;
  updatedAt?: string;
  draftDoc: Record<string, unknown>;
  publishedDoc: Record<string, unknown> | null;
};

function socialUrl(
  links: unknown,
  platform: string,
): string {
  if (!Array.isArray(links)) return "";
  const hit = links.find(
    (item) =>
      item &&
      typeof item === "object" &&
      String((item as Record<string, unknown>).platform) === platform,
  ) as Record<string, unknown> | undefined;
  return hit ? String(hit.url ?? "") : "";
}

function siteContactFromFooter(row: FooterAdminRow): SiteContactPublic {
  const doc = (row.draftDoc ?? row.publishedDoc ?? {}) as Record<string, unknown>;
  const contact =
    doc.contact && typeof doc.contact === "object"
      ? (doc.contact as Record<string, unknown>)
      : {};
  const email = String(contact.email ?? "");
  const phone = String(contact.phone ?? "");
  const address = String(contact.address ?? "");
  return {
    id: "footer-contact",
    email,
    phone,
    phoneHref: phone ? `tel:${phone.replace(/\s+/g, "")}` : "",
    addressLabel: "Studio",
    addressLines: address ? [address] : [],
    locationLede: address,
    mapEmbedUrl: String(contact.mapUrl ?? ""),
    socialLinkedinUrl: socialUrl(doc.socialLinks, "linkedin"),
    socialInstagramUrl: socialUrl(doc.socialLinks, "instagram"),
    socialFacebookUrl: socialUrl(doc.socialLinks, "facebook"),
    socialXUrl: socialUrl(doc.socialLinks, "x"),
    version: row.version,
    updatedAt: row.updatedAt ?? new Date().toISOString(),
  };
}

export async function getAdminSiteContactAction(): Promise<
  | { readonly ok: true; readonly data: SiteContactPublic }
  | Fail
> {
  try {
    const row = await backendAdminGet<FooterAdminRow>("/api/admin/site/footer");
    return { ok: true, data: siteContactFromFooter(row) };
  } catch {
    return fail("server");
  }
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
  try {
    const current = await backendAdminGet<FooterAdminRow>("/api/admin/site/footer");
    const doc = { ...(current.draftDoc ?? {}) } as Record<string, unknown>;
    const contact =
      doc.contact && typeof doc.contact === "object"
        ? { ...(doc.contact as Record<string, unknown>) }
        : {};
    const addressLines = [
      input.addressLine1,
      input.addressLine2,
      input.addressLine3,
    ].filter((line) => line.length > 0);
    doc.contact = {
      ...contact,
      email: input.email || null,
      phone: input.phone || null,
      address: addressLines.join(", ") || null,
      mapUrl: input.mapEmbedUrl || null,
    };
    const socialLinks = Array.isArray(doc.socialLinks)
      ? [...(doc.socialLinks as Record<string, unknown>[])]
      : [];
    const upsertSocial = (platform: string, url: string) => {
      const idx = socialLinks.findIndex(
        (item) => String(item.platform) === platform,
      );
      if (idx >= 0) {
        socialLinks[idx] = { ...socialLinks[idx], url };
      } else if (url) {
        socialLinks.push({
          id: platform,
          platform,
          label: platform,
          url,
          displayOrder: socialLinks.length + 1,
        });
      }
    };
    upsertSocial("linkedin", input.socialLinkedinUrl);
    upsertSocial("instagram", input.socialInstagramUrl);
    upsertSocial("facebook", input.socialFacebookUrl);
    upsertSocial("x", input.socialXUrl);
    doc.socialLinks = socialLinks;
    const updated = await backendAdminMutate<FooterAdminRow>(
      "/api/admin/site/footer",
      "PATCH",
      { version: input.version, doc },
    );
    return { ok: true, data: siteContactFromFooter(updated) };
  } catch {
    return fail("server");
  }
}

export async function uploadCmsMediaAction(
  formData: FormData,
): Promise<{ readonly ok: true; readonly imagePath: string } | Fail> {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();
    const origin =
      headerStore.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL?.trim() ??
      "http://localhost:3000";
    const cookieHeader = cookieStore
      .getAll()
      .map((entry) => `${entry.name}=${entry.value}`)
      .join("; ");
    if (!formData.has("visibility")) {
      formData.set("visibility", "public");
    }
    const response = await fetch(`${getBackendUrl()}/api/admin/media/upload`, {
      method: "POST",
      headers: {
        Origin: origin,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: formData,
    });
    if (!response.ok) {
      let message = `Upload failed (${response.status})`;
      try {
        const errBody = (await response.json()) as { message?: string };
        if (typeof errBody.message === "string" && errBody.message.trim()) {
          message = errBody.message.trim();
        }
      } catch {
        /* ignore */
      }
      return fail(
        response.status === 401 || response.status === 403
          ? "unauthorized"
          : response.status === 400
            ? "validation"
            : "server",
        message,
      );
    }
    const data = (await response.json()) as { url?: string; objectKey?: string };
    const imagePath =
      data.url ??
      (data.objectKey
        ? data.objectKey.startsWith("/")
          ? data.objectKey
          : `/media/${data.objectKey}`
        : "");
    if (!imagePath) {
      return fail("server", "Upload succeeded but no media URL was returned");
    }
    return { ok: true, imagePath };
  } catch (err) {
    return fail(
      "server",
      err instanceof Error ? err.message : "Could not upload image",
    );
  }
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
  try {
    const me = await backendFetch<{
      id: string;
      email: string;
      name: string;
      role: string;
    }>("/api/admin/me", { withSession: true, cache: "no-store" });
    return {
      ok: true,
      profile: {
        id: me.id,
        version: 1,
        name: me.name || me.email,
        email: me.email,
        title: null,
        role: me.role,
        imagePath: "",
      },
    };
  } catch {
    return fail("unauthorized");
  }
}

export async function listAdminServicePagesAction(): Promise<
  | { readonly ok: true; readonly items: readonly AdminServicePageListItem[] }
  | Fail
> {
  try {
    const data = await backendAdminGet<{
      items: Array<Record<string, unknown>>;
    }>("/api/admin/services?limit=50&offset=0");
    return {
      ok: true,
      items: data.items.map((item) => {
        const draft =
          item.draftDoc && typeof item.draftDoc === "object"
            ? (item.draftDoc as Record<string, unknown>)
            : {};
        const title = String(draft.title ?? item.draftSlug ?? item.id);
        return {
          id: String(item.id),
          slug: String(item.draftSlug ?? item.publishedSlug ?? ""),
          title,
          navLabel: title,
          parentId: null,
          sortOrder: Number(item.sortOrder ?? 0),
          publishedAt:
            item.status === "published"
              ? String(item.updatedAt ?? "")
              : null,
          version: Number(item.version ?? 1),
          updatedAt: String(item.updatedAt ?? ""),
          active: item.status !== "archived",
        };
      }),
    };
  } catch {
    return fail("server");
  }
}

export async function loadInvoiceDocument(
  _actor: Actor,
  invoiceId: string,
): Promise<InvoiceDocumentModel | null> {
  try {
    const invoice = await opsGet("invoices", invoiceId);
    const contactResult = await getAdminSiteContactAction();
    const contact =
      contactResult.ok
        ? contactResult.data
        : {
            phone: "",
            email: "",
            addressLines: [] as readonly string[],
          };
    const lineItems = Array.isArray(invoice.lineItems)
      ? (invoice.lineItems as Array<Record<string, unknown>>)
      : [];
    const statusRaw = String(invoice.status ?? "draft");
    const status =
      statusRaw === "sent" || statusRaw === "paid" ? statusRaw : "draft";
    return {
      number: String(invoice.number ?? ""),
      title: String(invoice.title ?? ""),
      amount: String(invoice.amount ?? ""),
      currency: String(invoice.currency ?? "USD"),
      status,
      issuedOn: invoice.issuedOn == null ? null : String(invoice.issuedOn),
      dueDate: invoice.dueDate == null ? null : String(invoice.dueDate),
      createdAt: String(invoice.createdAt ?? new Date().toISOString()),
      lineItems: lineItems.map((line) => ({
        description: String(line.description ?? ""),
        amount: String(line.amount ?? ""),
      })),
      company: {
        legalName: String(invoice.fromCompany ?? ""),
        email: String(invoice.fromEmail ?? ""),
        phone: String(invoice.fromPhone ?? ""),
      },
      client: {
        company: String(invoice.billToCompany ?? ""),
        name: String(invoice.billToName ?? ""),
        email: String(invoice.billToEmail ?? ""),
        phone: String(invoice.billToPhone ?? ""),
        location: String(invoice.billToLocation ?? ""),
      },
      footer: {
        phone: contact.phone,
        email: contact.email,
        locationLines: [...contact.addressLines],
      },
    };
  } catch {
    return null;
  }
}

export async function loadSalarySlipDocument(
  _actor: Actor,
  slipId: string,
): Promise<SalarySlipDocumentModel | null> {
  try {
    const slip = await opsGet("salary-slips", slipId);
    const contactResult = await getAdminSiteContactAction();
    const contact =
      contactResult.ok
        ? contactResult.data
        : {
            phone: "",
            email: "",
            addressLines: [] as readonly string[],
          };
    return {
      employeeName: String(slip.employeeName ?? ""),
      designation: String(slip.designation ?? ""),
      slipDate: String(slip.slipDate ?? ""),
      salaryMonth: String(slip.salaryMonth ?? ""),
      basicSalary: String(slip.basicSalary ?? ""),
      punctuality: String(slip.punctuality ?? ""),
      medicalAllowance: String(slip.medicalAllowance ?? ""),
      incentives: String(slip.incentives ?? ""),
      bonus: String(slip.bonus ?? ""),
      advance: String(slip.advance ?? ""),
      incomeTax: String(slip.incomeTax ?? ""),
      whTax: String(slip.whTax ?? ""),
      fuelAdvances: String(slip.fuelAdvances ?? ""),
      unpaidDays: String(slip.unpaidDays ?? ""),
      totalEarnings: String(slip.totalEarnings ?? ""),
      totalDeduction: String(slip.totalDeduction ?? ""),
      netSalary: String(slip.netSalary ?? ""),
      currency: String(slip.currency ?? "USD"),
      status: String(slip.status ?? "") === "issued" ? "issued" : "draft",
      company: {
        legalName: String(slip.fromCompany ?? ""),
        email: String(slip.fromEmail ?? ""),
        phone: String(slip.fromPhone ?? ""),
      },
      footer: {
        phone: contact.phone,
        email: contact.email,
        locationLines: [...contact.addressLines],
      },
    };
  } catch {
    return null;
  }
}

export async function markAdminContactMessageReadAction(input: {
  id: string;
}): Promise<{ readonly ok: true; readonly message: Record<string, unknown> } | Fail> {
  try {
    const message = await backendAdminMutate<Record<string, unknown>>(
      `/api/admin/enquiries/${input.id}`,
      "PATCH",
      { status: "read" },
    );
    return { ok: true, message };
  } catch {
    return fail("server");
  }
}

export async function deleteAdminContactMessageAction(input: {
  id: string;
}): Promise<{ readonly ok: true } | Fail> {
  try {
    await backendAdminMutate(`/api/admin/enquiries/${input.id}`, "PATCH", {
      status: "archived",
    });
    return { ok: true };
  } catch {
    return fail("server");
  }
}
