"use client";


import {
  createFactoryEvidence,
  updateFactoryEvidence,
} from "./actions";
import { useMemo, useState } from "react";

import {
  calculateFactoryReadiness,
} from "./factory.readiness";

import {
  evaluateFactoryCompliance,
} from "./factoryComplianceDecision";

import {
  createInitialFactory,
} from "./factory.factory";

import type {
  FactoryDocument,
  FactoryFilterState,
  FactoryProfile,
  FactoryRiskLevel,
  FactoryValidityStatus,
  FactoryVerificationStatus,
} from "./factory.types";

import FactoryHeader from "./components/FactoryHeader";
import FactoryToolbar from "./components/FactoryToolbar";
import FactorySummaryCards from "./components/FactorySummaryCards";
import FactoryRegister from "./components/FactoryRegister";
import FactoryDetails from "./components/FactoryDetails";
import FactoryVerification from "./components/FactoryVerification";
import FactoryUtilities from "./components/FactoryUtilities";
import FactoryFindings from "./components/FactoryFindings";
import FactoryDecisionPanel from "./components/FactoryDecisionPanel";

export type FactoryWorkspaceProps = {
  assessmentId: string;
  initialData?: FactoryProfile;
};

export default function FactoryWorkspace({
  assessmentId,
  initialData,
}: FactoryWorkspaceProps) {
  const [factory, setFactory] =
    useState<FactoryProfile>(
      initialData ??
        createInitialFactory(
          assessmentId,
        ),
    );

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<string | null>(
      factory.documents[0]?.id ??
        null,
    );

  const [filters, setFilters] =
    useState<FactoryFilterState>({
      search: "",
      documentType: "all",
      verificationStatus: "all",
      validityStatus: "all",
      riskLevel: "all",
    });

  const readiness =
    useMemo(
      () =>
        calculateFactoryReadiness(
          factory,
        ),
      [factory],
    );

  const compliance =
    useMemo(
      () =>
        evaluateFactoryCompliance(
          factory,
        ),
      [factory],
    );

  const selectedDocument =
    factory.documents.find(
      (document) =>
        document.id ===
        selectedDocumentId,
    ) ?? null;

  const filteredDocuments =
    useMemo(() => {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      return factory.documents.filter(
        (document) => {
          const matchesSearch =
            !search ||
            [
              document.documentName,
              document.documentNumber,
              document.issuingAuthority,
              document.fileName,
              document.remarks,
            ]
              .join(" ")
              .toLowerCase()
              .includes(search);

          const matchesType =
            filters.documentType ===
              "all" ||
            document.documentType ===
              filters.documentType;

          const matchesVerification =
            filters.verificationStatus ===
              "all" ||
            document.verificationStatus ===
              filters.verificationStatus;

          const matchesValidity =
            filters.validityStatus ===
              "all" ||
            document.validityStatus ===
              filters.validityStatus;

          const matchesRisk =
            filters.riskLevel ===
              "all" ||
            factory.riskLevel ===
              filters.riskLevel;

          return (
            matchesSearch &&
            matchesType &&
            matchesVerification &&
            matchesValidity &&
            matchesRisk
          );
        },
      );
    }, [
      factory.documents,
      factory.riskLevel,
      filters,
    ]);

  const summary =
    useMemo(() => {
      const documents =
        factory.documents;

      const utilities =
        factory.infrastructure
          .utilities;

      const openFindings =
        factory.findings.filter(
          (finding) =>
            finding.correctiveActionStatus !==
            "closed",
        );

      return {
        totalDocuments:
          documents.length,

        verifiedDocuments:
          documents.filter(
            (document) =>
              document.verificationStatus ===
              "verified",
          ).length,

        pendingDocuments:
          documents.filter(
            (document) =>
              document.verificationStatus ===
              "pending",
          ).length,

        rejectedDocuments:
          documents.filter(
            (document) =>
              document.verificationStatus ===
              "rejected",
          ).length,

        validDocuments:
          documents.filter(
            (document) =>
              document.validityStatus ===
              "valid",
          ).length,

        expiringDocuments:
          documents.filter(
            (document) =>
              document.validityStatus ===
              "expiring",
          ).length,

        expiredDocuments:
          documents.filter(
            (document) =>
              document.validityStatus ===
              "expired",
          ).length,

        mandatoryDocuments:
          documents.filter(
            (document) =>
              document.isMandatory,
          ).length,

        mandatoryComplete:
          documents.filter(
            (document) =>
              document.isMandatory &&
              document.verificationStatus ===
                "verified" &&
              document.isCurrent,
          ).length,

        totalUtilities:
          utilities.length,

        verifiedUtilities:
          utilities.filter(
            (utility) =>
              utility.verified &&
              utility.status ===
                "available",
          ).length,

        openFindings:
          openFindings.length,

        majorFindings:
          openFindings.filter(
            (finding) =>
              finding.severity ===
              "major",
          ).length,

        criticalFindings:
          openFindings.filter(
            (finding) =>
              finding.severity ===
              "critical",
          ).length,
      };
    }, [factory]);

  function updateFactory(
    patch: Partial<FactoryProfile>,
  ) {
    setFactory((current) => ({
      ...current,
      ...patch,
      updatedAt:
        new Date().toISOString(),
    }));
  }

  function addDocument() {
    const document: FactoryDocument = {
      id: `factory-doc-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      factoryId: factory.id,

      documentType: "other",
      documentName: "",
      documentNumber: "",

      issuingAuthority: "",

      issueDate: "",
      expiryDate: "",

      validityStatus: "unknown",
      verificationStatus: "pending",

      fileName: "",
      fileReference: "",

      isMandatory: false,
      isCurrent: false,

      verifiedBy: "",
      verificationDate: "",

      remarks: "",
    };

    setFactory((current) => ({
      ...current,

      documents: [
        ...current.documents,
        document,
      ],

      updatedAt:
        new Date().toISOString(),
    }));

    setSelectedDocumentId(
      document.id,
    );
  }
  function updateDocument(
    patch: Partial<FactoryDocument>,
  ) {
    if (!selectedDocumentId) {
      return;
    }

    setFactory((current) => ({
      ...current,

      documents:
        current.documents.map(
          (document) =>
            document.id ===
            selectedDocumentId
              ? {
                  ...document,
                  ...patch,
                }
              : document,
        ),

      updatedAt:
        new Date().toISOString(),
    }));
  }
  function deleteDocument(
    id: string,
  ) {
    setFactory((current) => ({
      ...current,

      documents:
        current.documents.filter(
          (document) =>
            document.id !== id,
        ),

      updatedAt:
        new Date().toISOString(),
    }));

    if (
      selectedDocumentId === id
    ) {
      setSelectedDocumentId(
        null,
      );
    }
  }

  function handleRiskChange(
    value: FactoryRiskLevel,
  ) {
    updateFactory({
      riskLevel: value,
    });
  }

  const [isSavingEvidence, setIsSavingEvidence] =
    useState(false);

  const [evidenceSaveMessage, setEvidenceSaveMessage] =
    useState("");

  async function saveSelectedEvidence() {
    if (!selectedDocument) {
      return;
    }

    const document = selectedDocument;

    if (
      document.documentType === "other" &&
      !document.documentName.trim() &&
      !document.documentNumber.trim() &&
      !document.fileName.trim() &&
      !document.fileReference.trim()
    ) {
      setEvidenceSaveMessage(
        "Complete the evidence details before saving.",
      );
      return;
    }

    setIsSavingEvidence(true);
    setEvidenceSaveMessage("");

    try {
      const isPersisted =
        document.id &&
        !document.id.startsWith("factory-doc-");

      if (isPersisted) {
        await updateFactoryEvidence(
          document.id,
          document,
        );

        setEvidenceSaveMessage(
          "Evidence updated successfully.",
        );
        return;
      }

      const saved =
        await createFactoryEvidence(
          assessmentId,
          factory.id,
          document,
        );

      setFactory((current) => ({
        ...current,
        documents:
          current.documents.map(
            (item) =>
              item.id === document.id
                ? saved
                : item,
          ),
        updatedAt:
          new Date().toISOString(),
      }));

      setSelectedDocumentId(saved.id);

      setEvidenceSaveMessage(
        "Evidence saved successfully.",
      );
    } catch (error) {
      setEvidenceSaveMessage(
        error instanceof Error
          ? error.message
          : "Failed to save evidence.",
      );
    } finally {
      setIsSavingEvidence(false);
    }
  }

  function setSearch(
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      search: value,
    }));
  }

  return (
    <div className="w-full min-w-0 bg-[#030b17] text-white">
      <FactoryHeader
        documentCount={
          summary.totalDocuments
        }
        utilityCount={
          summary.totalUtilities
        }
        readiness={
          readiness.score
        }
        risk={factory.riskLevel}
        decision={
          compliance.decision
        }
      />

      <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-10">
        <FactoryToolbar
          filters={filters}
          onSearchChange={setSearch}
          onDocumentTypeChange={(
            value,
          ) =>
            setFilters(
              (current) => ({
                ...current,
                documentType: value,
              }),
            )
          }
          onVerificationChange={(
            value,
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
            value,
          ) =>
            setFilters(
              (current) => ({
                ...current,
                validityStatus:
                  value,
              }),
            )
          }
          onRiskChange={(value) =>
            setFilters(
              (current) => ({
                ...current,
                riskLevel: value,
              }),
            )
          }
          onAddDocument={
            addDocument
          }
        />

        <FactorySummaryCards
          totalDocuments={
            summary.totalDocuments
          }
          verifiedDocuments={
            summary.verifiedDocuments
          }
          pendingDocuments={
            summary.pendingDocuments
          }
          rejectedDocuments={
            summary.rejectedDocuments
          }
          validDocuments={
            summary.validDocuments
          }
          expiringDocuments={
            summary.expiringDocuments
          }
          expiredDocuments={
            summary.expiredDocuments
          }
          mandatoryComplete={
            summary.mandatoryComplete
          }
          mandatoryDocuments={
            summary.mandatoryDocuments
          }
          totalUtilities={
            summary.totalUtilities
          }
          verifiedUtilities={
            summary.verifiedUtilities
          }
          openFindings={
            summary.openFindings
          }
          majorFindings={
            summary.majorFindings
          }
          criticalFindings={
            summary.criticalFindings
          }
        />

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="min-w-0 space-y-6">
            <FactoryDetails
              factory={factory}
              onChange={
                updateFactory
              }
            />

            <FactoryUtilities
              factory={factory}
              onChange={
                updateFactory
              }
            />

            <FactoryFindings
              factory={factory}
              onChange={(findings) =>
                updateFactory({
                  findings,
                })
              }
            />

            <FactoryDecisionPanel
              readiness={
                readiness
              }
              compliance={
                compliance
              }
            />
          </div>

          <div className="min-w-0 space-y-6">
            <FactoryRegister
              documents={
                filteredDocuments
              }
              selectedDocumentId={
                selectedDocumentId
              }
              onSelectDocument={(
                id,
              ) =>
                setSelectedDocumentId(
                  id,
                )
              }
              onDeleteDocument={
                deleteDocument
              }
              onAddDocument={
                addDocument
              }
            />

            {selectedDocument ? (
              <FactoryVerification
                assessmentId={
                  assessmentId
                }
                factoryProfileId={
                  factory.id
                }
                document={
                  selectedDocument
                }
                riskLevel={
                  factory.riskLevel
                }
                onChange={
                  updateDocument
                }
                onRiskChange={
                  handleRiskChange
                }
                onSave={
                  saveSelectedEvidence
                }
                isSaving={
                  isSavingEvidence
                }
                saveMessage={
                  evidenceSaveMessage
                }
              />
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center">
                <div className="text-sm font-semibold text-white/40">
                  Select a document
                </div>

                <p className="mt-2 text-[10px] leading-5 text-white/20">
                  Select a factory document from
                  the register to open its
                  verification panel.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
















