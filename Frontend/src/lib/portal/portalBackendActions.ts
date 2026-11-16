"use server";

import type { AdminServicePageListItem, FailReason, SiteContactPublic } from "@/lib/portal/types";
import { backendAdminGet, backendAdminMutate, backendFetch } from "@/server/backend/client";

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
