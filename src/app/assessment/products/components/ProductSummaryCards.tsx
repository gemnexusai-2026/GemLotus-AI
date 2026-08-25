"use client";

type ProductSummaryCardsProps = {
  totalProducts: number;
  activeProducts: number;
  verifiedProducts: number;
  evidenceComplete: number;
  specificationVerified: number;
  openFindings: number;
};

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="truncate text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

export default function ProductSummaryCards({
  totalProducts,
  activeProducts,
  verifiedProducts,
  evidenceComplete,
  specificationVerified,
  openFindings,
}: ProductSummaryCardsProps) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <SummaryCard
        label="Total Products"
        value={totalProducts}
      />

      <SummaryCard
        label="Active Products"
        value={activeProducts}
      />

      <SummaryCard
        label="Verified Products"
        value={verifiedProducts}
      />

      <SummaryCard
        label="Evidence Complete"
        value={evidenceComplete}
      />

      <SummaryCard
        label="Specifications Verified"
        value={specificationVerified}
      />

      <SummaryCard
        label="Open Findings"
        value={openFindings}
      />
    </div>
  );
}
