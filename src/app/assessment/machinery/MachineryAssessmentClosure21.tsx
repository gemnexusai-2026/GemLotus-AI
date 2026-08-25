"use client";

import { buildMachineryAssessmentClosure21 } from "./machineryAssessmentClosure21";

type Props = {
  overallScore: number;
  decision: string;
  criticalFindings: number;
  majorFindings: number;
  openFindings: number;
  closedFindings: number;
  blockers: string[];
};

export default function MachineryAssessmentClosure21({
  overallScore,
  decision,
  criticalFindings,
  majorFindings,
  openFindings,
  closedFindings,
  blockers,
}: Props) {
  const closure = buildMachineryAssessmentClosure21({
    overallScore,
    decision,
    criticalFindings,
    majorFindings,
    openFindings,
    closedFindings,
    blockers,
  });

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-black/[0.13] p-5">
      <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
        Part 21 • Assessment Closure
      </div>

      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-lg font-semibold text-white">
            {closure.status.replaceAll("_", " ")}
          </div>

          <p className="mt-1 text-[10px] leading-5 text-white/35">
            {closure.summary}
          </p>
        </div>

        <div className="text-right">
          <div className="text-[7px] uppercase tracking-[0.16em] text-white/25">
            Closure
          </div>

          <div className="mt-1 text-xl font-semibold text-cyan-200">
            {closure.closurePercentage}%
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] p-3">
          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
            Score
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {overallScore}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] p-3">
          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
            Critical
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {criticalFindings}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] p-3">
          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
            Open
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {openFindings}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] p-3">
          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
            Closed
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {closedFindings}
          </div>
        </div>
      </div>

      {blockers.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-300/10 bg-red-300/[0.03] p-3">
          <div className="text-[7px] font-semibold uppercase tracking-[0.14em] text-red-200/60">
            Closure Blockers
          </div>

          <div className="mt-2 space-y-1">
            {blockers.map((blocker, index) => (
              <div
                key={`${index}-${blocker}`}
                className="text-[9px] leading-5 text-white/45"
              >
                • {blocker}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
