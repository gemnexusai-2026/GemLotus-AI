"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  createInitialCompany,
} from "./company.factory";

import {
  calculateCompanyReadiness,
} from "./company.readiness";

import {
  evaluateCompanyCompliance,
} from "./companyComplianceDecision";

import type {
  CompanyDocument,
  CompanyFilterState,
  CompanyLegalProfile,
} from "./company.types";

import CompanyHeader from "./components/CompanyHeader";
import CompanyToolbar from "./components/CompanyToolbar";
import CompanySummaryCards from "./components/CompanySummaryCards";
import CompanyRegister from "./components/CompanyRegister";
import CompanyDetails from "./components/CompanyDetails";
import CompanyVerification from "./components/CompanyVerification";
import CompanyFindings from "./components/CompanyFindings";
import CompanyDecisionPanel from "./components/CompanyDecisionPanel";
import { loadCompanyProfile, saveCompanyProfile } from "./actions";

type CompanyWorkspaceProps = {
  assessmentId: string;
  initialData?: CompanyLegalProfile;
};

export default function CompanyWorkspace({
  assessmentId,
  initialData,
}: CompanyWorkspaceProps) {
  const [company, setCompany] =
    useState<CompanyLegalProfile>(() =>
      initialData ??
      createInitialCompany(
        assessmentId,
      ),
    );

  const [isSaving, startSaving] = useTransition();


  useEffect(() => {
    let cancelled = false;

    async function loadPersistedCompany() {
      try {
        const persisted = await loadCompanyProfile(
          assessmentId,
        );

        if (!cancelled && persisted) {
          setCompany(persisted);
          setSelectedDocumentId(
            persisted.documents[0]?.id ?? null,
          );
        }
      } catch (error) {
        console.error(
          "COMPANY_PROFILE_LOAD_FAILED",
          error,
        );
      }
    }

    loadPersistedCompany();

    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  useEffect(() => {
    if (!company || company.id === "company-local") {
      return;
    }

    const timer = window.setTimeout(() => {
      startSaving(() => {
        saveCompanyProfile(
          assessmentId,
          company,
        ).catch((error) => {
          console.error(
            "COMPANY_PROFILE_SAVE_FAILED",
            error,
          );
        });
      });
    }, 800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [assessmentId, company]);
  const [filters, setFilters] =
    useState<CompanyFilterState>({
      search: "",
      documentType: "all",
      verificationStatus: "all",
      validityStatus: "all",
      riskLevel: "all",
    });

  const [
    selectedDocumentId,
    setSelectedDocumentId,
  ] = useState<string | null>(
    company.documents[0]?.id ??
      null,
  );

  const readiness =
    useMemo(
      () =>
        calculateCompanyReadiness(
          company,
        ),
      [company],
    );

  const compliance =
    useMemo(
      () =>
        evaluateCompanyCompliance(
          company,
        ),
      [company],
    );

  const filteredDocuments =
    useMemo(() => {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      return company.documents.filter(
        (document) => {
          const matchesSearch =
            !search ||
            [
              document.documentName,
              document.documentNumber,
              document.issuingAuthority,
              document.fileName,
            ].some((value) =>
              value
                .toLowerCase()
                .includes(search),
            );

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

          return (
            matchesSearch &&
            matchesType &&
            matchesVerification &&
            matchesValidity
          );
        },
      );
    }, [company.documents, filters]);

  const selectedDocument =
    company.documents.find(
      (document) =>
        document.id ===
        selectedDocumentId,
    ) ?? null;

  const summary =
    useMemo(() => {
      const documents =
        company.documents;

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

        mandatoryComplete:
          documents.filter(
            (document) =>
              document.isMandatory &&
              document.verificationStatus ===
                "verified" &&
              document.isCurrent,
          ).length,

        openFindings:
          company.findings.filter(
            (finding) =>
              finding.correctiveActionStatus !==
              "closed",
          ).length,
      };
    }, [company]);

  function updateCompany(
    patch: Partial<CompanyLegalProfile>,
  ) {
    setCompany((current) => ({
      ...current,
      ...patch,
      updatedAt:
        new Date().toISOString(),
    }));
  }

  function updateDocument(
    id: string,
    patch: Partial<CompanyDocument>,
  ) {
    setCompany((current) => ({
      ...current,
      updatedAt:
        new Date().toISOString(),
      documents:
        current.documents.map(
          (document) =>
            document.id === id
              ? {
                  ...document,
                  ...patch,
                }
              : document,
        ),
    }));
  }

  function addDocument() {
    const id =
      `company-doc-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const newDocument: CompanyDocument = {
      id,
      companyId: company.id,

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

    setCompany((current) => ({
      ...current,
      updatedAt:
        new Date().toISOString(),
      documents: [
        ...current.documents,
        newDocument,
      ],
    }));

    setSelectedDocumentId(id);
  }

  function deleteDocument(
    id: string,
  ) {
    setCompany((current) => ({
      ...current,
      updatedAt:
        new Date().toISOString(),
      documents:
        current.documents.filter(
          (document) =>
            document.id !== id,
        ),
    }));

    if (
      selectedDocumentId === id
    ) {
      setSelectedDocumentId(
        null,
      );
    }
  }

  return (
    <main className="min-h-screen min-w-0 bg-[#020811] text-white">
      <CompanyHeader
        documentCount={
          company.documents.length
        }
        readiness={
          readiness.score
        }
        risk={
          company.riskLevel
        }
        decision={
          compliance.decision
        }
      />

      <div className="mx-auto w-full max-w-[1800px] min-w-0 px-4 py-6 sm:px-6 lg:px-10">
        <CompanyToolbar
          filters={filters}
          onSearchChange={(value) =>
            setFilters((current) => ({
              ...current,
              search: value,
            }))
          }
          onDocumentTypeChange={(
            value,
          ) =>
            setFilters((current) => ({
              ...current,
              documentType: value,
            }))
          }
          onVerificationChange={(
            value,
          ) =>
            setFilters((current) => ({
              ...current,
              verificationStatus:
                value,
            }))
          }
          onValidityChange={(value) =>
            setFilters((current) => ({
              ...current,
              validityStatus:
                value,
            }))
          }
          onRiskChange={(value) =>
            setFilters((current) => ({
              ...current,
              riskLevel: value,
            }))
          }
          onAddDocument={
            addDocument
          }
        />

        <CompanySummaryCards
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
          openFindings={
            summary.openFindings
          }
        />

        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="min-w-0">
            <CompanyRegister
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
          </div>

          <div className="min-w-0 space-y-6">
            <CompanyDetails
              company={company}
              onChange={
                updateCompany
              }
            />

            {selectedDocument ? (
              <CompanyVerification
                document={
                  selectedDocument
                }
                onChange={(
                  patch,
                ) =>
                  updateDocument(
                    selectedDocument.id,
                    patch,
                  )
                }
              />
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center">
                <div className="text-sm font-semibold text-white/40">
                  Select a legal document
                </div>

                <p className="mt-2 text-[10px] leading-5 text-white/20">
                  Select a document from
                  the register to inspect
                  verification and validity
                  details.
                </p>
              </div>
            )}

            <CompanyFindings
              company={company}
              onChange={(findings) =>
                updateCompany({
                  findings,
                })
              }
            />

            <CompanyDecisionPanel
              readiness={
                readiness
              }
              compliance={
                compliance
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}


