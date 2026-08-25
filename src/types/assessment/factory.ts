export type FactoryRiskLevel =
  | "not_assessed"
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type FactoryStatus =
  | "draft"
  | "in_progress"
  | "ready_for_review"
  | "submitted"
  | "under_review"
  | "completed";

export type EvidenceType =
  | "document"
  | "photo"
  | "video"
  | "certificate"
  | "declaration"
  | "other";

export type EvidenceVerificationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "needs_review";

export type FactorySectionCode =
  | "identity"
  | "location"
  | "infrastructure"
  | "machinery"
  | "process"
  | "capacity"
  | "manpower"
  | "quality"
  | "testing"
  | "storage"
  | "safety"
  | "evidence";

export interface FactoryMachinery {
  name: string;
  manufacturer: string;
  model: string;
  quantity: number;
  ownership: "owned" | "leased" | "shared";
  capacity: string;
  year: string;
}

export interface FactoryWorkerGroup {
  category: string;
  count: number;
  qualification: string;
  experience: string;
}

export interface FactoryTestingEquipment {
  name: string;
  quantity: number;
  range: string;
  calibrationAvailable: boolean;
  calibrationExpiry: string;
}

export interface FactorySectionStatus {
  completion: number;
  ready: boolean;
  issues: string[];
}

export interface FactoryProfileInput {
  factoryName: string;
  ownershipType: string;
  ownershipName: string;

  factoryRegistrationNumber: string;
  factoryLicenseNumber: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;

  latitude: string;
  longitude: string;

  premisesType: string;
  premisesArea: string;
  premisesAreaUnit: string;

  builtUpArea: string;
  productionArea: string;
  storageArea: string;
  officeArea: string;

  powerConnectionAvailable: boolean;
  powerCapacity: string;
  powerCapacityUnit: string;

  waterAvailable: boolean;
  drainageAvailable: boolean;
  loadingUnloadingAvailable: boolean;
  internalTransportAvailable: boolean;

  machineryCount: string;
  ownedMachineryCount: string;
  leasedMachineryCount: string;
  machineryDetails: FactoryMachinery[];

  manufacturingProcessAvailable: boolean;
  processDescription: string;
  processFlowDocumentAvailable: boolean;

  productionCapacity: string;
  productionCapacityUnit: string;
  currentUtilizationPercent: string;
  shiftsPerDay: string;
  workingDaysPerMonth: string;
  monthlyProductionCapacity: string;

  totalWorkers: string;
  technicalWorkers: string;
  supervisoryWorkers: string;
  qualityWorkers: string;
  manpowerDetails: FactoryWorkerGroup[];

  qualityControlAvailable: boolean;
  qualityDepartmentAvailable: boolean;
  inspectionProcessAvailable: boolean;
  incomingInspectionAvailable: boolean;
  inProcessInspectionAvailable: boolean;
  finalInspectionAvailable: boolean;
  qualitySystemDescription: string;

  testingFacilityAvailable: boolean;
  testingEquipmentDetails: FactoryTestingEquipment[];
  externalTestingUsed: boolean;
  externalTestingDetails: string;

  rawMaterialStorageAvailable: boolean;
  finishedGoodsStorageAvailable: boolean;
  inventoryControlAvailable: boolean;
  storageDetails: string;

  fireSafetyAvailable: boolean;
  fireNocAvailable: boolean;
  electricalSafetyAvailable: boolean;
  workerSafetySystemAvailable: boolean;
  safetyTrainingAvailable: boolean;
  safetyDetails: string;

  assessmentNotes: string;
}

export interface FactoryAssessmentResult {
  completionPercent: number;
  readinessScore: number;
  riskLevel: FactoryRiskLevel;
  status: FactoryStatus;
  sectionStatus: Record<
    FactorySectionCode,
    FactorySectionStatus
  >;
  issues: string[];
}