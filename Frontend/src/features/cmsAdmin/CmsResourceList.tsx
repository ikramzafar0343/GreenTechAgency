"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsListFilters } from "@/features/cmsAdmin/CmsListFilters";
import { CmsResourceTable } from "@/features/cmsAdmin/CmsResourceTable";
import { cmsBtnSecondary, docTitle } from "@/features/cmsAdmin/cmsUi";
import type {
  CmsListResponse,
  CmsListRow,
  ContentStatus,
} from "@/features/cmsAdmin/types";

const PAGE_SIZE = 20;

export type CmsResourceListProps<T extends CmsListRow> = {
  readonly title: string;
  readonly lede: string;
  readonly apiBase: string;
  readonly editHref: (item: T) => string;
  readonly reorder?: boolean;
  readonly showSlug?: boolean;
  readonly createLabel?: string;
  readonly onCreate?: () => Promise<void>;
  /** When set, shows a Delete action on each row. */
  readonly allowDelete?: boolean;
  readonly deleteConfirmMessage?: (item: T) => string;
};

export function CmsResourceList<T extends CmsListRow>({
  title,
  lede,
  apiBase,
  editHref,
  reorder = false,
  showSlug = true,
  createLabel,
  onCreate,
  allowDelete = false,
  deleteConfirmMessage,
}: CmsResourceListProps<T>) {
  const [items, setItems] = useState<readonly T[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ContentStatus | "">("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          offset: String(offset),
        });
        if (q.trim()) params.set("q", q.trim());
        if (status) params.set("status", status);
        const data = await cmsAdminFetch<CmsListResponse<T>>(
          `${apiBase}?${params.toString()}`,
        );
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load list.");
      }
    });
  }, [apiBase, offset, q, status]);

  useEffect(() => {
    load();
  }, [load]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageIndex = Math.floor(offset / PAGE_SIZE) + 1;

  const runAction = (fn: () => Promise<void>) => {
    startTransition(async () => {
      setError(null);
      try {
        await fn();
        load();
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Action failed.");
      }
    });
  };

  const onPublish = (item: T) =>
    runAction(() =>
      cmsAdminFetch(`${apiBase}/${item.id}/publish`, {
        method: "POST",
        body: { version: item.version },
      }),
    );

  const onUnpublish = (item: T) =>
    runAction(() =>
      cmsAdminFetch(`${apiBase}/${item.id}/unpublish`, {
        method: "POST",
        body: { version: item.version },
      }),
    );

  const onArchive = (item: T) =>
    runAction(() =>
      cmsAdminFetch(`${apiBase}/${item.id}/archive`, {
        method: "POST",
        body: { version: item.version },
      }),
    );

  const onDelete = (item: T) => {
    const message =
      deleteConfirmMessage?.(item) ??
      `Permanently delete “${docTitle(item)}”? This cannot be undone.`;
    if (!window.confirm(message)) return;
    runAction(() =>
      cmsAdminFetch(`${apiBase}/${item.id}`, {
        method: "DELETE",
      }),
    );
  };

  const onMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    const tmp = next[index];
    next[index] = next[target]!;
    next[target] = tmp!;
    runAction(async () => {
      await cmsAdminFetch(`${apiBase}/reorder`, {
        method: "POST",
        body: { orderedIds: next.map((row) => row.id) },
      });
    });
  };

  return (
    <div className="space-y-6">
      {onCreate && createLabel ? (
        <AdminPageHeader
          title={title}
          lede={lede}
          actionLabel={createLabel}
          onAction={() => runAction(onCreate)}
        />
      ) : (
        <AdminPageHeader title={title} lede={lede} />
      )}

      <CmsListFilters
        q={q}
        status={status}
        onQChange={(value) => {
          setOffset(0);
          setQ(value);
        }}
        onStatusChange={(value) => {
          setOffset(0);
          setStatus(value);
        }}
      />

      {error ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[0.9rem] font-medium text-black/70">
          {error}
        </p>
      ) : null}

      <CmsResourceTable
        items={items}
        pending={pending}
        reorder={reorder}
        showSlug={showSlug}
        editHref={editHref}
        onMove={onMove}
        onPublish={onPublish}
        onUnpublish={onUnpublish}
        onArchive={onArchive}
        onDelete={allowDelete ? onDelete : undefined}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.85rem] font-medium text-black/45">
          {total} total · page {pageIndex} of {pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={cmsBtnSecondary}
            disabled={pending || offset <= 0}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Previous
          </button>
          <button
            type="button"
            className={cmsBtnSecondary}
            disabled={pending || offset + PAGE_SIZE >= total}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
