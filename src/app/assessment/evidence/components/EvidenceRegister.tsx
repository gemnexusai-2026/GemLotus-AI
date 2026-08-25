"use client";

import type { EvidenceRecord } from "../evidence.types";

type EvidenceRegisterProps = {
  evidence: EvidenceRecord[];

  selectedEvidenceId:
    | string
    | null;

  onSelectEvidence: (
    id: string,
  ) => void;

  onDeleteEvidence: (
    id: string,
  ) => void;

  onAddEvidence: () => void;
};

export default function EvidenceRegister({
  evidence,
  selectedEvidenceId,
  onSelectEvidence,
  onDeleteEvidence,
  onAddEvidence,
}: EvidenceRegisterProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
              Assessment Evidence Register
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Evidence Register
            </h2>
          </div>

          <div className="shrink-0 text-[9px] text-white/30">
            {evidence.length} shown
          </div>
        </div>
      </div>

      <div className="p-4">
        {evidence.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.12] p-10 text-center">
            <div className="text-sm font-semibold text-white/45">
              No Evidence Records
            </div>

            <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-white/25">
              Add certificates, documents,
              photographs, reports and other
              assessment evidence.
            </p>

            <button
              type="button"
              onClick={onAddEvidence}
              className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200 transition hover:bg-cyan-300/[0.08]"
            >
              + Add Evidence
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {evidence.map((item) => {
              const selected =
                item.id ===
                selectedEvidenceId;

              return (
                <EvidenceRow
                  key={item.id}
                  item={item}
                  selected={selected}
                  onSelect={() =>
                    onSelectEvidence(
                      item.id,
                    )
                  }
                  onDelete={() =>
                    onDeleteEvidence(
                      item.id,
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function EvidenceRow({
  item,
  selected,
  onSelect,
  onDelete,
}: {
  item: EvidenceRecord;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        selected
          ? "border-cyan-300/20 bg-cyan-300/[0.05]"
          : "border-white/[0.06] bg-black/[0.12] hover:border-white/[0.10]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.04] px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-cyan-200/70">
                {item.category.replaceAll(
                  "_",
                  " ",
                )}
              </span>

              <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-white/35">
                {item.type.replaceAll(
                  "_",
                  " ",
                )}
              </span>
            </div>

            <h3 className="mt-3 truncate text-sm font-semibold text-white/75">
              {item.title ||
                "Untitled Evidence"}
            </h3>

            <p className="mt-1 truncate text-[9px] text-white/25">
              {item.evidenceCode ||
                "No evidence code"}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <StatusBadge
              label={item.verificationStatus}
            />

            <StatusBadge
              label={item.validityStatus}
            />

            <StatusBadge
              label={item.riskLevel}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Info
            label="Document"
            value={
              item.documentNumber ||
              "—"
            }
          />

          <Info
            label="Authority"
            value={
              item.issuingAuthority ||
              "—"
            }
          />

          <Info
            label="Expiry"
            value={
              item.expiryDate ||
              "—"
            }
          />
        </div>
      </button>

      <div className="mt-3 flex justify-end border-t border-white/[0.05] pt-3">
        <button
          type="button"
          onClick={onDelete}
          className="text-[8px] font-bold uppercase tracking-[0.12em] text-red-300/50 transition hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/20">
        {label}
      </div>

      <div className="mt-1 truncate text-[9px] text-white/40">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.1em] text-white/35">
      {label.replaceAll(
        "_",
        " ",
      )}
    </span>
  );
}
