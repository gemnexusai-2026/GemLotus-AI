"use client";

import type {
  ProductRecord,
  ProductSpecification,
  VerificationStatus,
} from "../product.types";

type ProductSpecificationsProps = {
  product: ProductRecord;
  onChange: (
    specifications: ProductSpecification[],
  ) => void;
};

function createSpecification(): ProductSpecification {
  return {
    id: `spec-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    parameter: "",
    declaredValue: "",
    verifiedValue: "",
    unit: "",
    source: "",
    verificationStatus: "pending",
    remarks: "",
  };
}

export default function ProductSpecifications({
  product,
  onChange,
}: ProductSpecificationsProps) {
  const specifications =
    product.specifications ?? [];

  function addSpecification() {
    onChange([
      ...specifications,
      createSpecification(),
    ]);
  }

  function updateSpecification(
    index: number,
    patch: Partial<ProductSpecification>,
  ) {
    const next = [...specifications];

    next[index] = {
      ...next[index],
      ...patch,
    };

    onChange(next);
  }

  function removeSpecification(
    index: number,
  ) {
    onChange(
      specifications.filter(
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
              Technical Verification
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Product Specifications
            </h2>

            <p className="mt-2 text-[10px] leading-5 text-white/30">
              Record declared specifications and
              compare them against physically or
              documentarily verified values.
            </p>
          </div>

          <button
            type="button"
            onClick={addSpecification}
            className="w-full rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200 transition hover:bg-cyan-300/[0.09] sm:w-auto"
          >
            + Add Specification
          </button>
        </div>
      </div>

      <div className="p-5">
        {specifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.12] p-8 text-center">
            <div className="text-sm font-semibold text-white/40">
              No specifications recorded
            </div>

            <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-white/25">
              Add the important technical parameters
              that define the assessed product.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {specifications.map(
              (specification, index) => (
                <div
                  key={specification.id}
                  className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Specification #
                      {index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeSpecification(
                          index,
                        )
                      }
                      className="text-[8px] font-bold uppercase tracking-[0.12em] text-red-300/60 transition hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Field
                      label="Parameter"
                      value={
                        specification.parameter
                      }
                      onChange={(value) =>
                        updateSpecification(
                          index,
                          {
                            parameter: value,
                          },
                        )
                      }
                      placeholder="e.g. Dimensions"
                    />

                    <Field
                      label="Declared Value"
                      value={
                        specification.declaredValue
                      }
                      onChange={(value) =>
                        updateSpecification(
                          index,
                          {
                            declaredValue:
                              value,
                          },
                        )
                      }
                      placeholder="Declared specification"
                    />

                    <Field
                      label="Verified Value"
                      value={
                        specification.verifiedValue
                      }
                      onChange={(value) =>
                        updateSpecification(
                          index,
                          {
                            verifiedValue:
                              value,
                          },
                        )
                      }
                      placeholder="Assessed value"
                    />

                    <Field
                      label="Unit"
                      value={
                        specification.unit
                      }
                      onChange={(value) =>
                        updateSpecification(
                          index,
                          {
                            unit: value,
                          },
                        )
                      }
                      placeholder="mm / kg / W..."
                    />

                    <Field
                      label="Verification Source"
                      value={
                        specification.source
                      }
                      onChange={(value) =>
                        updateSpecification(
                          index,
                          {
                            source: value,
                          },
                        )
                      }
                      placeholder="Document / sample / test"
                    />

                    <label className="block">
                      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Verification Status
                      </span>

                      <select
                        value={
                          specification.verificationStatus
                        }
                        onChange={(event) =>
                          updateSpecification(
                            index,
                            {
                              verificationStatus:
                                event.target
                                  .value as VerificationStatus,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="verified">
                          Verified
                        </option>

                        <option value="needs_review">
                          Needs Review
                        </option>

                        <option value="rejected">
                          Rejected
                        </option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="block">
                      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Remarks
                      </span>

                      <textarea
                        value={
                          specification.remarks
                        }
                        onChange={(event) =>
                          updateSpecification(
                            index,
                            {
                              remarks:
                                event.target
                                  .value,
                            },
                          )
                        }
                        rows={2}
                        placeholder="Verification notes or observations..."
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

      <input
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
