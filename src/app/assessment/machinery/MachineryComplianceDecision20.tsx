"use client";

import { evaluateMachineryCompliance } from "./machineryComplianceDecision";

type Props = {
  overallScore: number;
  criticalFindings: number;
  openFindings: number;
  blockers: string[];
  decision: string;
};

export default function MachineryComplianceDecision20({
  overallScore,
  criticalFindings,
  openFindings,
  blockers,
  decision,
}: Props) {
  const result = evaluateMachineryCompliance({
    overallScore,
    criticalFindings,
    openFindings,
    blockers,
    decision,
  });

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-black/[0.13] p-5">
      <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
        Part 20 • Compliance Decision
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-white">
            {result.decision}
          </div>

          <p className="mt-1 text-[10px] leading-5 text-white/35">
            {result.summary}
          </p>
        </div>

        <div className="text-right">
          <div className="text-[7px] uppercase tracking-[0.16em] text-white/25">
            Overall Score
          </div>

          <div className="mt-1 text-xl font-semibold text-cyan-200">
            {overallScore}
          </div>
        </div>
      </div>

      {result.blockers.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-300/10 bg-red-300/[0.03] p-3">
          <div className="text-[7px] font-semibold uppercase tracking-[0.14em] text-red-200/60">
            Blockers
          </div>

          <div className="mt-2 space-y-1">
            {result.blockers.map((item, index) => (
              <div
                key={`${index}-${item}`}
                className="text-[9px] leading-5 text-white/45"
              >
                • {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.03] p-3">
          <div className="text-[7px] font-semibold uppercase tracking-[0.14em] text-amber-200/60">
            Corrective Actions
          </div>

          <div className="mt-2 space-y-1">
            {result.warnings.map((item, index) => (
              <div
                key={`${index}-${item}`}
                className="text-[9px] leading-5 text-white/45"
              >
                • {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
