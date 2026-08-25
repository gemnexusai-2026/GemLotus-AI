"use client";

import type { EvidenceRecord } from "../evidence.types";

type EvidenceDetailsProps = {
  evidence: EvidenceRecord;

  onChange: (
    patch: Partial<EvidenceRecord>,
  ) => void;
};

export default function EvidenceDetails({
  evidence,
  onChange,
}: EvidenceDetailsProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Evidence Identity
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Evidence Details
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Capture the identity, source,
          classification and linkage of the
          assessment evidence.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field
          label="Evidence Code"
          value={evidence.evidenceCode}
          onChange={(value) =>
            onChange({
              evidenceCode: value,
            })
          }
          placeholder="EV-001"
        />

        <Field
          label="Evidence Title"
          value={evidence.title}
          onChange={(value) =>
            onChange({
              title: value,
            })
          }
          placeholder="GST Certificate"
        />

        <Field
          label="Document Number"
          value={evidence.documentNumber}
          onChange={(value) =>
            onChange({
              documentNumber: value,
            })
          }
          placeholder="Document / certificate number"
        />

        <Field
          label="File Name"
          value={evidence.fileName}
          onChange={(value) =>
            onChange({
              fileName: value,
            })
          }
          placeholder="certificate.pdf"
        />

        <Field
          label="File Reference"
          value={evidence.fileReference}
          onChange={(value) =>
            onChange({
              fileReference: value,
            })
          }
          placeholder="Storage reference / URL"
        />

        <Field
          label="Issuing Authority"
          value={evidence.issuingAuthority}
          onChange={(value) =>
            onChange({
              issuingAuthority: value,
            })
          }
          placeholder="Issuing authority"
        />

        <Field
          label="Related Module"
          value={evidence.relatedModule}
          onChange={(value) =>
            onChange({
              relatedModule: value,
            })
          }
          placeholder="Machinery / Product / Factory..."
        />

        <Field
          label="Related Entity ID"
          value={evidence.relatedEntityId}
          onChange={(value) =>
            onChange({
              relatedEntityId: value,
            })
          }
          placeholder="Related record ID"
        />

        <Field
          label="Issue Date"
          type="date"
          value={evidence.issueDate}
          onChange={(value) =>
            onChange({
              issueDate: value,
            })
          }
        />

        <Field
          label="Expiry Date"
          type="date"
          value={evidence.expiryDate}
          onChange={(value) =>
            onChange({
              expiryDate: value,
            })
          }
        />

        <div className="sm:col-span-2">
          <TextArea
            label="Description"
            value={evidence.description}
            onChange={(value) =>
              onChange({
                description: value,
              })
            }
            placeholder="Describe what this evidence proves..."
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Source Description"
            value={evidence.sourceDescription}
            onChange={(value) =>
              onChange({
                sourceDescription: value,
              })
            }
            placeholder="Describe the source and origin of this evidence..."
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Remarks"
            value={evidence.remarks}
            onChange={(value) =>
              onChange({
                remarks: value,
              })
            }
            placeholder="Additional assessor remarks..."
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap gap-5 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
          <Toggle
            label="Mandatory Evidence"
            checked={evidence.isMandatory}
            onChange={(value) =>
              onChange({
                isMandatory: value,
              })
            }
          />

          <Toggle
            label="Current Evidence"
            checked={evidence.isCurrent}
            onChange={(value) =>
              onChange({
                isCurrent: value,
              })
            }
          />
        </div>
      </div>
    </section>
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
        rows={3}
        className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="h-4 w-4 rounded border-white/20 bg-black/20 accent-cyan-400"
      />

      <span className="text-[9px] font-semibold text-white/45">
        {label}
      </span>
    </label>
  );
}
