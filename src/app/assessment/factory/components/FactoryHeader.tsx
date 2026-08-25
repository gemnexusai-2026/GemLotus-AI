"use client";

type FactoryHeaderProps = {
  documentCount: number;
  utilityCount: number;
  readiness: number;
  risk: string;
  decision: string;
};

export default function FactoryHeader({
  documentCount,
  utilityCount,
  readiness,
  risk,
  decision,
}: FactoryHeaderProps) {
  return (
    <header className="w-full min-w-0 border-b border-white/[0.06] bg-[#030b17]">
      <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-cyan-200/70">
                Assessment Module
              </span>

              <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                Factory & Infrastructure
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Factory & Infrastructure
            </h1>

            <p className="mt-2 max-w-3xl text-[10px] leading-5 text-white/30 sm:text-[11px]">
              Verify factory premises, infrastructure,
              utilities, statutory evidence, operational
              status and assessment readiness.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-5 xl:w-auto">
            <Metric
              label="Documents"
              value={String(documentCount)}
            />

            <Metric
              label="Utilities"
              value={String(utilityCount)}
            />

            <Metric
              label="Readiness"
              value={`${readiness}%`}
            />

            <Metric
              label="Risk"
              value={risk}
            />

            <Metric
              label="Decision"
              value={decision}
            />
          </div>
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
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
      <div className="truncate text-[7px] font-bold uppercase tracking-[0.16em] text-white/25">
        {label}
      </div>

      <div className="mt-1 truncate text-sm font-semibold capitalize text-white/70">
        {value}
      </div>
    </div>
  );
}
