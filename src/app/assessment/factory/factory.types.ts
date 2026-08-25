export type FactoryOwnershipType =
  | "owned"
  | "leased"
  | "rented"
  | "shared"
  | "other";

export type FactoryPremisesStatus =
  | "operational"
  | "under_setup"
  | "partially_operational"
  | "non_operational"
  | "not_available";

export type FactoryDocumentType =
  | "ownership_proof"
  | "lease_agreement"
  | "rent_agreement"
  | "factory_license"
  | "layout_plan"
  | "electricity_bill"
  | "property_tax"
  | "pollution_consent"
  | "fire_noc"
  | "other";

export type FactoryVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "needs_review";

export type FactoryValidityStatus =
  | "valid"
  | "expiring"
  | "expired"
  | "not_applicable"
  | "unknown";

export type FactoryRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type FactoryFindingSeverity =
  | "observation"
  | "minor"
  | "major"
  | "critical";

export type FactoryUtilityStatus =
  | "available"
  | "partially_available"
  | "not_available"
  | "not_applicable";

export type FactoryDocument = {
  id: string;
  factoryId: string;

  documentType: FactoryDocumentType;
  documentName: string;
  documentNumber: string;

  issuingAuthority: string;

  issueDate: string;
  expiryDate: string;

  validityStatus: FactoryValidityStatus;
  verificationStatus: FactoryVerificationStatus;

  fileName: string;
  fileReference: string;

  isMandatory: boolean;
  isCurrent: boolean;

  verifiedBy: string;
  verificationDate: string;

  remarks: string;
};

export type FactoryUtility = {
  id: string;
  factoryId: string;

  utilityName: string;

  status: FactoryUtilityStatus;

  capacity: string;
  source: string;

  verified: boolean;

  evidenceReference: string;

  remarks: string;
};

export type FactoryInfrastructure = {
  id: string;
  factoryId: string;

  productionArea: string;
  storageArea: string;
  officeArea: string;
  totalBuiltUpArea: string;

  floorCount: string;

  rawMaterialStorage: boolean;
  finishedGoodsStorage: boolean;
  qualityInspectionArea: boolean;
  maintenanceArea: boolean;

  loadingUnloadingArea: boolean;
  workerFacilitiesAvailable: boolean;

  layoutAvailable: boolean;
  layoutVerified: boolean;

  utilities: FactoryUtility[];

  remarks: string;
};

export type FactoryFinding = {
  id: string;
  factoryId: string;

  title: string;
  description: string;

  severity: FactoryFindingSeverity;

  requirement: string;
  evidenceReference: string;

  correctiveAction: string;

  correctiveActionStatus:
    | "open"
    | "in_progress"
    | "closed";

  remarks: string;
};

export type FactoryProfile = {
  id: string;
  assessmentId: string;

  factoryName: string;

  ownershipType: FactoryOwnershipType;
  premisesStatus: FactoryPremisesStatus;

  registeredAddress: string;
  factoryAddress: string;

  state: string;
  district: string;
  pincode: string;

  areaUnit: "sqft" | "sqm";
  totalArea: string;

  manufacturingArea: string;

  operationalSince: string;

  infrastructure: FactoryInfrastructure;

  documents: FactoryDocument[];

  findings: FactoryFinding[];

  verificationStatus: FactoryVerificationStatus;

  riskLevel: FactoryRiskLevel;

  createdAt: string;
  updatedAt: string;

  remarks: string;
};

export type FactoryAssessmentSummary = {
  totalDocuments: number;

  verifiedDocuments: number;
  pendingDocuments: number;
  rejectedDocuments: number;

  validDocuments: number;
  expiringDocuments: number;
  expiredDocuments: number;

  mandatoryDocuments: number;
  mandatoryComplete: number;

  totalUtilities: number;
  verifiedUtilities: number;

  infrastructureChecksComplete: number;

  openFindings: number;
  majorFindings: number;
  criticalFindings: number;
};

export type FactoryReadinessLevel =
  | "not_ready"
  | "partially_ready"
  | "ready"
  | "highly_ready";

export type FactoryReadinessResult = {
  score: number;

  level: FactoryReadinessLevel;

  strengths: string[];
  gaps: string[];
  blockers: string[];

  recommendation: string;
};

export type FactoryDecision =
  | "approved"
  | "conditionally_approved"
  | "hold"
  | "rejected";

export type FactoryComplianceResult = {
  decision: FactoryDecision;

  canProceed: boolean;

  reasons: string[];
  blockers: string[];
  requiredActions: string[];
};

export type FactoryFilterState = {
  search: string;

  documentType:
    | FactoryDocumentType
    | "all";

  verificationStatus:
    | FactoryVerificationStatus
    | "all";

  validityStatus:
    | FactoryValidityStatus
    | "all";

  riskLevel:
    | FactoryRiskLevel
    | "all";
};
