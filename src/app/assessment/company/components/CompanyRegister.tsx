"use client";

import type { CompanyDocument, CompanyDocumentType } from "../company.types";

type CompanyRegisterProps = {
  documents: CompanyDocument[];

  selectedDocumentId:
    | string
    | null;

  onSelectDocument: (
    id: string,
  ) => void;

  onDeleteDocument: (
    id: string,
  ) => void;

  onAddDocument: (documentType: CompanyDocumentType) => void;
};

export default function CompanyRegister({
  documents,
  selectedDocumentId,
  onSelectDocument,
  onDeleteDocument,
  onAddDocument,
}: CompanyRegisterProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
              Legal Compliance Register
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Company Document Register
            </h2>
          </div>

          <div className="shrink-0 text-[9px] text-white/30">
            {documents.length} shown
          </div>
        </div>
      </div>

      <div className="p-4">
        {documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.12] p-10 text-center">
            <div className="text-sm font-semibold text-white/45">
              No Legal Documents
            </div>

            <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-white/25">
              Add PAN, GST, Udyam, incorporation,
              licenses and other applicable legal
              evidence.
            </p>

            <button
              type="button"
              onClick={() => onAddDocument("other")}
              className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200 transition hover:bg-cyan-300/[0.08]"
            >
              + Add Document
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => {
              const selected =
                document.id ===
                selectedDocumentId;

              return (
                <DocumentRow
                  key={document.id}
                  document={document}
                  selected={selected}
                  onSelect={() =>
                    onSelectDocument(
                      document.id,
                    )
                  }
                  onDelete={() =>
                    onDeleteDocument(
                      document.id,
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

function DocumentRow({
  document,
  selected,
  onSelect,
  onDelete,
}: {
  document: CompanyDocument;
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
        className="w-full min-w-0 text-left"
      >
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.04] px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-cyan-200/70">
                {document.documentType.replaceAll(
                  "_",
                  " ",
                )}
              </span>

              {document.isMandatory && (
                <span className="rounded-full border border-amber-300/10 bg-amber-300/[0.04] px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-amber-200/60">
                  Mandatory
                </span>
              )}
            </div>

            <h3 className="mt-3 truncate text-sm font-semibold text-white/75">
              {document.documentName ||
                document.documentType.replaceAll(
                  "_",
                  " ",
                )}
            </h3>

            <p className="mt-1 truncate text-[9px] text-white/25">
              {document.documentNumber ||
                "No document number"}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <StatusBadge
              label={
                document.verificationStatus
              }
            />

            <StatusBadge
              label={
                document.validityStatus
              }
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Info
            label="Authority"
            value={
              document.issuingAuthority ||
              "—"
            }
          />

          <Info
            label="Expiry"
            value={
              document.expiryDate ||
              "—"
            }
          />

          <Info
            label="Current"
            value={
              document.isCurrent
                ? "Yes"
                : "No"
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

