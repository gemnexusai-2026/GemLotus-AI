"use client";

import type {
  ProductEvidence as ProductEvidenceRecord,
  ProductEvidenceType,
  EvidenceStatus,
} from "../product.types";

import {
  PRODUCT_EVIDENCE_TYPES,
} from "../product.constants";

type ProductEvidenceProps = {
  productId: string;
  evidence: ProductEvidenceRecord[];
  onChange: (
    evidence: ProductEvidenceRecord[],
  ) => void;
};

function createEvidence(
  productId: string,
): ProductEvidenceRecord {
  return {
    id: `evidence-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    productId,
    type: "product_photo",
    name: "",
    referenceNumber: "",
    issueDate: "",
    expiryDate: "",
    status: "uploaded",
    remarks: "",
  };
}

export default function ProductEvidence({
  productId,
  evidence,
  onChange,
}: ProductEvidenceProps) {
  function addEvidence() {
    onChange([
      ...evidence,
      createEvidence(productId),
    ]);
  }

  function updateEvidence(
    index: number,
    patch: Partial<ProductEvidenceRecord>,
  ) {
    const next = [...evidence];

    next[index] = {
      ...next[index],
      ...patch,
    };

    onChange(next);
  }

  function removeEvidence(index: number) {
    onChange(
      evidence.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    );
  }

  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
              Evidence Intelligence
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Product Evidence
            </h2>

            <p className="mt-2 text-[10px] leading-5 text-white/30">
              Capture the documentary and physical
              evidence supporting the product
              declaration and verification.
            </p>
          </div>

          <button
            type="button"
            onClick={addEvidence}
            className="w-full rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200 transition hover:bg-cyan-300/[0.09] sm:w-auto"
          >
            + Add Evidence
          </button>
        </div>
      </div>

      <div className="p-5">
        {evidence.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.12] p-8 text-center">
            <div className="text-sm font-semibold text-white/40">
              No evidence recorded
            </div>

            <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-white/25">
              Add photographs, catalogs, technical
              documents, certificates, test reports
              or other supporting evidence.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {evidence.map(
              (item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Evidence #
                      {index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeEvidence(index)
                      }
                      className="text-[8px] font-bold uppercase tracking-[0.12em] text-red-300/60 transition hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <label className="block">
                      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Evidence Type
                      </span>

                      <select
                        value={item.type}
                        onChange={(event) =>
                          updateEvidence(
                            index,
                            {
                              type: event
                                .target
                                .value as ProductEvidenceType,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                      >
                        {PRODUCT_EVIDENCE_TYPES.map(
                          (type) => (
                            <option
                              key={type.value}
                              value={type.value}
                            >
                              {type.label}
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    <Field
                      label="Evidence Name"
                      value={item.name}
                      onChange={(value) =>
                        updateEvidence(
                          index,
                          {
                            name: value,
                          },
                        )
                      }
                      placeholder="Document / photo / certificate name"
                    />

                    <Field
                      label="Reference Number"
                      value={
                        item.referenceNumber
                      }
                      onChange={(value) =>
                        updateEvidence(
                          index,
                          {
                            referenceNumber:
                              value,
                          },
                        )
                      }
                      placeholder="Report / certificate number"
                    />

                    <label className="block">
                      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Evidence Status
                      </span>

                      <select
                        value={item.status}
                        onChange={(event) =>
                          updateEvidence(
                            index,
                            {
                              status: event
                                .target
                                .value as EvidenceStatus,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                      >
                        <option value="missing">
                          Missing
                        </option>

                        <option value="partial">
                          Partial
                        </option>

                        <option value="uploaded">
                          Uploaded
                        </option>

                        <option value="verified">
                          Verified
                        </option>

                        <option value="rejected">
                          Rejected
                        </option>
                      </select>
                    </label>

                    <Field
                      label="Issue Date"
                      value={item.issueDate}
                      onChange={(value) =>
                        updateEvidence(
                          index,
                          {
                            issueDate: value,
                          },
                        )
                      }
                      type="date"
                    />

                    <Field
                      label="Expiry Date"
                      value={item.expiryDate}
                      onChange={(value) =>
                        updateEvidence(
                          index,
                          {
                            expiryDate: value,
                          },
                        )
                      }
                      type="date"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block">
                      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Evidence Remarks
                      </span>

                      <textarea
                        value={item.remarks}
                        onChange={(event) =>
                          updateEvidence(
                            index,
                            {
                              remarks:
                                event.target
                                  .value,
                            },
                          )
                        }
                        rows={2}
                        placeholder="Verification notes, observations or evidence limitations..."
                        className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
                      />
                    </label>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
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
  type?: string;
}) {
  return (
    <label className="block">
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
        className="w-full rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}
