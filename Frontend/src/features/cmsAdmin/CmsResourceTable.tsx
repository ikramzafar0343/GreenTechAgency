"use client";

import Link from "next/link";
import {
  cmsBtnDanger,
  cmsBtnPrimary,
  cmsBtnSecondary,
  cmsCardClass,
  docTitle,
  statusBadgeClass,
} from "@/features/cmsAdmin/cmsUi";
import type { CmsListRow } from "@/features/cmsAdmin/types";

type CmsResourceTableProps<T extends CmsListRow> = {
  readonly items: readonly T[];
  readonly pending: boolean;
  readonly reorder: boolean;
  readonly showSlug: boolean;
  readonly editHref: (item: T) => string;
  readonly onMove: (index: number, direction: -1 | 1) => void;
  readonly onPublish: (item: T) => void;
  readonly onUnpublish: (item: T) => void;
  readonly onArchive: (item: T) => void;
  readonly onDelete?: ((item: T) => void) | undefined;
};

export function CmsResourceTable<T extends CmsListRow>({
  items,
  pending,
  reorder,
  showSlug,
  editHref,
  onMove,
  onPublish,
  onUnpublish,
  onArchive,
  onDelete,
}: CmsResourceTableProps<T>) {
  return (
    <div className={cmsCardClass}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[0.88rem]">
          <thead>
            <tr className="border-b border-black/8 text-[0.78rem] font-bold uppercase tracking-wide text-black/45">
              <th className="px-4 py-3">Title</th>
              {showSlug ? <th className="px-4 py-3">Slug</th> : null}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={showSlug ? 4 : 3}
                  className="px-4 py-8 text-center text-black/45"
                >
                  {pending ? "Loading…" : "No items found."}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className="border-b border-black/6 last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#0d120b]">
                    <Link
                      href={editHref(item)}
                      className="hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                      {docTitle(item)}
                    </Link>
                  </td>
                  {showSlug ? (
                    <td className="px-4 py-3 font-mono text-[0.82rem] text-black/55">
                      {item.draftSlug ?? "—"}
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-lg px-2 py-0.5 text-[0.75rem] font-bold capitalize ${statusBadgeClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {reorder ? (
                        <>
                          <button
                            type="button"
                            className={cmsBtnSecondary}
                            disabled={pending || index === 0}
                            onClick={() => onMove(index, -1)}
                            aria-label="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className={cmsBtnSecondary}
                            disabled={pending || index === items.length - 1}
                            onClick={() => onMove(index, 1)}
                            aria-label="Move down"
                          >
                            ↓
                          </button>
                        </>
                      ) : null}
                      <Link href={editHref(item)} className={cmsBtnSecondary}>
                        Edit
                      </Link>
                      {item.status === "published" ? (
                        <button
                          type="button"
                          className={cmsBtnSecondary}
                          disabled={pending}
                          onClick={() => onUnpublish(item)}
                        >
                          Unpublish
                        </button>
                      ) : item.status !== "archived" ? (
                        <button
                          type="button"
                          className={cmsBtnPrimary}
                          disabled={pending}
                          onClick={() => onPublish(item)}
                        >
                          Publish
                        </button>
                      ) : null}
                      {item.status !== "archived" ? (
                        <button
                          type="button"
                          className={cmsBtnDanger}
                          disabled={pending}
                          onClick={() => onArchive(item)}
                        >
                          Archive
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          type="button"
                          className={cmsBtnDanger}
                          disabled={pending}
                          onClick={() => onDelete(item)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
