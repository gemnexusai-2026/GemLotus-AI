"use client";

import {
COMPANY_VALIDITY_STATUSES,
  COMPANY_VERIFICATION_STATUSES,
} from "../company.constants";

import type {
  CompanyDocument,
CompanyValidityStatus,
  CompanyVerificationStatus,
} from "../company.types";

type CompanyVerificationProps = {
  document: CompanyDocument;

  onChange: (
    patch: Partial<CompanyDocument>,
  ) => void;
};

export default function CompanyVerification({
  document,
  onChange,
}: CompanyVerificationProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Document Control
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Verification & Validity
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Verify authenticity, validity, current
          status, risk and assessor ownership of
          the selected legal document.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Select
          label="Verification Status"
          value={
            document.verificationStatus
          }
          onChange={(value) =>
            onChange({
              verificationStatus:
                value as CompanyVerificationStatus,
            })
          }
          options={
            COMPANY_VERIFICATION_STATUSES
          }
        />

        <Select
          label="Validity Status"
          value={
            document.validityStatus
          }
          onChange={(value) =>
            onChange({
              validityStatus:
                value as CompanyValidityStatus,
            })
          }
          options={
            COMPANY_VALIDITY_STATUSES
          }
        />

        <Field
          label="Document Name"
          value={
            document.documentName
          }
          onChange={(value) =>
            onChange({
              documentName: value,
            })
          }
          placeholder="PAN / GST / Udyam / License..."
        />

        <Field
          label="Document Number"
          value={
            document.documentNumber
          }
          onChange={(value) =>
            onChange({
              documentNumber: value,
            })
          }
          placeholder="Registration / certificate number"
        />

        <Field
          label="Issuing Authority"
          value={
            document.issuingAuthority
          }
          onChange={(value) =>
            onChange({
              issuingAuthority: value,
            })
          }
          placeholder="Issuing authority"
        />

        <Field
          label="Verified By"
          value={document.verifiedBy}
          onChange={(value) =>
            onChange({
              verifiedBy: value,
            })
          }
          placeholder="Assessor / reviewer"
        />

        <Field
          label="Issue Date"
          type="date"
          value={document.issueDate}
          onChange={(value) =>
            onChange({
              issueDate: value,
            })
          }
        />

        <Field
          label="Expiry Date"
          type="date"
          value={document.expiryDate}
          onChange={(value) =>
            onChange({
              expiryDate: value,
            })
          }
        />

        <Field
          label="Verification Date"
          type="date"
          value={
            document.verificationDate
          }
          onChange={(value) =>
            onChange({
              verificationDate: value,
            })
          }
        />

        <div className="sm:col-span-2">
          <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
                  Current Document
                </div>

                <div className="mt-2 text-sm font-semibold text-white/60">
                  {document.isCurrent
                    ? "Current"
                    : "Review Required"}
                </div>

                <div className="mt-1 text-[9px] text-white/25">
                  Mark whether this document
                  represents the currently
                  applicable legal evidence.
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    isCurrent:
                      !document.isCurrent,
                  })
                }
                className={`rounded-full border px-4 py-2 text-[8px] font-bold uppercase tracking-[0.12em] transition ${
                  document.isCurrent
                    ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300"
                    : "border-amber-300/20 bg-amber-300/[0.05] text-amber-300"
                }`}
              >
                {document.isCurrent
                  ? "Current"
                  : "Not Current"}
              </button>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Verification Remarks"
            value={document.remarks}
            onChange={(value) =>
              onChange({
                remarks: value,
              })
            }
            placeholder="Record authenticity checks, verification observations and review notes..."
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
  onChange: (
    value: string,
  ) => void;
  options: {
    value: string;
    label: string;
    description?: string;
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
          onChange(
            event.target.value,
          )
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
  onChange: (
    value: string,
  ) => void;
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
          onChange(
            event.target.value,
          )
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
  onChange: (
    value: string,
  ) => void;
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
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}

