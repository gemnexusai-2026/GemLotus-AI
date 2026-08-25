import type { EvidenceRecord } from "./evidence.types";

export function createInitialEvidence(): EvidenceRecord {
  const now = new Date().toISOString();

  const evidenceId =
    `evidence-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  return {
    id: evidenceId,

    evidenceCode: "",
    title: "",
    description: "",

    category: "other",
    type: "other",

    fileName: "",
    fileReference: "",
    documentNumber: "",

    issueDate: "",
    expiryDate: "",

    validityStatus: "unknown",
    verificationStatus: "pending",

    issuingAuthority: "",
    relatedModule: "",
    relatedEntityId: "",

    sourceDescription: "",

    isMandatory: false,
    isCurrent: false,

    riskLevel: "low",

    verifiedBy: "",
    verificationDate: "",

    findings: [],

    remarks: "",

    createdAt: now,
    updatedAt: now,
  };
}
