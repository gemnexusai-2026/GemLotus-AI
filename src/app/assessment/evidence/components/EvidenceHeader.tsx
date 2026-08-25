"use client";

type EvidenceHeaderProps = {
  evidenceCount: number;
  completion: number;
  readiness: number;
  risk: string;
};

export default function EvidenceHeader({
  evidenceCount,
  completion,
  readiness,
  risk,
}: EvidenceHeaderProps) {
  return (
    <header className="border-b border-white/[0.06] px-4 py-6 sm:px-6 lg:px-10 lg:py-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-300/60">
            Step 05 • Evidence Assessment
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Evidence Intelligence Assessment
          </h1>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-blue-100/45">
            Evidence-first assessment of documents,
            certificates, photographs, reports,
            validity, verification status, risk,
            mandatory requirements and corrective
            actions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric
            label="Evidence"
            value={String(evidenceCount)}
          />

          <Metric
            label="Completion"
            value={`${completion}%`}
          />

          <Metric
            label="Readiness"
            value={`${readiness}%`}
          />

          <Metric
            label="Risk"
            value={risk}
          />
        </div>
      </div>
    </header>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 sm:px-4">
      <div className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/25">
        {label}
      </div>

      <div className="mt-1 truncate text-sm font-semibold text-white/70">
        {value}
      </div>
    </div>
  );
}
