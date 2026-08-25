"use client";

import type {
  EvidenceFinding,
  EvidenceFindingSeverity,
  EvidenceRecord,
} from "../evidence.types";

type EvidenceFindingsProps = {
  evidence: EvidenceRecord;

  onChange: (
    findings: EvidenceFinding[],
  ) => void;
};

function createFinding(): EvidenceFinding {
  return {
    id: `finding-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    title: "",
    description: "",

    severity: "observation",

    requirement: "",
    evidenceReference: "",

    correctiveAction: "",
    correctiveActionStatus: "open",

    remarks: "",
  };
}

export default function EvidenceFindings({
  evidence,
  onChange,
}: EvidenceFindingsProps) {
  const findings =
    evidence.findings ?? [];

  function addFinding() {
    onChange([
      ...findings,
      createFinding(),
    ]);
  }

  function updateFinding(
    index: number,
    patch: Partial<EvidenceFinding>,
  ) {
    const next = [...findings];

    next[index] = {
      ...next[index],
      ...patch,
    };

    onChange(next);
  }

  function removeFinding(
    index: number,
  ) {
    onChange(
      findings.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    );
  }

  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
              Evidence Findings
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Findings & Corrective Actions
            </h2>

            <p className="mt-2 max-w-3xl text-[10px] leading-5 text-white/30">
              Record evidence gaps, classify
              severity and track corrective-action
              closure.
            </p>
          </div>

          <button
            type="button"
            onClick={addFinding}
            className="w-full shrink-0 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200 transition hover:bg-cyan-300/[0.09] sm:w-auto"
          >
            + Add Finding
          </button>
        </div>
      </div>

      <div className="p-5">
        {findings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.12] p-8 text-center">
            <div className="text-sm font-semibold text-emerald-300/60">
              No Findings Recorded
            </div>

            <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-white/25">
              No evidence-level corrective
              findings have been recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {findings.map(
              (item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Finding #
                      {index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFinding(
                          index,
                        )
                      }
                      className="text-[8px] font-bold uppercase tracking-[0.12em] text-red-300/60 transition hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Field
                      label="Finding Title"
                      value={item.title}
                      onChange={(value) =>
                        updateFinding(
                          index,
                          {
                            title: value,
                          },
                        )
                      }
                      placeholder="Short finding title"
                    />

                    <Field
                      label="Requirement"
                      value={
                        item.requirement
                      }
                      onChange={(value) =>
                        updateFinding(
                          index,
                          {
                            requirement:
                              value,
                          },
                        )
                      }
                      placeholder="Applicable requirement"
                    />

                    <label className="block">
                      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Severity
                      </span>

                      <select
                        value={
                          item.severity
                        }
                        onChange={(
                          event,
                        ) =>
                          updateFinding(
                            index,
                            {
                              severity:
                                event
                                  .target
                                  .value as EvidenceFindingSeverity,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                      >
                        <option value="observation">
                          Observation
                        </option>

                        <option value="minor">
                          Minor
                        </option>

                        <option value="major">
                          Major
                        </option>

                        <option value="critical">
                          Critical
                        </option>
                      </select>
                    </label>

                    <Field
                      label="Evidence Reference"
                      value={
                        item.evidenceReference
                      }
                      onChange={(value) =>
                        updateFinding(
                          index,
                          {
                            evidenceReference:
                              value,
                          },
                        )
                      }
                      placeholder="Document / file reference"
                    />
                  </div>

                  <div className="mt-4">
                    <TextArea
                      label="Finding Description"
                      value={
                        item.description
                      }
                      onChange={(value) =>
                        updateFinding(
                          index,
                          {
                            description:
                              value,
                          },
                        )
                      }
                      placeholder="Describe the observed evidence gap..."
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextArea
                      label="Corrective Action"
                      value={
                        item.correctiveAction
                      }
                      onChange={(value) =>
                        updateFinding(
                          index,
                          {
                            correctiveAction:
                              value,
                          },
                        )
                      }
                      placeholder="Define the corrective action required..."
                    />

                    <label className="block">
                      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Corrective Action Status
                      </span>

                      <select
                        value={
                          item.correctiveActionStatus
                        }
                        onChange={(
                          event,
                        ) =>
                          updateFinding(
                            index,
                            {
                              correctiveActionStatus:
                                event
                                  .target
                                  .value as EvidenceFinding["correctiveActionStatus"],
                            },
                          )
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                      >
                        <option value="open">
                          Open
                        </option>

                        <option value="in_progress">
                          In Progress
                        </option>

                        <option value="closed">
                          Closed
                        </option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-4">
                    <TextArea
                      label="Remarks"
                      value={item.remarks}
                      onChange={(value) =>
                        updateFinding(
                          index,
                          {
                            remarks: value,
                          },
                        )
                      }
                      placeholder="Additional assessor observations..."
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <SeverityBadge
                      severity={
                        item.severity
                      }
                    />

                    <StatusBadge
                      status={
                        item.correctiveActionStatus
                      }
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={3}
        className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: EvidenceFindingSeverity;
}) {
  const classes =
    severity === "critical"
      ? "border-red-300/20 bg-red-300/[0.05] text-red-300"
      : severity === "major"
        ? "border-amber-300/20 bg-amber-300/[0.05] text-amber-300"
        : severity === "minor"
          ? "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300"
          : "border-white/[0.08] bg-white/[0.03] text-white/40";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] ${classes}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: EvidenceFinding["correctiveActionStatus"];
}) {
  const classes =
    status === "closed"
      ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300"
      : status === "in_progress"
        ? "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300"
        : "border-white/[0.08] bg-white/[0.03] text-white/40";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] ${classes}`}
    >
      {status.replaceAll(
        "_",
        " ",
      )}
    </span>
  );
}
