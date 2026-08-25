export type EvidenceCategory =
  | "company_legal"
  | "factory"
  | "machinery"
  | "product"
  | "quality"
  | "testing"
  | "financial"
  | "safety"
  | "other";

export type EvidenceType =
  | "certificate"
  | "license"
  | "registration"
  | "invoice"
  | "test_report"
  | "calibration_certificate"
  | "photograph"
  | "video"
  | "drawing"
  | "catalog"
  | "purchase_document"
  | "ownership_document"
  | "process_document"
  | "other";

export type EvidenceVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "needs_review";

export type EvidenceValidityStatus =
  | "valid"
  | "expiring"
  | "expired"
  | "not_applicable"
  | "unknown";

export type EvidenceRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type EvidenceFindingSeverity =
  | "observation"
  | "minor"
  | "major"
  | "critical";

export type EvidenceRecord = {
  id: string;

  evidenceCode: string;
  title: string;
  description: string;

  category: EvidenceCategory;
  type: EvidenceType;

  fileName: string;
  fileReference: string;
  documentNumber: string;

  issueDate: string;
  expiryDate: string;

  validityStatus: EvidenceValidityStatus;
  verificationStatus: EvidenceVerificationStatus;

  issuingAuthority: string;
  relatedModule: string;
  relatedEntityId: string;

  sourceDescription: string;

  isMandatory: boolean;
  isCurrent: boolean;

  riskLevel: EvidenceRiskLevel;

  verifiedBy: string;
  verificationDate: string;

  findings: EvidenceFinding[];

  remarks: string;

  createdAt: string;
  updatedAt: string;
};

export type EvidenceFinding = {
  id: string;

  title: string;
  description: string;

  severity: EvidenceFindingSeverity;

  requirement: string;
  evidenceReference: string;

  correctiveAction: string;

  correctiveActionStatus:
    | "open"
    | "in_progress"
    | "closed";

  remarks: string;
};

export type EvidenceAssessmentSummary = {
  totalEvidence: number;

  verifiedEvidence: number;
  pendingEvidence: number;
  rejectedEvidence: number;

  validEvidence: number;
  expiringEvidence: number;
  expiredEvidence: number;

  mandatoryEvidence: number;
  mandatoryComplete: number;

  openFindings: number;
  majorFindings: number;
  criticalFindings: number;

  highRiskEvidence: number;
};

export type EvidenceReadinessLevel =
  | "not_ready"
  | "partially_ready"
  | "ready"
  | "highly_ready";

export type EvidenceReadinessResult = {
  score: number;

  level: EvidenceReadinessLevel;

  strengths: string[];
  gaps: string[];
  blockers: string[];

  recommendation: string;
};

export type EvidenceDecision =
  | "approved"
  | "conditionally_approved"
  | "hold"
  | "rejected";

export type EvidenceComplianceResult = {
  decision: EvidenceDecision;

  canProceed: boolean;

  reasons: string[];
  blockers: string[];
  requiredActions: string[];
};

export type EvidenceFilterState = {
  search: string;

  category:
    | EvidenceCategory
    | "all";

  type:
    | EvidenceType
    | "all";

  verificationStatus:
    | EvidenceVerificationStatus
    | "all";

  validityStatus:
    | EvidenceValidityStatus
    | "all";

  riskLevel:
    | EvidenceRiskLevel
    | "all";
};
