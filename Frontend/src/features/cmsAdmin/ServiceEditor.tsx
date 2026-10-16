"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import { findAdminEntityBySlug } from "@/features/cmsAdmin/resolveBySlug";
import {
  ServiceEditorForm,
  type ServiceFormState,
} from "@/features/cmsAdmin/ServiceEditorForm";
import { SubservicesPanel } from "@/features/cmsAdmin/SubservicesPanel";
import type { ServiceAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

function pairSide(
  doc: Record<string, unknown>,
  pairKey: "pairA" | "pairB",
  side: "left" | "right",
  defaults: {
    path: string;
    alt: string;
    title: string;
    caption: string;
  },
) {
  const pair = (doc[pairKey] ?? {}) as Record<string, unknown>;
  const image = (pair[side] ?? {}) as Record<string, unknown>;
  return {
    path: String(image.path ?? image.src ?? defaults.path),
    alt: String(image.alt ?? defaults.alt),
    tileTitle: String(image.tileTitle ?? defaults.title),
    tileCaption: String(image.tileCaption ?? defaults.caption),
  };
}

function formFromRow(row: ServiceAdminRow): ServiceFormState {
  const doc = row.draftDoc;
  const paragraphs = Array.isArray(doc.storyParagraphs)
    ? (doc.storyParagraphs as string[]).join("\n")
    : "";
  const principles = Array.isArray(doc.principles)
    ? (doc.principles as Array<{ title?: string; body?: string }>)
        .map((item) => `${item.title ?? ""}|${item.body ?? ""}`.trim())
        .filter(Boolean)
        .join("\n")
    : "";
  const relatedSlugs = Array.isArray(doc.relatedSlugs)
    ? (doc.relatedSlugs as string[]).join(", ")
    : "";
  const pairALeft = pairSide(doc, "pairA", "left", {
    path: "/services/editorial/pair-a-left.svg",
    alt: "Team discussion at a workstation",
    title: "Discussion",
    caption: "EDITORIAL DEMO",
  });
  const pairARight = pairSide(doc, "pairA", "right", {
    path: "/services/editorial/pair-a-right.svg",
    alt: "Close detail of interface design work",
    title: "Detail",
    caption: "EDITORIAL DEMO",
  });
  const pairBLeft = pairSide(doc, "pairB", "left", {
    path: "/services/editorial/pair-b-left.svg",
    alt: "Craft and environment detail",
    title: "Craft",
    caption: "EDITORIAL DEMO",
  });
  const pairBRight = pairSide(doc, "pairB", "right", {
    path: "/services/editorial/pair-b-right.svg",
    alt: "Collaborative working session",
    title: "Collaborate",
    caption: "EDITORIAL DEMO",
  });
  return {
    slug: row.draftSlug,
    title: String(doc.title ?? ""),
    label: String(doc.label ?? doc.title ?? ""),
    shortDescription: String(doc.shortDescription ?? ""),
    heroHeadline: String(doc.heroHeadline ?? doc.title ?? ""),
    heroIntro: String(doc.heroIntro ?? doc.shortDescription ?? ""),
    storyParagraphs: paragraphs,
    storyLabel: String(doc.storyLabel ?? ""),
    storyCtaLabel: String(doc.storyCtaLabel ?? ""),
    storyCtaHref: String(doc.storyCtaHref ?? "/contact"),
    leadImagePath: String(doc.leadImagePath ?? ""),
    leadImageAlt: String(doc.leadImageAlt ?? ""),
    cardImagePath: String(doc.cardImagePath ?? ""),
    cardImageAlt: String(doc.cardImageAlt ?? ""),
    deliveryRailImagePath: String(
      doc.deliveryRailImagePath ?? "/services/editorial/rail-photo.svg",
    ),
    deliveryRailImageAlt: String(
      doc.deliveryRailImageAlt ?? "Delivery detail photograph",
    ),
    deliveryRailTileTitle: String(doc.deliveryRailTileTitle ?? "Delivery"),
    deliveryRailTileCaption: String(
      doc.deliveryRailTileCaption ?? "EDITORIAL DEMO",
    ),
    pairALeftPath: pairALeft.path,
    pairALeftAlt: pairALeft.alt,
    pairALeftTileTitle: pairALeft.tileTitle,
    pairALeftTileCaption: pairALeft.tileCaption,
    pairARightPath: pairARight.path,
    pairARightAlt: pairARight.alt,
    pairARightTileTitle: pairARight.tileTitle,
    pairARightTileCaption: pairARight.tileCaption,
    pairBLeftPath: pairBLeft.path,
    pairBLeftAlt: pairBLeft.alt,
    pairBLeftTileTitle: pairBLeft.tileTitle,
    pairBLeftTileCaption: pairBLeft.tileCaption,
    pairBRightPath: pairBRight.path,
    pairBRightAlt: pairBRight.alt,
    pairBRightTileTitle: pairBRight.tileTitle,
    pairBRightTileCaption: pairBRight.tileCaption,
    principlesText: principles,
    relatedSlugsText: relatedSlugs,
    relatedHeading: String(doc.relatedHeading ?? ""),
    relatedIntro: String(doc.relatedIntro ?? ""),
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    featured: row.featured,
    sortOrder: row.sortOrder,
  };
}

function buildDoc(base: Record<string, unknown>, form: ServiceFormState) {
  const storyParagraphs = form.storyParagraphs
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const principles = form.principlesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title, ...rest] = line.split("|");
      return {
        id: `principle-${index + 1}`,
        title: (title ?? "").trim(),
        body: rest.join("|").trim(),
      };
    })
    .filter((item) => item.title && item.body);
  const relatedSlugs = form.relatedSlugsText
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
  return {
    ...base,
    title: form.title.trim(),
    label: form.label.trim() || form.title.trim(),
    shortDescription: form.shortDescription.trim(),
    heroHeadline: form.heroHeadline.trim() || form.title.trim(),
    heroIntro: form.heroIntro.trim() || form.shortDescription.trim(),
    storyParagraphs,
    storyLabel: form.storyLabel.trim() || `About ${form.title.trim()}`,
    storyCtaLabel: form.storyCtaLabel.trim() || "Talk about your project",
    storyCtaHref: form.storyCtaHref.trim() || "/contact",
    leadImagePath: form.leadImagePath.trim() || null,
    leadImageAlt: form.leadImageAlt.trim(),
    cardImagePath: form.cardImagePath.trim() || null,
    cardImageAlt: form.cardImageAlt.trim(),
    deliveryRailImagePath: form.deliveryRailImagePath.trim() || null,
    deliveryRailImageAlt: form.deliveryRailImageAlt.trim(),
    deliveryRailTileTitle: form.deliveryRailTileTitle.trim() || "Delivery",
    deliveryRailTileCaption:
      form.deliveryRailTileCaption.trim() || "EDITORIAL DEMO",
    pairA: {
      left: {
        path: form.pairALeftPath.trim() || null,
        alt: form.pairALeftAlt.trim(),
        tileTitle: form.pairALeftTileTitle.trim() || "Discussion",
        tileCaption: form.pairALeftTileCaption.trim() || "EDITORIAL DEMO",
      },
      right: {
        path: form.pairARightPath.trim() || null,
        alt: form.pairARightAlt.trim(),
        tileTitle: form.pairARightTileTitle.trim() || "Detail",
        tileCaption: form.pairARightTileCaption.trim() || "EDITORIAL DEMO",
      },
    },
    pairB: {
      left: {
        path: form.pairBLeftPath.trim() || null,
        alt: form.pairBLeftAlt.trim(),
        tileTitle: form.pairBLeftTileTitle.trim() || "Craft",
        tileCaption: form.pairBLeftTileCaption.trim() || "EDITORIAL DEMO",
      },
      right: {
        path: form.pairBRightPath.trim() || null,
        alt: form.pairBRightAlt.trim(),
        tileTitle: form.pairBRightTileTitle.trim() || "Collaborate",
        tileCaption: form.pairBRightTileCaption.trim() || "EDITORIAL DEMO",
      },
    },
    principles,
    relatedSlugs,
    relatedHeading: form.relatedHeading.trim(),
    relatedIntro: form.relatedIntro.trim(),
    seoTitle: form.seoTitle.trim() || null,
    seoDescription: form.seoDescription.trim() || null,
  };
}

type ServiceEditorProps = {
  readonly slug: string;
};

export function ServiceEditor({ slug }: ServiceEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<ServiceAdminRow | null>(null);
  const [form, setForm] = useState<ServiceFormState | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const found = await findAdminEntityBySlug<ServiceAdminRow>(
          "/api/admin/services",
          slug,
        );
        if (!found) {
          setError("Service not found.");
          return;
        }
        const fresh = await cmsAdminFetch<ServiceAdminRow>(
          `/api/admin/services/${found.id}`,
        );
        const nextForm = formFromRow(fresh);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load service.");
      }
    });
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => form !== null && JSON.stringify(form) !== baseline,
    [form, baseline],
  );
  useDirtyGuard(dirty);

  const runMutation = (fn: () => Promise<void>) => {
    startTransition(async () => {
      setError(null);
      try {
        await fn();
        load();
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Request failed.");
      }
    });
  };

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<ServiceAdminRow>(
        `/api/admin/services/${row.id}`,
        {
          method: "PATCH",
          body: {
            version: row.version,
            slug: form.slug.trim(),
            featured: form.featured,
            sortOrder: form.sortOrder,
            doc: buildDoc(row.draftDoc, form),
          },
        },
      );
      const nextForm = formFromRow(updated);
      setRow(updated);
      setForm(nextForm);
      setBaseline(JSON.stringify(nextForm));
    });
  };

  const onPublish = () => {
    if (!row || !form) return;
    runMutation(async () => {
      if (dirty) {
        await cmsAdminFetch(`/api/admin/services/${row.id}`, {
          method: "PATCH",
          body: {
            version: row.version,
            slug: form.slug.trim(),
            featured: form.featured,
            sortOrder: form.sortOrder,
            doc: buildDoc(row.draftDoc, form),
          },
        });
      }
      const current = await cmsAdminFetch<ServiceAdminRow>(
        `/api/admin/services/${row.id}`,
      );
      await cmsAdminFetch(`/api/admin/services/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/services/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/services/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (!row || !window.confirm("Permanently delete this draft service?")) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/services/${row.id}`, { method: "DELETE" });
      router.push("/admin/services");
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Service" lede="Loading CMS service…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={form.title || "Service"}
        lede={`Draft slug: ${form.slug} · v${row.version}`}
      />
      <CmsEditorActions
        backHref="/admin/services"
        status={row.status}
        pending={pending}
        dirty={dirty}
        sticky
        onSave={onSave}
        onPublish={onPublish}
        onUnpublish={onUnpublish}
        onArchive={onArchive}
        onDelete={onDelete}
      />
      {error ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[0.9rem] font-medium text-black/70">
          {error}
        </p>
      ) : null}

      <ServiceEditorForm
        form={form}
        status={row.status}
        onChange={(key, value) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev))}
      />

      <SubservicesPanel serviceId={row.id} />

      <CmsEditorActions
        backHref="/admin/services"
        status={row.status}
        pending={pending}
        dirty={dirty}
        onSave={onSave}
        onPublish={onPublish}
        onUnpublish={onUnpublish}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </div>
  );
}
