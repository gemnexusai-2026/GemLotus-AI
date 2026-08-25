"use client";

type ProductHeaderProps = {
  productCount: number;
  completion: number;
  readiness: number;
  risk: string;
};

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
      <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
        {label}
      </div>

      <div className="mt-2 truncate text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

export default function ProductHeader({
  productCount,
  completion,
  readiness,
  risk,
}: ProductHeaderProps) {
  return (
    <header className="border-b border-white/[0.06]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-300/60">
              Step 05 • Product Assessment
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Product Capability Assessment
            </h1>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-blue-100/45 sm:leading-7">
              Evidence-first assessment of product definition,
              technical specifications, physical verification,
              quality testing and manufacturing relevance.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:w-auto">
            <Metric
              label="Products"
              value={String(productCount)}
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
      </div>
    </header>
  );
}
