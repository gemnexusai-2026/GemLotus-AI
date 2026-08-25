/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Domain Types
   ============================================================ */

export type ProductStatus =
  | "draft"
  | "active"
  | "under_review"
  | "verified"
  | "rejected";

export type ProductCategory =
  | "furniture"
  | "electrical"
  | "mechanical"
  | "textile"
  | "plastic"
  | "medical"
  | "it_equipment"
  | "other";

export type OwnershipType =
  | "manufactured"
  | "assembled"
  | "outsourced"
  | "traded";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "needs_review";

export type EvidenceStatus =
  | "missing"
  | "partial"
  | "uploaded"
  | "verified"
  | "rejected";

export type TestStatus =
  | "not_required"
  | "pending"
  | "available"
  | "expired"
  | "failed";

export type ProductEvidenceType =
  | "product_photo"
  | "technical_document"
  | "test_report"
  | "certificate"
  | "catalog"
  | "drawing"
  | "sample_photo"
  | "other";

export type ProductFindingSeverity =
  | "observation"
  | "minor"
  | "major"
  | "critical";

export type ProductReadinessLevel =
  | "not_ready"
  | "partially_ready"
  | "ready"
  | "highly_ready";

export type ProductDecision =
  | "approved"
  | "conditionally_approved"
  | "hold"
  | "rejected";

export type ProductSpecification = {
  id: string;
  parameter: string;
  declaredValue: string;
  verifiedValue: string;
  unit: string;
  source: string;
  verificationStatus: VerificationStatus;
  remarks: string;
};

export type ProductEvidence = {
  id: string;
  productId: string;
  type: ProductEvidenceType;
  name: string;
  referenceNumber: string;
  issueDate: string;
  expiryDate: string;
  status: EvidenceStatus;
  remarks: string;
};

export type ProductVerification = {
  id: string;
  productId: string;

  physicalSampleAvailable: boolean;
  physicalSampleVerified: boolean;

  specificationVerified: boolean;
  manufacturingCapabilityVerified: boolean;
  productionProcessVerified: boolean;

  verificationStatus: VerificationStatus;

  verifiedBy: string;
  verificationDate: string;
  remarks: string;
};

export type ProductQualityTesting = {
  id: string;
  productId: string;

  qualityControlAvailable: boolean;
  inspectionProcedureAvailable: boolean;

  testRequired: boolean;
  testStatus: TestStatus;

  testName: string;
  testingLaboratory: string;
  reportNumber: string;
  testDate: string;
  expiryDate: string;

  remarks: string;
};

export type ProductFinding = {
  id: string;
  productId: string;

  title: string;
  description: string;

  severity: ProductFindingSeverity;

  requirement: string;
  evidenceReference: string;

  correctiveAction: string;
  correctiveActionStatus: "open" | "in_progress" | "closed";

  remarks: string;
};

export type ProductRecord = {
  id: string;

  productCode: string;
  productName: string;
  productCategory: ProductCategory;

  brandName: string;
  modelNumber: string;
  sku: string;

  description: string;

  ownershipType: OwnershipType;

  manufacturingLocation: string;
  manufacturingProcess: string;

  productStatus: ProductStatus;

  specifications: ProductSpecification[];

  evidence: ProductEvidence[];

  verification: ProductVerification;

  qualityTesting: ProductQualityTesting;

  findings: ProductFinding[];

  technicalDocumentsAvailable: boolean;
  catalogAvailable: boolean;
  productPhotoAvailable: boolean;

  createdAt: string;
  updatedAt: string;

  remarks: string;
};

export type ProductAssessmentSummary = {
  totalProducts: number;
  activeProducts: number;
  verifiedProducts: number;
  pendingProducts: number;

  evidenceComplete: number;
  specificationVerified: number;
  physicalVerified: number;
  testingComplete: number;

  openFindings: number;
  majorFindings: number;
  criticalFindings: number;
};

export type ProductScoreBreakdown = {
  productDefinition: number;
  specificationCompliance: number;
  evidenceReadiness: number;
  physicalVerification: number;
  qualityTesting: number;
  manufacturingRelevance: number;
  overallScore: number;
};

export type ProductReadinessResult = {
  score: number;
  level: ProductReadinessLevel;

  strengths: string[];
  gaps: string[];
  blockers: string[];

  recommendation: string;
};

export type ProductComplianceResult = {
  decision: ProductDecision;

  canProceed: boolean;

  reasons: string[];

  blockers: string[];

  requiredActions: string[];
};

export type ProductAssessmentState = {
  products: ProductRecord[];

  selectedProductId: string | null;

  search: string;
  categoryFilter: ProductCategory | "all";
  statusFilter: ProductStatus | "all";

  summary: ProductAssessmentSummary;

  score: ProductScoreBreakdown;

  readiness: ProductReadinessResult;

  compliance: ProductComplianceResult;
};
