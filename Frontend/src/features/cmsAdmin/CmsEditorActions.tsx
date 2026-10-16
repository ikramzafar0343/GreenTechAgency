"use client";

import Link from "next/link";
import {
  cmsBtnDanger,
  cmsBtnPrimary,
  cmsBtnSecondary,
} from "@/features/cmsAdmin/cmsUi";
import type { ContentStatus } from "@/features/cmsAdmin/types";

type CmsEditorActionsProps = {
  readonly backHref: string;
  readonly status: ContentStatus;
  readonly pending: boolean;
  readonly dirty: boolean;
  readonly onSave: () => void;
  readonly onPublish: () => void;
  readonly onUnpublish: () => void;
  readonly onArchive: () => void;
  readonly onDelete: () => void;
  /** When true, Delete is shown for published items too (default: drafts/archived only). */
  readonly allowDeleteWhenPublished?: boolean;
  readonly sticky?: boolean;
};

export function CmsEditorActions({
  backHref,
  status,
  pending,
  dirty,
  onSave,
  onPublish,
  onUnpublish,
  onArchive,
  onDelete,
  allowDeleteWhenPublished = false,
  sticky = false,
}: CmsEditorActionsProps) {
  const canEdit = status !== "archived";
  const shellClass = sticky
    ? "sticky top-0 z-20 -mx-1 flex flex-wrap items-center gap-2 border-b border-black/8 bg-[#f4f6f1]/95 px-1 py-3 backdrop-blur-sm"
    : "flex flex-wrap items-center gap-2";

  return (
    <div className={shellClass}>
      <Link href={backHref} className={cmsBtnSecondary}>
        Back
      </Link>
      {canEdit ? (
        <button
          type="button"
          className={cmsBtnPrimary}
          disabled={pending || !dirty}
          onClick={onSave}
        >
          {pending && dirty ? "Saving…" : "Save"}
        </button>
      ) : null}
      {status === "published" ? (
        <>
          {dirty ? (
            <button
              type="button"
              className={cmsBtnPrimary}
              disabled={pending}
              onClick={onPublish}
            >
              Save & publish
            </button>
          ) : null}
          <button
            type="button"
            className={cmsBtnSecondary}
            disabled={pending}
            onClick={onUnpublish}
          >
            Unpublish
          </button>
        </>
      ) : status !== "archived" ? (
        <button
          type="button"
          className={cmsBtnSecondary}
          disabled={pending}
          onClick={onPublish}
        >
          Publish
        </button>
      ) : null}
      {status !== "archived" ? (
        <button
          type="button"
          className={cmsBtnDanger}
          disabled={pending}
          onClick={onArchive}
        >
          Archive
        </button>
      ) : null}
      {allowDeleteWhenPublished || status !== "published" ? (
        <button
          type="button"
          className={cmsBtnDanger}
          disabled={pending}
          onClick={onDelete}
        >
          Delete
        </button>
      ) : null}
      {dirty ? (
        <span className="text-[0.8rem] font-semibold text-black/45">
          Unsaved changes
        </span>
      ) : null}
    </div>
  );
}
