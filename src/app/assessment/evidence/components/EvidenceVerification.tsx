"use client";

import {
  EVIDENCE_RISK_LEVELS,
  EVIDENCE_VALIDITY_STATUSES,
  EVIDENCE_VERIFICATION_STATUSES,
} from "../evidence.constants";

import type {
  EvidenceRecord,
  EvidenceRiskLevel,
  EvidenceValidityStatus,
  EvidenceVerificationStatus,
} from "../evidence.types";

type EvidenceVerificationProps = {
  evidence: EvidenceRecord;

  onChange: (
    patch: Partial<EvidenceRecord>,
  ) => void;
};

export default function EvidenceVerification({
  evidence,
  onChange,
}: EvidenceVerificationProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Evidence Control
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Verification & Validity
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Verify evidence authenticity, current
          validity, risk and assessor ownership.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Select
          label="Verification Status"
          value={
            evidence.verificationStatus
          }
          onChange={(value) =>
            onChange({
              verificationStatus:
                value as EvidenceVerificationStatus,
            })
          }
          options={
            EVIDENCE_VERIFICATION_STATUSES
          }
        />

        <Select
          label="Validity Status"
          value={
            evidence.validityStatus
          }
          onChange={(value) =>
            onChange({
              validityStatus:
                value as EvidenceValidityStatus,
            })
          }
          options={
            EVIDENCE_VALIDITY_STATUSES
          }
        />

        <Select
          label="Risk Level"
          value={evidence.riskLevel}
          onChange={(value) =>
            onChange({
              riskLevel:
                value as EvidenceRiskLevel,
            })
          }
          options={EVIDENCE_RISK_LEVELS}
        />

        <Field
          label="Verified By"
          value={evidence.verifiedBy}
          onChange={(value) =>
            onChange({
              verifiedBy: value,
            })
          }
          placeholder="Assessor / reviewer"
        />

        <Field
          label="Verification Date"
          type="date"
          value={
            evidence.verificationDate
          }
          onChange={(value) =>
            onChange({
              verificationDate: value,
            })
          }
        />

        <div className="flex items-end">
          <div className="w-full rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
            <div className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/25">
              Current Evidence
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white/60">
                  {evidence.isCurrent
                    ? "Current"
                    : "Review Required"}
                </div>

                <div className="mt-1 text-[9px] text-white/25">
                  {evidence.isCurrent
                    ? "Evidence is marked current."
                    : "Evidence should be reviewed for currency."}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    isCurrent:
                      !evidence.isCurrent,
                  })
                }
                className={`rounded-full border px-3 py-2 text-[8px] font-bold uppercase tracking-[0.12em] transition ${
                  evidence.isCurrent
                    ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300"
                    : "border-amber-300/20 bg-amber-300/[0.05] text-amber-300"
                }`}
              >
                {evidence.isCurrent
                  ? "Current"
                  : "Not Current"}
              </button>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Verification Remarks"
            value={evidence.remarks}
            onChange={(value) =>
              onChange({
                remarks: value,
              })
            }
            placeholder="Record verification observations, authenticity checks and review notes..."
          />
        </div>
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
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
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full min-w-0 rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}
