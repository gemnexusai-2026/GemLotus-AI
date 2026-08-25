"use client";

type EvidenceSummaryCardsProps = {
  totalEvidence: number;
  verifiedEvidence: number;
  pendingEvidence: number;
  validEvidence: number;
  expiringEvidence: number;
  expiredEvidence: number;
  mandatoryComplete: number;
  openFindings: number;
};

export default function EvidenceSummaryCards({
  totalEvidence,
  verifiedEvidence,
  pendingEvidence,
  validEvidence,
  expiringEvidence,
  expiredEvidence,
  mandatoryComplete,
  openFindings,
}: EvidenceSummaryCardsProps) {
  return (
    <div className="mb-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      <SummaryCard
        label="Total Evidence"
        value={totalEvidence}
      />

      <SummaryCard
        label="Verified"
        value={verifiedEvidence}
      />

      <SummaryCard
        label="Pending"
        value={pendingEvidence}
      />

      <SummaryCard
        label="Valid"
        value={validEvidence}
      />

      <SummaryCard
        label="Expiring"
        value={expiringEvidence}
      />

      <SummaryCard
        label="Expired"
        value={expiredEvidence}
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
