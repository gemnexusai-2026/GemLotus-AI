"use client";

import type {
  CompanyComplianceResult,
  CompanyReadinessResult,
} from "../company.types";

type CompanyDecisionPanelProps = {
  readiness: CompanyReadinessResult;
  compliance: CompanyComplianceResult;
};

export default function CompanyDecisionPanel({
  readiness,
  compliance,
}: CompanyDecisionPanelProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Assessment Intelligence
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Readiness & Compliance Decision
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Consolidated company legal readiness,
          blockers, recommendations and progression
          decision.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ScoreCard
            label="Readiness Score"
            value={`${readiness.score}%`}
          />

          <ScoreCard
            label="Readiness Level"
            value={formatLabel(
              readiness.level,
            )}
          />
        </div>

        <div
          className={`rounded-2xl border p-5 ${
            compliance.canProceed
              ? "border-emerald-300/15 bg-emerald-300/[0.04]"
              : "border-amber-300/15 bg-amber-300/[0.04]"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                Final Compliance Decision
              </div>

              <div className="mt-2 text-2xl font-semibold text-white/80">
                {formatLabel(
                  compliance.decision,
                )}
              </div>
            </div>

            <div
              className={`rounded-full border px-4 py-2 text-[8px] font-bold uppercase tracking-[0.14em] ${
                compliance.canProceed
                  ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300"
                  : "border-red-300/20 bg-red-300/[0.05] text-red-300"
              }`}
            >
              {compliance.canProceed
                ? "Can Proceed"
                : "Cannot Proceed"}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <ListCard
            title="Strengths"
            items={
              readiness.strengths
            }
            empty="No major strengths identified yet."
            tone="positive"
          />

          <ListCard
            title="Gaps"
            items={readiness.gaps}
            empty="No current gaps identified."
            tone="warning"
          />

          <ListCard
            title="Blockers"
            items={[
              ...readiness.blockers,
              ...compliance.blockers,
            ]}
            empty="No active blockers."
            tone="danger"
          />
        </div>

        <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.03] p-5">
          <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-cyan-300/50">
            Recommendation
          </div>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {readiness.recommendation}
          </p>
        </div>

        {compliance.requiredActions.length >
          0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-5">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
              Required Actions
            </div>

            <div className="mt-4 space-y-3">
              {compliance.requiredActions.map(
                (action, index) => (
                  <div
                    key={`${action}-${index}`}
                    className="flex gap-3 text-[10px] leading-5 text-white/40"
                  >
                    <span className="shrink-0 text-cyan-300/60">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <span>
                      {action}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {compliance.reasons.length >
          0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-5">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
              Decision Basis
            </div>

            <div className="mt-4 space-y-3">
              {compliance.reasons.map(
                (reason, index) => (
                  <div
                    key={`${reason}-${index}`}
                    className="flex gap-3 text-[10px] leading-5 text-white/40"
                  >
                    <span className="mt-0.5 text-emerald-300/60">
                      ✓
                    </span>

                    <span>
                      {reason}
                    </span>
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
    <div className="rounded-2xl border border-white/[0.07] bg-black/[0.12] p-5">
      <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
        {label}
      </div>

      <div className="mt-3 truncate text-xl font-semibold capitalize text-white/75">
        {value}
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  empty,
  tone,
}: {
  title: string;
  items: string[];
  empty: string;
  tone:
    | "positive"
    | "warning"
    | "danger";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-300/60"
      : tone === "warning"
        ? "text-amber-300/60"
        : "text-red-300/60";

  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-5">
      <div
        className={`text-[8px] font-bold uppercase tracking-[0.16em] ${toneClass}`}
      >
        {title}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-[10px] leading-5 text-white/20">
          {empty}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex gap-3 text-[10px] leading-5 text-white/40"
              >
                <span
                  className={`shrink-0 ${toneClass}`}
                >
                  •
                </span>

                <span className="min-w-0">
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

function formatLabel(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}
