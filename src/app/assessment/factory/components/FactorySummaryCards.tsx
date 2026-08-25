"use client";

type FactorySummaryCardsProps = {
  totalDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
  rejectedDocuments: number;

  validDocuments: number;
  expiringDocuments: number;
  expiredDocuments: number;

  mandatoryComplete: number;
  mandatoryDocuments: number;

  totalUtilities: number;
  verifiedUtilities: number;

  openFindings: number;
  majorFindings: number;
  criticalFindings: number;
};

export default function FactorySummaryCards({
  totalDocuments,
  verifiedDocuments,
  pendingDocuments,
  rejectedDocuments,
  validDocuments,
  expiringDocuments,
  expiredDocuments,
  mandatoryComplete,
  mandatoryDocuments,
  totalUtilities,
  verifiedUtilities,
  openFindings,
  majorFindings,
  criticalFindings,
}: FactorySummaryCardsProps) {
  const cards = [
    {
      label: "Documents",
      value: totalDocuments,
      detail: `${verifiedDocuments} verified`,
    },
    {
      label: "Pending",
      value: pendingDocuments,
      detail: "verification pending",
    },
    {
      label: "Rejected",
      value: rejectedDocuments,
      detail: "require correction",
    },
    {
      label: "Valid",
      value: validDocuments,
      detail: `${expiringDocuments} expiring`,
    },
    {
      label: "Expired",
      value: expiredDocuments,
      detail: "require renewal",
    },
    {
      label: "Mandatory",
      value: `${mandatoryComplete}/${mandatoryDocuments}`,
      detail: "completed",
    },
    {
      label: "Utilities",
      value: `${verifiedUtilities}/${totalUtilities}`,
      detail: "verified",
    },
    {
      label: "Open Findings",
      value: openFindings,
      detail: `${majorFindings} major · ${criticalFindings} critical`,
    },
  ];

  return (
    <section className="mb-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
        >
          <div className="truncate text-[7px] font-bold uppercase tracking-[0.15em] text-white/25">
            {card.label}
          </div>

          <div className="mt-2 truncate text-xl font-semibold text-white/75">
            {card.value}
          </div>

          <div className="mt-1 truncate text-[8px] text-white/25">
            {card.detail}
          </div>
        </div>
      ))}
    </section>
  );
}
