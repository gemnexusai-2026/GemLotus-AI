"use client";

import {
  EVIDENCE_CATEGORIES,
  EVIDENCE_RISK_LEVELS,
  EVIDENCE_TYPES,
  EVIDENCE_VALIDITY_STATUSES,
  EVIDENCE_VERIFICATION_STATUSES,
} from "../evidence.constants";

import type {
  EvidenceCategory,
  EvidenceFilterState,
  EvidenceRiskLevel,
  EvidenceType,
  EvidenceValidityStatus,
  EvidenceVerificationStatus,
} from "../evidence.types";

type EvidenceToolbarProps = {
  filters: EvidenceFilterState;

  onSearchChange: (
    value: string,
  ) => void;

  onCategoryChange: (
    value: EvidenceCategory | "all",
  ) => void;

  onTypeChange: (
    value: EvidenceType | "all",
  ) => void;

  onVerificationChange: (
    value:
      | EvidenceVerificationStatus
      | "all",
  ) => void;

  onValidityChange: (
    value:
      | EvidenceValidityStatus
      | "all",
  ) => void;

  onRiskChange: (
    value: EvidenceRiskLevel | "all",
  ) => void;

  onAddEvidence: () => void;
};

export default function EvidenceToolbar({
  filters,
  onSearchChange,
  onCategoryChange,
  onTypeChange,
  onVerificationChange,
  onValidityChange,
  onRiskChange,
  onAddEvidence,
}: EvidenceToolbarProps) {
  return (
    <section className="mb-6 min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <input
            value={filters.search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search evidence, document, authority..."
            className="min-w-0 rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30 sm:col-span-2 lg:col-span-3 xl:col-span-2"
          />

          <Select
            value={filters.category}
            onChange={(value) =>
              onCategoryChange(
                value as EvidenceCategory | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Categories",
              },
              ...EVIDENCE_CATEGORIES.map(
                (item) => ({
                  value: item.value,
                  label: item.label,
                }),
              ),
            ]}
          />

          <Select
            value={filters.type}
            onChange={(value) =>
              onTypeChange(
                value as EvidenceType | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Types",
              },
              ...EVIDENCE_TYPES,
            ]}
          />

          <Select
            value={filters.verificationStatus}
            onChange={(value) =>
              onVerificationChange(
                value as
                  | EvidenceVerificationStatus
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Verification",
              },
              ...EVIDENCE_VERIFICATION_STATUSES,
            ]}
          />

          <Select
            value={filters.validityStatus}
            onChange={(value) =>
              onValidityChange(
                value as
                  | EvidenceValidityStatus
                  | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Validity",
              },
              ...EVIDENCE_VALIDITY_STATUSES,
            ]}
          />

          <Select
            value={filters.riskLevel}
            onChange={(value) =>
              onRiskChange(
                value as EvidenceRiskLevel | "all",
              )
            }
            options={[
              {
                value: "all",
                label: "All Risk",
              },
              ...EVIDENCE_RISK_LEVELS,
            ]}
          />
        </div>

        <button
          type="button"
          onClick={onAddEvidence}
          className="w-full shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#031020] transition hover:brightness-110 xl:w-auto"
        >
          + Add Evidence
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
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
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
