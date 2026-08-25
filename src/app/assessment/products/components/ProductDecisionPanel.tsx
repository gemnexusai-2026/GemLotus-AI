"use client";

import type {
  ProductDecision,
  ProductReadinessResult,
  ProductComplianceResult,
} from "../product.types";

type ProductDecisionPanelProps = {
  readiness: ProductReadinessResult;
  compliance: ProductComplianceResult;
};

function decisionLabel(
  decision: ProductDecision,
) {
  switch (decision) {
    case "approved":
      return "Approved";

    case "conditionally_approved":
      return "Conditionally Approved";

    case "hold":
      return "On Hold";

    case "rejected":
      return "Rejected";

    default:
      return "Pending";
  }
}

function decisionClass(
  decision: ProductDecision,
) {
  switch (decision) {
    case "approved":
      return "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300";

    case "conditionally_approved":
      return "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300";

    case "hold":
      return "border-amber-300/20 bg-amber-300/[0.05] text-amber-300";

    case "rejected":
      return "border-red-300/20 bg-red-300/[0.05] text-red-300";

    default:
      return "border-white/[0.08] bg-white/[0.03] text-white/40";
  }
}

export default function ProductDecisionPanel({
  readiness,
  compliance,
}: ProductDecisionPanelProps) {
  const blockers = [
    ...readiness.blockers,
    ...compliance.blockers,
  ];

  const actions = [
    ...readiness.gaps,
    ...compliance.requiredActions,
  ];

  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Assessment Intelligence
        </div>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Product Readiness & Decision
            </h2>

            <p className="mt-2 max-w-3xl text-[10px] leading-5 text-white/30">
              Consolidated readiness intelligence,
              compliance decision, blockers and
              remaining assessment actions.
            </p>
          </div>

          <div
            className={`shrink-0 rounded-full border px-4 py-2 text-[8px] font-bold uppercase tracking-[0.14em] ${decisionClass(
              compliance.decision,
            )}`}
          >
            {decisionLabel(
              compliance.decision,
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric
            label="Readiness Score"
            value={`${readiness.score}%`}
          />

          <Metric
            label="Readiness Level"
            value={readiness.level.replaceAll(
              "_",
              " ",
            )}
          />

          <Metric
            label="Can Proceed"
            value={
              compliance.canProceed
                ? "Yes"
                : "No"
            }
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ListBlock
            title="Strengths"
            emptyText="No strengths recorded yet."
            items={readiness.strengths}
            positive
          />

          <ListBlock
            title="Blockers"
            emptyText="No active blockers."
            items={blockers}
            danger
          />

          <ListBlock
            title="Required Actions"
            emptyText="No remaining actions."
            items={actions}
          />

          <ListBlock
            title="Decision Reasons"
            emptyText="No decision reasons recorded."
            items={compliance.reasons}
          />
        </div>
      </div>
    </section>
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
    <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
      <div className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/25">
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-semibold capitalize text-white/70">
        {value}
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
  emptyText,
  positive = false,
  danger = false,
}: {
  title: string;
  items: string[];
  emptyText: string;
  positive?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
      <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
        {title}
      </div>

      {items.length === 0 ? (
        <div className="mt-3 text-[9px] text-white/25">
          {emptyText}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-start gap-2 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-2.5"
            >
              <span
                className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                  danger
                    ? "bg-red-300"
                    : positive
                      ? "bg-emerald-300"
                      : "bg-cyan-300"
                }`}
              />

              <span className="text-[9px] leading-5 text-white/40">
                {item}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
