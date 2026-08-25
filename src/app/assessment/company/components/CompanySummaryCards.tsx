"use client";

type CompanySummaryCardsProps = {
  totalDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
  rejectedDocuments: number;
  validDocuments: number;
  expiringDocuments: number;
  expiredDocuments: number;
  mandatoryComplete: number;
  openFindings: number;
};

export default function CompanySummaryCards({
  totalDocuments,
  verifiedDocuments,
  pendingDocuments,
  rejectedDocuments,
  validDocuments,
  expiringDocuments,
  expiredDocuments,
  mandatoryComplete,
  openFindings,
}: CompanySummaryCardsProps) {
  return (
    <div className="mb-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9">
      <SummaryCard
        label="Total Documents"
        value={totalDocuments}
      />

      <SummaryCard
        label="Verified"
        value={verifiedDocuments}
      />

      <SummaryCard
        label="Pending"
        value={pendingDocuments}
      />

      <SummaryCard
        label="Rejected"
        value={rejectedDocuments}
      />

      <SummaryCard
        label="Valid"
        value={validDocuments}
      />

      <SummaryCard
        label="Expiring"
        value={expiringDocuments}
      />

      <SummaryCard
        label="Expired"
        value={expiredDocuments}
      />

      <SummaryCard
        label="Mandatory Complete"
        value={mandatoryComplete}
      />

      <SummaryCard
        label="Open Findings"
        value={openFindings}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="truncate text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold tracking-tight text-white/80">
        {value}
      </div>
    </div>
  );
}
