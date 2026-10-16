"use client";

import { useId, useRef, useState, useTransition } from "react";
import { adminLabelClass } from "@/components/admin/adminFormStyles";
import {
  CmsAdminError,
  cmsAdminUploadMedia,
} from "@/features/cmsAdmin/api";
import { cmsBtnDanger, cmsBtnSecondary } from "@/features/cmsAdmin/cmsUi";
import { cmsMediaSrc } from "@/lib/cmsMedia";
import { CMS_MEDIA_MAX_BYTES } from "@/lib/cmsMediaLimits";

type CmsImageFieldProps = {
  readonly label: string;
  readonly hint?: string;
  readonly value: string;
  readonly altValue: string;
  readonly locked?: boolean;
  readonly spanFull?: boolean;
  readonly onPathChange: (path: string) => void;
  readonly onAltChange: (alt: string) => void;
};

export function CmsImageField({
  label,
  hint,
  value,
  altValue,
  locked = false,
  spanFull = true,
  onPathChange,
  onAltChange,
}: CmsImageFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const previewSrc = cmsMediaSrc(value);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.type === "image/svg+xml") {
      setError("SVG uploads are not supported. Use JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > CMS_MEDIA_MAX_BYTES) {
      setError("Image must be 15 MB or smaller.");
      return;
    }
    startTransition(async () => {
      setError(null);
      setPreviewFailed(false);
      const formData = new FormData();
      formData.set("file", file);
      formData.set("visibility", "public");
      if (altValue.trim()) {
        formData.set("alt", altValue.trim());
      }
      try {
        const result = await cmsAdminUploadMedia(formData);
        onPathChange(result.url);
      } catch (err) {
        const message =
          err instanceof CmsAdminError
            ? err.message
            : "Could not upload image.";
        setError(message);
      }
    });
  };

  return (
    <div className={`${spanFull ? "md:col-span-2 " : ""}space-y-3`}>
      <div>
        <p className={adminLabelClass}>{label}</p>
        {hint ? (
          <p className="mt-1 text-[0.8rem] font-medium text-black/45">{hint}</p>
        ) : null}
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={locked || pending}
        onChange={(event) => {
          onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {error ? (
        <p className="text-[0.84rem] font-semibold text-red-700">{error}</p>
      ) : null}
      {previewSrc ? (
        <div className="space-y-3">
          <div className="relative flex h-48 w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#e8eef2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={previewSrc}
              src={previewSrc}
              alt={altValue || "Selected service image"}
              className="h-full w-full object-cover"
              onLoad={() => setPreviewFailed(false)}
              onError={() => setPreviewFailed(true)}
            />
            {previewFailed ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#e8eef2] px-4 text-center">
                <p className="text-[0.84rem] font-semibold text-[#0d120b]">
                  Preview unavailable
                </p>
                <p className="break-all text-[0.72rem] text-black/50">
                  {previewSrc}
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={cmsBtnSecondary}
              disabled={locked || pending}
              onClick={() => inputRef.current?.click()}
            >
              {pending ? "Uploading…" : "Replace image"}
            </button>
            <button
              type="button"
              className={cmsBtnDanger}
              disabled={locked || pending}
              onClick={() => {
                setPreviewFailed(false);
                onPathChange("");
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="inline-flex w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-black/20 bg-brand/8 px-4 py-10 text-[0.9rem] font-semibold text-[#0d120b] hover:bg-brand/14 disabled:opacity-40"
          disabled={locked || pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending ? "Uploading…" : "Upload image"}
        </button>
      )}
      <div>
        <label htmlFor={`${inputId}-alt`} className={adminLabelClass}>
          Image description (alt)
        </label>
        <input
          id={`${inputId}-alt`}
          value={altValue}
          onChange={(e) => onAltChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-black/12 bg-white px-3 py-2 text-[0.9rem]"
          disabled={locked}
        />
      </div>
    </div>
  );
}
