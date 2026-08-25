"use client";

import { useMemo, useState } from "react";

import {
  createInitialEvidence,
} from "./evidence.factory";

import {
  evaluateEvidenceCompliance,
} from "./evidenceComplianceDecision";

import {
  calculateEvidenceReadiness,
} from "./evidence.readiness";

import type {
  EvidenceCategory,
  EvidenceFilterState,
  EvidenceRecord,
  EvidenceRiskLevel,
  EvidenceType,
  EvidenceValidityStatus,
  EvidenceVerificationStatus,
} from "./evidence.types";

import EvidenceHeader from "./components/EvidenceHeader";
import EvidenceToolbar from "./components/EvidenceToolbar";
import EvidenceSummaryCards from "./components/EvidenceSummaryCards";
import EvidenceRegister from "./components/EvidenceRegister";
import EvidenceDetails from "./components/EvidenceDetails";
import EvidenceVerification from "./components/EvidenceVerification";
import EvidenceFindings from "./components/EvidenceFindings";
import EvidenceDecisionPanel from "./components/EvidenceDecisionPanel";

type EvidenceWorkspaceProps = {
  assessmentId: string;
};

const INITIAL_FILTERS: EvidenceFilterState = {
  search: "",
  category: "all",
  type: "all",
  verificationStatus: "all",
  validityStatus: "all",
  riskLevel: "all",
};

export default function EvidenceWorkspace({
  assessmentId,
}: EvidenceWorkspaceProps) {
  const [evidence, setEvidence] =
    useState<EvidenceRecord[]>([]);

  const [selectedEvidenceId, setSelectedEvidenceId] =
    useState<string | null>(null);

  const [filters, setFilters] =
    useState<EvidenceFilterState>(
      INITIAL_FILTERS,
    );

  const selectedEvidence =
    evidence.find(
      (item) =>
        item.id === selectedEvidenceId,
    ) ?? null;

  const filteredEvidence = useMemo(() => {
    const search =
      filters.search
        .trim()
        .toLowerCase();

    return evidence.filter((item) => {
      const matchesSearch =
        !search ||
        [
          item.evidenceCode,
          item.title,
          item.description,
          item.fileName,
          item.documentNumber,
          item.issuingAuthority,
          item.relatedModule,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        filters.category === "all" ||
        item.category ===
          filters.category;

      const matchesType =
        filters.type === "all" ||
        item.type === filters.type;

      const matchesVerification =
        filters.verificationStatus ===
          "all" ||
        item.verificationStatus ===
          filters.verificationStatus;

      const matchesValidity =
        filters.validityStatus ===
          "all" ||
        item.validityStatus ===
          filters.validityStatus;

      const matchesRisk =
        filters.riskLevel === "all" ||
        item.riskLevel ===
          filters.riskLevel;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesVerification &&
        matchesValidity &&
        matchesRisk
      );
    });
  }, [evidence, filters]);

  const readiness =
    calculateEvidenceReadiness(
      evidence,
    );

  const compliance =
    evaluateEvidenceCompliance(
      evidence,
    );

  const summary = useMemo(() => {
    const verifiedEvidence =
      evidence.filter(
        (item) =>
          item.verificationStatus ===
          "verified",
      ).length;

    const pendingEvidence =
      evidence.filter(
        (item) =>
          item.verificationStatus ===
            "pending" ||
          item.verificationStatus ===
            "needs_review",
      ).length;

    const validEvidence =
      evidence.filter(
        (item) =>
          item.validityStatus ===
          "valid",
      ).length;

    const expiringEvidence =
      evidence.filter(
        (item) =>
          item.validityStatus ===
          "expiring",
      ).length;

    const expiredEvidence =
      evidence.filter(
        (item) =>
          item.validityStatus ===
          "expired",
      ).length;

    const mandatory =
      evidence.filter(
        (item) =>
          item.isMandatory,
      );

    const mandatoryComplete =
      mandatory.filter(
        (item) =>
          item.verificationStatus ===
            "verified" &&
          item.isCurrent,
      ).length;

    const openFindings =
      evidence.reduce(
        (count, item) =>
          count +
          item.findings.filter(
            (finding) =>
              finding.correctiveActionStatus !==
              "closed",
          ).length,
        0,
      );

    const highRisk =
      evidence.filter(
        (item) =>
          item.riskLevel ===
            "high" ||
          item.riskLevel ===
            "critical",
      ).length;

    return {
      verifiedEvidence,
      pendingEvidence,
      validEvidence,
      expiringEvidence,
      expiredEvidence,
      mandatoryComplete,
      openFindings,
      highRisk,
    };
  }, [evidence]);

  const completion =
    evidence.length === 0
      ? 0
      : Math.round(
          (summary.verifiedEvidence /
            evidence.length) *
            100,
        );

  const riskLabel =
    summary.highRisk === 0
      ? "LOW"
      : evidence.some(
            (item) =>
              item.riskLevel ===
              "critical",
          )
        ? "CRITICAL"
        : "HIGH";

  function handleAddEvidence() {
    const next =
      createInitialEvidence();

    setEvidence((current) => [
      ...current,
      next,
    ]);

    setSelectedEvidenceId(
      next.id,
    );
  }

  function handleDeleteEvidence(
    id: string,
  ) {
    setEvidence((current) =>
      current.filter(
        (item) =>
          item.id !== id,
      ),
    );

    setSelectedEvidenceId(
      (current) =>
        current === id
          ? null
          : current,
    );
  }

  function handleUpdateEvidence(
    patch: Partial<EvidenceRecord>,
  ) {
    if (!selectedEvidenceId) {
      return;
    }

    setEvidence((current) =>
      current.map((item) =>
        item.id ===
        selectedEvidenceId
          ? {
              ...item,
              ...patch,
              updatedAt:
                new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  return (
    <main className="min-h-screen min-w-0 bg-[#020914] text-white">
      <EvidenceHeader
        evidenceCount={
          evidence.length
        }
        completion={completion}
        readiness={
          readiness.score
        }
        risk={riskLabel}
      />

      <div className="w-full min-w-0 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <EvidenceToolbar
          filters={filters}
          onSearchChange={(value) =>
            setFilters(
              (current) => ({
                ...current,
                search: value,
              }),
            )
          }
          onCategoryChange={(
            value: EvidenceCategory | "all",
          ) =>
            setFilters(
              (current) => ({
                ...current,
                category: value,
              }),
            )
          }
          onTypeChange={(
            value: EvidenceType | "all",
          ) =>
            setFilters(
              (current) => ({
                ...current,
                type: value,
              }),
            )
          }
          onVerificationChange={(
            value:
              | EvidenceVerificationStatus
              | "all",
          ) =>
            setFilters(
              (current) => ({
                ...current,
                verificationStatus:
                  value,
              }),
            )
          }
          onValidityChange={(
            value:
              | EvidenceValidityStatus
              | "all",
          ) =>
            setFilters(
              (current) => ({
                ...current,
                validityStatus:
                  value,
              }),
            )
          }
          onRiskChange={(
            value:
              | EvidenceRiskLevel
              | "all",
          ) =>
            setFilters(
              (current) => ({
                ...current,
                riskLevel: value,
              }),
            )
          }
          onAddEvidence={
            handleAddEvidence
          }
        />

        <EvidenceSummaryCards
          totalEvidence={
            evidence.length
          }
          verifiedEvidence={
            summary.verifiedEvidence
          }
          pendingEvidence={
            summary.pendingEvidence
          }
          validEvidence={
            summary.validEvidence
          }
          expiringEvidence={
            summary.expiringEvidence
          }
          expiredEvidence={
            summary.expiredEvidence
          }
          mandatoryComplete={
            summary.mandatoryComplete
          }
          openFindings={
            summary.openFindings
          }
        />

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <EvidenceRegister
            evidence={
              filteredEvidence
            }
            selectedEvidenceId={
              selectedEvidenceId
            }
            onSelectEvidence={
              setSelectedEvidenceId
            }
            onDeleteEvidence={
              handleDeleteEvidence
            }
            onAddEvidence={
              handleAddEvidence
            }
          />

          <div className="min-w-0 space-y-6">
            {selectedEvidence ? (
              <>
                <EvidenceDetails
                  evidence={
                    selectedEvidence
                  }
                  onChange={
                    handleUpdateEvidence
                  }
                />

                <EvidenceVerification
                  evidence={
                    selectedEvidence
                  }
                  onChange={
                    handleUpdateEvidence
                  }
                />

                <EvidenceFindings
                  evidence={
                    selectedEvidence
                  }
                  onChange={(
                    findings,
                  ) =>
                    handleUpdateEvidence(
                      { findings },
                    )
                  }
                />
              </>
            ) : (
              <EmptySelection />
            )}

            <EvidenceDecisionPanel
              readiness={
                readiness
              }
              compliance={
                compliance
              }
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-4 py-3 text-[8px] text-white/20">
          Assessment ID:{" "}
          {assessmentId}
        </div>
      </div>
    </main>
  );
}

function EmptySelection() {
  return (
    <section className="flex min-h-[420px] min-w-0 items-center justify-center rounded-[24px] border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center">
      <div className="max-w-md">
        <div className="text-sm font-semibold text-white/45">
          Select Evidence
        </div>

        <p className="mt-2 text-[10px] leading-5 text-white/25">
          Select an evidence record from
          the register to inspect its
          details, verification status,
          findings and corrective actions.
        </p>
      </div>
    </section>
  );
}
