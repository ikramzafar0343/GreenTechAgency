"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { adminIcons } from "@/components/admin/AdminIcons";
import { emptyCarrierSaleFields, type CarrierSaleFields, normalizeSaleAmount } from "@/constants/sales";
import type { AdminSale, SaleStatus } from "@/lib/data/admin";
import { archiveSaleAction, createSaleSheetAction, updateSaleSheetAction } from "@/lib/submitCrm";

export const CarrierSalesSheetFields = dynamic(
  () =>
    import("@/components/sales/CarrierSalesSheetFields").then((mod) => ({
      default: mod.CarrierSalesSheetFields,
    })),
);

export const cardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export const statusPillClass: Record<SaleStatus, string> = {
  draft: "bg-black/8 text-black/50",
  quoted: "bg-[rgba(249,161,55,0.18)] text-[#e8891a]",
  won: "bg-brand/12 text-brand",
  lost: "bg-[rgba(47,58,40,0.12)] text-brand-deep",
};

export type SaleForm = CarrierSaleFields & {
  repId: string;
  status: SaleStatus;
};

export function fieldsFromSale(sale: AdminSale): SaleForm {
  return {
    repId: sale.repId,
    status: sale.status,
    usDot: sale.usDot,
    mc: sale.mc,
    legalName: sale.legalName,
    dba: sale.dba,
    businessAddress: sale.businessAddress,
    ownerOperatorDriver: sale.ownerOperatorDriver,
    taxId: sale.taxId,
    salesAgent: sale.salesAgent,
    businessTelephone: sale.businessTelephone,
    truckType: sale.truckType,
    amount: sale.amount,
    currency: sale.currency,
    contactName: sale.contactName,
    contactPhone: sale.contactPhone,
    contactEmail: sale.contactEmail,
    truck: sale.truck,
    trailer: sale.trailer,
    insuranceName: sale.insuranceName,
    insurancePhone: sale.insurancePhone,
    insuranceStreet: sale.insuranceStreet,
    insuranceCityStateZip: sale.insuranceCityStateZip,
    insuranceEmail: sale.insuranceEmail,
    factoringName: sale.factoringName,
    factoringPhone: sale.factoringPhone,
    factoringStreet: sale.factoringStreet,
    factoringCityStateZip: sale.factoringCityStateZip,
    factoringEmail: sale.factoringEmail,
    approvedBy: sale.approvedBy,
  };
}

export const emptyForm: SaleForm = {
  repId: "",
  status: "draft",
  ...emptyCarrierSaleFields,
};

export function isSaleFormValid(form: SaleForm, isCreate: boolean): boolean {
  const amount = normalizeSaleAmount(form.amount);
  if (
    !form.legalName.trim() ||
    !form.repId ||
    amount.length === 0 ||
    Number(amount) <= 0 ||
    form.currency.trim().length !== 3
  ) {
    return false;
  }
  if (isCreate && !form.taxId.trim()) {
    return false;
  }
  return true;
}

/** All state and handlers of <AdminSalesPage>; the component and its sections only render. */
export function useAdminSalesPage() {
  const { state, setSales } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<SaleForm>(emptyForm);
  const [pending, startTransition] = useTransition();

  const EditIcon = adminIcons.edit;
  const TrashIcon = adminIcons.trash;

  const salesEmployees = state.employees.filter(
    (item) => item.kind === "sales" && item.active,
  );

  const repName = (repId: string) =>
    state.employees.find((item) => item.id === repId)?.name;

  const filtered = state.sales.filter(
    (item) => statusFilter === "all" || item.status === statusFilter,
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: AdminSale) => {
    setEditingId(item.id);
    setForm(fieldsFromSale(item));
    setModalOpen(true);
  };

  const save = () => {
    const isCreate = editingId === null;
    if (!isSaleFormValid(form, isCreate)) {
      return;
    }

    const selectedRep = salesEmployees.find((item) => item.id === form.repId);
    if (!selectedRep) {
      return;
    }

    const { repId, status, ...carrierFields } = form;
    const fields: CarrierSaleFields = {
      ...carrierFields,
      legalName: form.legalName.trim(),
      salesAgent: form.salesAgent.trim() || selectedRep.name,
    };

    startTransition(async () => {
      if (editingId) {
        const existing = state.sales.find((item) => item.id === editingId);
        if (!existing) {
          return;
        }
        const result = await updateSaleSheetAction({
          id: editingId,
          version: existing.version,
          fields,
          status,
          taxIdMasked: existing.taxId,
        });
        if (result.ok && "data" in result) {
          setSales(
            state.sales.map((item) =>
              item.id === editingId ? result.data : item,
            ),
          );
          setModalOpen(false);
        }
        return;
      }

      const result = await createSaleSheetAction({
        repId,
        fields,
        status,
      });
      if (result.ok && "data" in result) {
        setSales([...state.sales, result.data]);
        setModalOpen(false);
      }
    });
  };

  const confirmDelete = () => {
    if (!deleteId) {
      return;
    }

    const target = state.sales.find((item) => item.id === deleteId);
    if (!target) {
      return;
    }

    startTransition(async () => {
      const result = await archiveSaleAction({
        id: deleteId,
        version: target.version,
      });
      if (result.ok) {
        setSales(state.sales.filter((item) => item.id !== deleteId));
        setDeleteOpen(false);
        setDeleteId(null);
      }
    });
  };

  const deleteTarget = state.sales.find((item) => item.id === deleteId);
  return { state, statusFilter, setStatusFilter, modalOpen, setModalOpen, deleteOpen, setDeleteOpen, editingId, setDeleteId, form, setForm, pending, EditIcon, TrashIcon, salesEmployees, repName, filtered, openAdd, openEdit, save, confirmDelete, deleteTarget };
}

export type AdminSalesPageModel = ReturnType<typeof useAdminSalesPage>;
