"use client";

import { useState } from "react";
import type { CarrierSaleFields } from "@/constants/sales";
import { revealCarrierTaxIdAction } from "@/lib/submitCrm";

export type CarrierSalesSheetFieldsProps = {
  readonly value: CarrierSaleFields;
  readonly onChange: (next: CarrierSaleFields) => void;
  readonly salesAgentLocked?: boolean;
  readonly taxIdEditMode?: boolean;
  readonly carrierId?: string | undefined;
};

export function setField<K extends keyof CarrierSaleFields>(
  value: CarrierSaleFields,
  key: K,
  fieldValue: CarrierSaleFields[K],
): CarrierSaleFields {
  return { ...value, [key]: fieldValue };
}

export function TaxIdRevealControls({
  carrierId,
}: Readonly<{ carrierId: string }>) {
  const [revealedTaxId, setRevealedTaxId] = useState<string | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);

  const onReveal = async () => {
    if (revealLoading) {
      return;
    }
    setRevealLoading(true);
    setRevealError(null);
    const result = await revealCarrierTaxIdAction({ carrierId });
    setRevealLoading(false);
    if (!result.ok) {
      setRevealedTaxId(null);
      setRevealError(
        result.reason === "unauthorized"
          ? "Not authorized to reveal Tax ID."
          : "Unable to reveal Tax ID.",
      );
      return;
    }
    setRevealedTaxId(result.data);
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {revealedTaxId === null ? (
          <button
            type="button"
            onClick={() => {
              void onReveal();
            }}
            disabled={revealLoading}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-[#0d120b] disabled:opacity-50"
          >
            {revealLoading ? "Revealing…" : "Reveal Tax ID"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setRevealedTaxId(null);
              setRevealError(null);
            }}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-[#0d120b]"
          >
            Hide Tax ID
          </button>
        )}
      </div>
      {revealedTaxId !== null ? (
        <p className="text-[0.84rem] font-medium text-[#0d120b]">
          Full Tax ID: {revealedTaxId}
        </p>
      ) : null}
      {revealError ? (
        <p className="text-[0.82rem] font-medium text-[#a33]">{revealError}</p>
      ) : null}
    </div>
  );
}

/** All state and handlers of <CarrierSalesSheetFields>; the component and its sections only render. */
export function useCarrierSalesSheetFields({
  value,
  onChange,
  salesAgentLocked = false,
  taxIdEditMode = false,
  carrierId,
}: CarrierSalesSheetFieldsProps) {

  return { value, onChange, taxIdEditMode, carrierId, salesAgentLocked };
}

export type CarrierSalesSheetFieldsModel = ReturnType<typeof useCarrierSalesSheetFields>;
