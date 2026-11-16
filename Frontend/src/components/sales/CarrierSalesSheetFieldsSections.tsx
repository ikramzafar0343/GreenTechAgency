"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { saleCurrencies } from "@/constants/sales";
import { type CarrierSalesSheetFieldsModel, setField, TaxIdRevealControls } from "./CarrierSalesSheetFieldsModel";

export function CarrierSalesSheetFieldsSection1({ model }: { model: CarrierSalesSheetFieldsModel }) {
  const { value, onChange, taxIdEditMode, carrierId, salesAgentLocked } = model;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block">
              <span className={adminLabelClass}>DBA</span>
              <input
              className={adminFieldClass}
              value={value.dba}
              onChange={(event) =>
                onChange(setField(value, "dba", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Business address</span>
              <input
              className={adminFieldClass}
              value={value.businessAddress}
              onChange={(event) =>
                onChange(setField(value, "businessAddress", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Owner operator driver</span>
              <input
              className={adminFieldClass}
              value={value.ownerOperatorDriver}
              onChange={(event) =>
                onChange(
                  setField(value, "ownerOperatorDriver", event.target.value),
                )
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>
                Tax ID{taxIdEditMode ? "" : " *"}
              </span>
              <input
              className={adminFieldClass}
              value={value.taxId}
              autoComplete="off"
              placeholder={taxIdEditMode ? "Leave unchanged or enter new" : undefined}
              onChange={(event) =>
                onChange(setField(value, "taxId", event.target.value))
              }
            />
            </label>
            {taxIdEditMode && carrierId ? (
              <TaxIdRevealControls key={carrierId} carrierId={carrierId} />
            ) : null}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block">
              <span className={adminLabelClass}>Sales agent</span>
              <input
              className={adminFieldClass}
              value={value.salesAgent}
              readOnly={salesAgentLocked}
              onChange={(event) =>
                onChange(setField(value, "salesAgent", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Business telephone</span>
              <input
              className={adminFieldClass}
              value={value.businessTelephone}
              onChange={(event) =>
                onChange(
                  setField(value, "businessTelephone", event.target.value),
                )
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Truck type</span>
              <input
              className={adminFieldClass}
              value={value.truckType}
              onChange={(event) =>
                onChange(setField(value, "truckType", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Amount *</span>
              <input
              className={adminFieldClass}
              inputMode="decimal"
              required
              value={value.amount}
              onChange={(event) =>
                onChange(setField(value, "amount", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Currency *</span>
              <select
              className={adminFieldClass}
              required
              value={value.currency}
              onChange={(event) =>
                onChange(setField(value, "currency", event.target.value))
              }
            >
              <option value="">Select currency</option>
              {saleCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            </label>
          </div>
        </div>
      </div>
  );
}

export function CarrierSalesSheetFieldsSection2({ model }: { model: CarrierSalesSheetFieldsModel }) {
  const { value, onChange } = model;
  return (
    <div className="space-y-4">
        <h3 className="text-[0.84rem] font-extrabold tracking-[0.14em] text-[#0d120b] uppercase">
          Insurance company details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block">
              <span className={adminLabelClass}>Name</span>
              <input
              className={adminFieldClass}
              value={value.insuranceName}
              onChange={(event) =>
                onChange(setField(value, "insuranceName", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Phone</span>
              <input
              className={adminFieldClass}
              value={value.insurancePhone}
              onChange={(event) =>
                onChange(setField(value, "insurancePhone", event.target.value))
              }
            />
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="block">
              <span className={adminLabelClass}>Street address</span>
              <input
              className={adminFieldClass}
              value={value.insuranceStreet}
              onChange={(event) =>
                onChange(setField(value, "insuranceStreet", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>City, state, zip</span>
              <input
              className={adminFieldClass}
              value={value.insuranceCityStateZip}
              onChange={(event) =>
                onChange(
                  setField(value, "insuranceCityStateZip", event.target.value),
                )
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Email</span>
              <input
              type="email"
              className={adminFieldClass}
              value={value.insuranceEmail}
              onChange={(event) =>
                onChange(setField(value, "insuranceEmail", event.target.value))
              }
            />
            </label>
          </div>
        </div>
      </div>
  );
}
