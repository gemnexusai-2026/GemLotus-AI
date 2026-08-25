"use client";

import type {
  ProductRecord,
  VerificationStatus,
} from "../product.types";

type ProductVerificationProps = {
  product: ProductRecord;

  onChange: (
    verification: ProductRecord["verification"],
  ) => void;
};

export default function ProductVerification({
  product,
  onChange,
}: ProductVerificationProps) {
  const verification =
    product.verification;

  function update(
    patch: Partial<
      ProductRecord["verification"]
    >,
  ) {
    onChange({
      ...verification,
      ...patch,
    });
  }

  const checks = [
    verification.physicalSampleVerified,
    verification.specificationVerified,
    verification.manufacturingCapabilityVerified,
    verification.productionProcessVerified,
  ];

  const completedChecks =
    checks.filter(Boolean).length;

  const completion = Math.round(
    (completedChecks / checks.length) * 100,
  );

  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
              Physical & Technical Verification
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Product Verification
            </h2>

            <p className="mt-2 max-w-3xl text-[10px] leading-5 text-white/30">
              Verify the physical product, declared
              specifications, manufacturing capability
              and production process against available
              evidence.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-cyan-300/[0.10] bg-cyan-300/[0.035] px-5 py-4">
            <div className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/30">
              Verification Completion
            </div>

            <div className="mt-1 text-2xl font-semibold text-cyan-200">
              {completion}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <CheckCard
            title="Physical Sample Available"
            description="A physical product/sample is available for assessment."
            checked={
              verification.physicalSampleAvailable
            }
            onChange={(checked) =>
              update({
                physicalSampleAvailable:
                  checked,
                physicalSampleVerified:
                  checked
                    ? verification.physicalSampleVerified
                    : false,
              })
            }
          />

          <CheckCard
            title="Physical Sample Verified"
            description="The physical product/sample has been examined and verified."
            checked={
              verification.physicalSampleVerified
            }
            disabled={
              !verification.physicalSampleAvailable
            }
            onChange={(checked) =>
              update({
                physicalSampleVerified:
                  checked,
              })
            }
          />

          <CheckCard
            title="Specification Verified"
            description="Declared technical specifications have been checked against evidence."
            checked={
              verification.specificationVerified
            }
            onChange={(checked) =>
              update({
                specificationVerified:
                  checked,
              })
            }
          />

          <CheckCard
            title="Manufacturing Capability Verified"
            description="The assessed organization demonstrates capability to manufacture this product."
            checked={
              verification.manufacturingCapabilityVerified
            }
            onChange={(checked) =>
              update({
                manufacturingCapabilityVerified:
                  checked,
              })
            }
          />

          <CheckCard
            title="Production Process Verified"
            description="The declared production process has been verified against the actual facility/process."
            checked={
              verification.productionProcessVerified
            }
            onChange={(checked) =>
              update({
                productionProcessVerified:
                  checked,
              })
            }
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Verification Status
            </span>

            <select
              value={
                verification.verificationStatus
              }
              onChange={(event) =>
                update({
                  verificationStatus:
                    event.target
                      .value as VerificationStatus,
                })
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

          <Field
            label="Verified By"
            value={
              verification.verifiedBy
            }
            onChange={(value) =>
              update({
                verifiedBy: value,
              })
            }
            placeholder="Assessor / verifier name"
          />

          <Field
            label="Verification Date"
            value={
              verification.verificationDate
            }
            onChange={(value) =>
              update({
                verificationDate:
                  value,
              })
            }
            type="date"
          />
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Verification Remarks
            </span>

            <textarea
              value={verification.remarks}
              onChange={(event) =>
                update({
                  remarks:
                    event.target.value,
                })
              }
              rows={4}
              placeholder="Record physical verification observations, discrepancies or assessor notes..."
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
            />
          </label>
        </div>
      </div>
    </section>
  );
}

function CheckCard({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
        disabled
          ? "cursor-not-allowed border-white/[0.04] bg-white/[0.01] opacity-40"
          : checked
            ? "border-emerald-300/[0.14] bg-emerald-300/[0.035]"
            : "border-white/[0.06] bg-black/[0.12] hover:border-white/[0.10]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
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
