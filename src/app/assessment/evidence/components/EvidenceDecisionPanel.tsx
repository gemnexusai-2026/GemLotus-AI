"use client";

import type {
  EvidenceComplianceResult,
  EvidenceReadinessResult,
} from "../evidence.types";

type EvidenceDecisionPanelProps = {
  readiness: EvidenceReadinessResult;
  compliance: EvidenceComplianceResult;
};

export default function EvidenceDecisionPanel({
  readiness,
  compliance,
}: EvidenceDecisionPanelProps) {
  const decisionLabel =
    compliance.decision.replaceAll(
      "_",
      " ",
    );

  const levelLabel =
    readiness.level.replaceAll(
      "_",
      " ",
    );

  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Evidence Intelligence
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Readiness & Decision
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Consolidated readiness, compliance
          decision, blockers and required actions.
        </p>
      </div>

      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <ScoreCard
            label="Readiness Score"
            value={`${readiness.score}%`}
          />

          <ScoreCard
            label="Readiness Level"
            value={levelLabel}
          />

          <ScoreCard
            label="Decision"
            value={decisionLabel}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ListCard
            title="Strengths"
            items={readiness.strengths}
            emptyText="No major strengths recorded yet."
            tone="success"
          />

          <ListCard
            title="Gaps"
            items={readiness.gaps}
            emptyText="No readiness gaps recorded."
            tone="warning"
          />

          <ListCard
            title="Blockers"
            items={compliance.blockers}
            emptyText="No blocking compliance issues."
            tone="danger"
          />

          <ListCard
            title="Required Actions"
            items={compliance.requiredActions}
            emptyText="No additional actions required."
            tone="info"
          />
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.03] p-5">
          <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-cyan-300/50">
            Recommendation
          </div>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {readiness.recommendation}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
              Assessment Progression
            </div>

            <div
              className={`mt-2 text-sm font-semibold ${
                compliance.canProceed
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >
              {compliance.canProceed
                ? "Can Proceed"
                : "Cannot Proceed"}
            </div>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-[8px] font-bold uppercase tracking-[0.14em] ${
              compliance.canProceed
                ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300"
                : "border-red-300/20 bg-red-300/[0.05] text-red-300"
            }`}
          >
            {decisionLabel}
          </div>
        </div>

        {compliance.reasons.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/[0.10] p-5">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
              Decision Basis
            </div>

            <div className="mt-3 space-y-2">
              {compliance.reasons.map(
                (reason, index) => (
                  <div
                    key={`${reason}-${index}`}
                    className="flex gap-3 text-[10px] leading-5 text-white/40"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-300/50" />

                    <span>{reason}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ScoreCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-5">
      <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
        {label}
      </div>

      <div className="mt-2 truncate text-xl font-semibold capitalize text-white/75">
        {value}
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  emptyText,
  tone,
}: {
  title: string;
  items: string[];
  emptyText: string;
  tone:
    | "success"
    | "warning"
    | "danger"
    | "info";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-300/70"
      : tone === "warning"
        ? "text-amber-300/70"
        : tone === "danger"
          ? "text-red-300/70"
          : "text-cyan-300/70";

  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-5">
      <div
        className={`text-[8px] font-bold uppercase tracking-[0.16em] ${toneClass}`}
      >
        {title}
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-[10px] text-white/25">
          {emptyText}
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {items.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex gap-3 text-[10px] leading-5 text-white/40"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/20" />

                <span className="min-w-0 break-words">
                  {item}
                </span>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
