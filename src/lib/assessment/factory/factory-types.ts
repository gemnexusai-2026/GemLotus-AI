/**
 * ============================================================
 * GemLotus AI
 * Factory Assessment OS
 * Internal Factory Domain Types
 * ============================================================
 *
 * Responsibility:
 * - Internal domain contracts for Factory Assessment
 * - Engine-safe types
 * - No Supabase/browser/React dependencies
 * - No database queries
 * - No UI concerns
 *
 * Database row types belong to:
 *   @/types/assessment/factory
 * ============================================================
 */

/* ============================================================
   FACTORY SECTION
============================================================ */

export type FactorySectionCode =
  | "location"
  | "infrastructure"
  | "machinery"
  | "manufacturing_process"
  | "production_capacity"
  | "quality_control"
  | "testing"
  | "raw_material"
  | "manpower"
  | "safety"
  | "storage"
  | "utilities"
  | "evidence";


/* ============================================================
   FACTORY VERIFICATION STATUS
============================================================ */

export type FactoryVerificationStatus =
  | "not_started"
  | "in_progress"
  | "partially_verified"
  | "verified"
  | "failed"
  | "not_applicable";


/* ============================================================
   EVIDENCE STATUS
============================================================ */

export type FactoryEvidenceStatus =
  | "missing"
  | "uploaded"
  | "verified"
  | "rejected"
  | "expired"
  | "not_applicable";


/* ============================================================
   FACTORY ITEM TYPE
============================================================ */

export type FactoryItemType =
  | "document"
  | "physical"
  | "process"
  | "verification"
  | "photo"
  | "video"
  | "financial"
  | "certificate"
  | "declaration"
  | "other";


/* ============================================================
   FACTORY RISK LEVEL
============================================================ */

export type FactoryRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";


/* ============================================================
   FACTORY READINESS STATUS
============================================================ */

export type FactoryReadinessStatus =
  | "not_ready"
  | "partially_ready"
  | "ready"
  | "conditionally_ready"
  | "not_applicable";


/* ============================================================
   FACTORY ASSESSMENT RESULT
============================================================ */

export interface FactoryAssessmentResult {
  assessmentId: string;

  status: FactoryVerificationStatus;

  readinessStatus: FactoryReadinessStatus;

  riskLevel: FactoryRiskLevel;

  score: number;

  maximumScore: number;

  percentage: number;

  verifiedItems: number;

  pendingItems: number;

  failedItems: number;

  notApplicableItems: number;

  mandatoryItems: number;

  mandatoryCompleted: number;

  sectionResults: FactorySectionResult[];

  blockers: FactoryAssessmentBlocker[];

  recommendations: FactoryAssessmentRecommendation[];
}


/* ============================================================
   SECTION RESULT
============================================================ */

export interface FactorySectionResult {
  section: FactorySectionCode;

  label: string;

  score: number;

  maximumScore: number;

  percentage: number;

  status: FactoryVerificationStatus;

  riskLevel: FactoryRiskLevel;

  totalItems: number;

  completedItems: number;

  mandatoryItems: number;

  mandatoryCompleted: number;

  pendingItems: number;

  failedItems: number;
}


/* ============================================================
   ASSESSMENT BLOCKER
============================================================ */

export interface FactoryAssessmentBlocker {
  code: string;

  title: string;

  description: string;

  section: FactorySectionCode;

  severity: FactoryRiskLevel;

  mandatory: boolean;

  resolution: string;
}


/* ============================================================
   RECOMMENDATION
============================================================ */

export interface FactoryAssessmentRecommendation {
  code: string;

  title: string;

  description: string;

  section: FactorySectionCode;

  priority: "low" | "medium" | "high" | "critical";

  action: string;
}


/* ============================================================
   FACTORY CHECKLIST ITEM
============================================================ */

export interface FactoryChecklistItem {
  id: string;

  code: string;

  section: FactorySectionCode;

  title: string;

  description: string | null;

  itemType: FactoryItemType;

  mandatory: boolean;

  evidenceRequired: boolean;

  scoringWeight: number;

  verificationStatus: FactoryVerificationStatus;

  evidenceStatus: FactoryEvidenceStatus;

  score: number;

  maximumScore: number;

  notes: string;

  evidenceCount: number;

  applicable: boolean;
}


/* ============================================================
   FACTORY EVIDENCE
============================================================ */

export interface FactoryEvidence {
  id: string;

  checklistItemId: string;

  type: FactoryItemType;

  fileName: string;

  fileUrl?: string | null;

  status: FactoryEvidenceStatus;

  uploadedAt?: string | null;

  verifiedAt?: string | null;

  rejectionReason?: string | null;
}


/* ============================================================
   FACTORY LOCATION
============================================================ */

export interface FactoryLocationInput {
  factoryName: string;

  addressLine1: string;

  addressLine2: string;

  city: string;

  district: string;

  state: string;

  pincode: string;

  country: string;

  latitude: number | null;

  longitude: number | null;

  ownershipType: string;

  areaSqFt: number | null;

  builtUpAreaSqFt: number | null;
}


/* ============================================================
   FACTORY INFRASTRUCTURE
============================================================ */

export interface FactoryInfrastructureInput {
  productionAreaSqFt: number | null;

  storageAreaSqFt: number | null;

  rawMaterialAreaSqFt: number | null;

  finishedGoodsAreaSqFt: number | null;

  officeAreaSqFt: number | null;

  qualityLabAvailable: boolean;

  testingFacilityAvailable: boolean;

  warehouseAvailable: boolean;

  fireSafetyAvailable: boolean;

  powerBackupAvailable: boolean;

  waterSupplyAvailable: boolean;

  wasteManagementAvailable: boolean;
}


/* ============================================================
   FACTORY MACHINERY
============================================================ */

export interface FactoryMachineryItem {
  id?: string;

  name: string;

  category: string;

  make: string;

  model: string;

  quantity: number;

  ownershipType: string;

  capacity: string;

  condition: string;

  operational: boolean;

  installationYear: number | null;

  evidenceStatus: FactoryEvidenceStatus;

  notes: string;
}


/* ============================================================
   MANUFACTURING PROCESS
============================================================ */

export interface FactoryProcessStep {
  sequence: number;

  processCode: string;

  processName: string;

  description: string;

  inHouse: boolean;

  outsourced: boolean;

  controlled: boolean;

  evidenceStatus: FactoryEvidenceStatus;

  notes: string;
}


/* ============================================================
   PRODUCTION CAPACITY
============================================================ */

export interface FactoryProductionCapacity {
  productCategory: string;

  productName: string;

  installedCapacity: number | null;

  installedCapacityUnit: string;

  actualCapacity: number | null;

  actualCapacityUnit: string;

  monthlyCapacity: number | null;

  annualCapacity: number | null;

  capacityUtilizationPercent: number | null;
}


/* ============================================================
   QUALITY CONTROL
============================================================ */

export interface FactoryQualityControl {
  incomingInspection: boolean;

  inProcessInspection: boolean;

  finalInspection: boolean;

  qualityManualAvailable: boolean;

  inspectionRecordsAvailable: boolean;

  calibrationSystemAvailable: boolean;

  nonConformanceSystemAvailable: boolean;

  correctiveActionSystemAvailable: boolean;
}


/* ============================================================
   TESTING CAPABILITY
============================================================ */

export interface FactoryTestingCapability {
  internalTestingAvailable: boolean;

  externalTestingUsed: boolean;

  testingLaboratoryName: string;

  calibrationAvailable: boolean;

  testReportsAvailable: boolean;

  certificatesAvailable: boolean;

  testingFrequency: string;
}


/* ============================================================
   RAW MATERIAL
============================================================ */

export interface FactoryRawMaterial {
  materialName: string;

  category: string;

  primarySupplier: string;

  alternateSupplier: string;

  supplierQualificationAvailable: boolean;

  incomingInspectionAvailable: boolean;

  stockControlAvailable: boolean;

  traceabilityAvailable: boolean;
}


/* ============================================================
   MANPOWER
============================================================ */

export interface FactoryManpower {
  totalEmployees: number;

  productionEmployees: number;

  technicalEmployees: number;

  qualityEmployees: number;

  maintenanceEmployees: number;

  supervisors: number;

  contractWorkers: number;

  trainedEmployees: number;

  trainingRecordsAvailable: boolean;
}


/* ============================================================
   SAFETY
============================================================ */

export interface FactorySafety {
  fireExtinguishersAvailable: boolean;

  fireNocAvailable: boolean;

  emergencyExitsAvailable: boolean;

  firstAidAvailable: boolean;

  ppeAvailable: boolean;

  safetyTrainingAvailable: boolean;

  electricalSafetyAvailable: boolean;

  emergencyPlanAvailable: boolean;
}


/* ============================================================
   FACTORY ASSESSMENT STATE
============================================================ */

export interface FactoryAssessmentState {
  assessmentId: string;

  location: FactoryLocationInput;

  infrastructure: FactoryInfrastructureInput;

  machinery: FactoryMachineryItem[];

  manufacturingProcess: FactoryProcessStep[];

  productionCapacity: FactoryProductionCapacity[];

  qualityControl: FactoryQualityControl;

  testing: FactoryTestingCapability;

  rawMaterials: FactoryRawMaterial[];

  manpower: FactoryManpower;

  safety: FactorySafety;

  checklist: FactoryChecklistItem[];

  evidence: FactoryEvidence[];

  notes: string;
}


/* ============================================================
   ENGINE INPUT
============================================================ */

export interface FactoryAssessmentEngineInput {
  assessmentId: string;

  checklist: FactoryChecklistItem[];

  evidence: FactoryEvidence[];
}


/* ============================================================
   ENGINE CONFIGURATION
============================================================ */

export interface FactoryAssessmentEngineConfig {
  mandatoryCompletionThreshold: number;

  readinessThreshold: number;

  conditionalReadinessThreshold: number;

  highRiskThreshold: number;

  criticalRiskThreshold: number;
}