"use client";

import {
  COMPANY_DOCUMENT_TYPES,
  COMPANY_RISK_LEVELS,
  COMPANY_VALIDITY_STATUSES,
  COMPANY_VERIFICATION_STATUSES,
} from "../company.constants";

import type {
  CompanyDocumentType,
  CompanyFilterState,
  CompanyRiskLevel,
  CompanyValidityStatus,
  CompanyVerificationStatus,
} from "../company.types";

type CompanyToolbarProps = {
  filters: CompanyFilterState;

  onSearchChange: (
    value: string,
  ) => void;

  onDocumentTypeChange: (
    value:
      | CompanyDocumentType
      | "all",
  ) => void;

  onVerificationChange: (
    value:
      | CompanyVerificationStatus
      | "all",
  ) => void;

  onValidityChange: (
    value:
      | CompanyValidityStatus
      | "all",
  ) => void;

  onRiskChange: (
    value:
      | CompanyRiskLevel
      | "all",
  ) => void;

  onAddDocument: () => void;
};

export default function CompanyToolbar({
  filters,
  onSearchChange,
  onDocumentTypeChange,
  onVerificationChange,
  onValidityChange,
  onRiskChange,
  onAddDocument,
}: CompanyToolbarProps) {
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
            placeholder="Search legal document, number, authority..."
            className="min-w-0 rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30 sm:col-span-2 lg:col-span-3 xl:col-span-1"
          />

          <Select
            value={filters.documentType}
            onChange={(value) =>
              onDocumentTypeChange(
                value as
                  | CompanyDocumentType
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Documents",
              },
              ...COMPANY_DOCUMENT_TYPES.map(
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
                  | CompanyVerificationStatus
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Verification",
              },
              ...COMPANY_VERIFICATION_STATUSES,
            ]}
          />

          <Select
            value={
              filters.validityStatus
            }
            onChange={(value) =>
              onValidityChange(
                value as
                  | CompanyValidityStatus
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Validity",
              },
              ...COMPANY_VALIDITY_STATUSES,
            ]}
          />

          <Select
            value={filters.riskLevel}
            onChange={(value) =>
              onRiskChange(
                value as
                  | CompanyRiskLevel
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Risk",
              },
              ...COMPANY_RISK_LEVELS,
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
