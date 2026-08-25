export type CompanyLegalStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "expired"
  | "not_available";

export type CompanyEntityType =
  | "proprietorship"
  | "partnership"
  | "llp"
  | "private_limited"
  | "public_limited"
  | "section_8"
  | "trust"
  | "society"
  | "other";

export type CompanyDocumentType =
  | "pan"
  | "gst"
  | "udyam"
  | "incorporation"
  | "partnership_deed"
  | "llp_agreement"
  | "shop_establishment"
  | "factory_license"
  | "trade_license"
  | "other";

export type CompanyVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "needs_review";

export type CompanyValidityStatus =
  | "valid"
  | "expiring"
  | "expired"
  | "not_applicable"
  | "unknown";

export type CompanyRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type CompanyFindingSeverity =
  | "observation"
  | "minor"
  | "major"
  | "critical";

export type CompanyDocument = {
  id: string;
  companyId: string;

  documentType: CompanyDocumentType;
  documentName: string;
  documentNumber: string;

  issuingAuthority: string;

  issueDate: string;
  expiryDate: string;

  validityStatus: CompanyValidityStatus;
  verificationStatus: CompanyVerificationStatus;

  fileName: string;
  fileReference: string;

  isMandatory: boolean;
  isCurrent: boolean;

  verifiedBy: string;
  verificationDate: string;

  remarks: string;
};

export type CompanyFinding = {
  id: string;
  companyId: string;

  title: string;
  description: string;

  severity: CompanyFindingSeverity;

  requirement: string;
  evidenceReference: string;

  correctiveAction: string;

  correctiveActionStatus:
    | "open"
    | "in_progress"
    | "closed";

  remarks: string;
};

export type CompanyLegalProfile = {
  id: string;
  assessmentId: string;

  legalName: string;
  tradeName: string;

  entityType: CompanyEntityType;

  panNumber: string;
  gstNumber: string;
  udyamNumber: string;

  incorporationNumber: string;

  registeredAddress: string;
  factoryAddress: string;

  state: string;
  district: string;
  pincode: string;

  yearOfEstablishment: string;

  legalStatus: CompanyLegalStatus;

  documents: CompanyDocument[];
  findings: CompanyFinding[];

  verificationStatus: CompanyVerificationStatus;

  riskLevel: CompanyRiskLevel;

  createdAt: string;
  updatedAt: string;

  remarks: string;
};

export type CompanyAssessmentSummary = {
  totalDocuments: number;

  verifiedDocuments: number;
  pendingDocuments: number;
  rejectedDocuments: number;

  validDocuments: number;
  expiringDocuments: number;
  expiredDocuments: number;

  mandatoryDocuments: number;
  mandatoryComplete: number;

  openFindings: number;
  majorFindings: number;
  criticalFindings: number;
};

export type CompanyReadinessLevel =
  | "not_ready"
  | "partially_ready"
  | "ready"
  | "highly_ready";

export type CompanyReadinessResult = {
  score: number;

  level: CompanyReadinessLevel;

  strengths: string[];
  gaps: string[];
  blockers: string[];

  recommendation: string;
};

export type CompanyDecision =
  | "approved"
  | "conditionally_approved"
  | "hold"
  | "rejected";

export type CompanyComplianceResult = {
  decision: CompanyDecision;

  canProceed: boolean;

  reasons: string[];
  blockers: string[];
  requiredActions: string[];
};

export type CompanyFilterState = {
  search: string;

  documentType:
    | CompanyDocumentType
    | "all";

  verificationStatus:
    | CompanyVerificationStatus
    | "all";

  validityStatus:
    | CompanyValidityStatus
    | "all";

  riskLevel:
    | CompanyRiskLevel
    | "all";
};
