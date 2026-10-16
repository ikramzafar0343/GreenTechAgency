export const cmsCardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export const cmsBtnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-[0.85rem] font-bold text-cream transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50";

export const cmsBtnSecondary =
  "inline-flex items-center justify-center rounded-xl border-2 border-secondary bg-white px-3 py-1.5 text-[0.82rem] font-bold text-[#0d120b] transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50";

export const cmsBtnDanger =
  "inline-flex items-center justify-center rounded-xl border-2 border-black/15 bg-white px-3 py-1.5 text-[0.82rem] font-bold text-black/70 transition-colors hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50";

export function docTitle(row: { draftDoc: Record<string, unknown> }): string {
  const title =
    row.draftDoc.title ??
    row.draftDoc.question ??
    row.draftDoc.companyName ??
    row.draftDoc.label ??
    row.draftDoc.reviewerName;
  return typeof title === "string" && title.trim() ? title : "(Untitled)";
}

export function statusBadgeClass(status: string): string {
  if (status === "published") {
    return "bg-brand/15 text-brand-deep";
  }
  if (status === "archived") {
    return "bg-black/8 text-black/55";
  }
  return "bg-secondary/30 text-[#0d120b]";
}
