"use client";

import {
  FACTORY_DOCUMENT_TYPES,
  FACTORY_RISK_LEVELS,
  FACTORY_VALIDITY_STATUSES,
  FACTORY_VERIFICATION_STATUSES,
} from "../factory.constants";

import type {
  FactoryDocumentType,
  FactoryFilterState,
  FactoryRiskLevel,
  FactoryValidityStatus,
  FactoryVerificationStatus,
} from "../factory.types";

type FactoryToolbarProps = {
  filters: FactoryFilterState;

  onSearchChange: (
    value: string,
  ) => void;

  onDocumentTypeChange: (
    value:
      | FactoryDocumentType
      | "all",
  ) => void;

  onVerificationChange: (
    value:
      | FactoryVerificationStatus
      | "all",
  ) => void;

  onValidityChange: (
    value:
      | FactoryValidityStatus
      | "all",
  ) => void;

  onRiskChange: (
    value:
      | FactoryRiskLevel
      | "all",
  ) => void;

  onAddDocument: () => void;
};

export default function FactoryToolbar({
  filters,
  onSearchChange,
  onDocumentTypeChange,
  onVerificationChange,
  onValidityChange,
  onRiskChange,
  onAddDocument,
}: FactoryToolbarProps) {
  return (
    <section className="mb-6 min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <input
            value={filters.search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search factory document, number, authority..."
            className="min-w-0 rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30 sm:col-span-2 lg:col-span-3 xl:col-span-1"
          />

          <Select
            value={filters.documentType}
            onChange={(value) =>
              onDocumentTypeChange(
                value as
                  | FactoryDocumentType
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Documents",
              },
              ...FACTORY_DOCUMENT_TYPES.map(
                (item) => ({
                  value: item.value,
                  label: item.label,
                }),
              ),
            ]}
          />

          <Select
            value={
              filters.verificationStatus
            }
            onChange={(value) =>
              onVerificationChange(
                value as
                  | FactoryVerificationStatus
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Verification",
              },
              ...FACTORY_VERIFICATION_STATUSES,
            ]}
          />

          <Select
            value={
              filters.validityStatus
            }
            onChange={(value) =>
              onValidityChange(
                value as
                  | FactoryValidityStatus
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Validity",
              },
              ...FACTORY_VALIDITY_STATUSES,
            ]}
          />

          <Select
            value={filters.riskLevel}
            onChange={(value) =>
              onRiskChange(
                value as
                  | FactoryRiskLevel
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Risk",
              },
              ...FACTORY_RISK_LEVELS,
            ]}
          />
        </div>

        <button
          type="button"
          onClick={onAddDocument}
          className="w-full shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#031020] transition hover:brightness-110 xl:w-auto"
        >
          + Add Document
        </button>
      </div>
    </section>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value,
        )
      }
      className="min-w-0 w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
