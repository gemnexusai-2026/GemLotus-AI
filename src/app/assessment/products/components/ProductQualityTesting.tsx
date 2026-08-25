"use client";

import type { ProductRecord } from "../product.types";

type ProductQualityTestingProps = {
  product: ProductRecord;

  onChange: (
    qualityTesting: ProductRecord["qualityTesting"],
  ) => void;
};

export default function ProductQualityTesting({
  product,
  onChange,
}: ProductQualityTestingProps) {
  const quality =
    product.qualityTesting;

  function update(
    patch: Partial<
      ProductRecord["qualityTesting"]
    >,
  ) {
    onChange({
      ...quality,
      ...patch,
    });
  }

  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Quality Assurance & Testing
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Product Quality & Testing
        </h2>

        <p className="mt-2 max-w-3xl text-[10px] leading-5 text-white/30">
          Verify quality-control arrangements,
          inspection procedures and applicable
          product testing evidence.
        </p>
      </div>

      <div className="p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <CheckCard
            title="Quality Control Available"
            description="Documented quality-control arrangements are available for the product."
            checked={
              quality.qualityControlAvailable
            }
            onChange={(checked) =>
              update({
                qualityControlAvailable:
                  checked,
              })
            }
          />

          <CheckCard
            title="Inspection Procedure Available"
            description="A product inspection or quality-check procedure is available."
            checked={
              quality.inspectionProcedureAvailable
            }
            onChange={(checked) =>
              update({
                inspectionProcedureAvailable:
                  checked,
              })
            }
          />

          <CheckCard
            title="Product Testing Required"
            description="The product requires a test, laboratory report or applicable compliance evidence."
            checked={
              quality.testRequired
            }
            onChange={(checked) =>
              update({
                testRequired: checked,
              })
            }
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Test Status
            </span>

            <select
              value={quality.testStatus}
              onChange={(event) =>
                update({
                  testStatus:
                    event.target
                      .value as ProductRecord["qualityTesting"]["testStatus"],
                })
              }
              className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
            >
              <option value="not_required">
                Not Required
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="available">
                Available
              </option>

              <option value="expired">
                Expired
              </option>

              <option value="failed">
                Failed
              </option>
            </select>
          </label>

          <Field
            label="Test Name"
            value={quality.testName}
            onChange={(value) =>
              update({
                testName: value,
              })
            }
            placeholder="Applicable test / standard"
          />

          <Field
            label="Testing Laboratory"
            value={
              quality.testingLaboratory
            }
            onChange={(value) =>
              update({
                testingLaboratory:
                  value,
              })
            }
            placeholder="Laboratory / testing agency"
          />

          <Field
            label="Report Number"
            value={
              quality.reportNumber
            }
            onChange={(value) =>
              update({
                reportNumber: value,
              })
            }
            placeholder="Test report number"
          />

          <Field
            label="Test Date"
            value={quality.testDate}
            onChange={(value) =>
              update({
                testDate: value,
              })
            }
            type="date"
          />

          <Field
            label="Expiry Date"
            value={quality.expiryDate}
            onChange={(value) =>
              update({
                expiryDate: value,
              })
            }
            type="date"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                Testing Evidence State
              </div>

              <div className="mt-2 text-sm font-semibold text-white/65">
                {getTestingLabel(
                  quality.testStatus,
                )}
              </div>
            </div>

            <div
              className={`rounded-full border px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] ${
                quality.testStatus ===
                "available"
                  ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300"
                  : quality.testStatus ===
                      "failed"
                    ? "border-red-300/20 bg-red-300/[0.05] text-red-300"
                    : "border-white/[0.08] bg-white/[0.03] text-white/40"
              }`}
            >
              {quality.testStatus.replaceAll(
                "_",
                " ",
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Quality & Testing Remarks
            </span>

            <textarea
              value={quality.remarks}
              onChange={(event) =>
                update({
                  remarks:
                    event.target.value,
                })
              }
              rows={4}
              placeholder="Record quality-control observations, testing limitations or assessor notes..."
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
            />
          </label>
        </div>
      </div>
    </section>
  );
}

function getTestingLabel(
  status: ProductRecord["qualityTesting"]["testStatus"],
) {
  switch (status) {
    case "available":
      return "Testing evidence available";

    case "pending":
      return "Testing evidence pending";

    case "expired":
      return "Testing evidence expired";

    case "failed":
      return "Testing evidence failed";

    case "not_required":
      return "Testing not required";

    default:
      return "Testing status not established";
  }
}

function CheckCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
        checked
          ? "border-emerald-300/[0.14] bg-emerald-300/[0.035]"
          : "border-white/[0.06] bg-black/[0.12] hover:border-white/[0.10]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="mt-1 h-4 w-4 shrink-0 accent-cyan-300"
      />

      <span className="min-w-0">
        <span className="block text-[10px] font-semibold text-white/70">
          {title}
        </span>

        <span className="mt-1 block text-[9px] leading-5 text-white/30">
          {description}
        </span>
      </span>
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
