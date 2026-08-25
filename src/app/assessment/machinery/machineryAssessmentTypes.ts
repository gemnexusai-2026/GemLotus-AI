export type Ownership =
  | "owned"
  | "leased"
  | "rented"
  | "shared";

export type MachineStatus =
  | "operational"
  | "partially_operational"
  | "under_maintenance"
  | "not_operational";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "needs_review";

export type EvidenceStatus =
  | "missing"
  | "uploaded"
  | "verified"
  | "rejected";

export type MachineryTrace13EvidenceType =
  | "document"
  | "photo"
  | "video"
  | "certificate"
  | "test_report"
  | "other";

export type MachineryTrace13Status =
  | "pending"
  | "submitted"
  | "verified"
  | "rejected"
  | "not_applicable";

export type MachineryTrace13VerificationType =
  | "physical"
  | "operational"
  | "documentary"
  | "identity"
  | "capacity"
  | "maintenance";

export type MachineryRecord = {
  id: string;

  machineName: string;
  machineCategory: string;
  manufacturer: string;
  model: string;

  serialNumber: string;
  assetNumber: string;

  quantity: number;

  ownership: Ownership;

  yearOfManufacture: string;
  installationYear: string;

  capacity: string;
  capacityUnit: string;

  machineStatus: MachineStatus;

  productionUse: string;

  powerRequirement: string;
  powerUnit: string;

  operatorRequired: boolean;
  operatorCount: number;

  maintenanceAvailable: boolean;
  maintenanceFrequency: string;
  lastMaintenanceDate: string;

  calibrationRequired: boolean;
  calibrationAvailable: boolean;
  calibrationDate: string;
  calibrationExpiry: string;

  physicallyVerified: boolean;
  verificationStatus: VerificationStatus;

  evidenceStatus: EvidenceStatus;

  remarks: string;
};

export type EvidenceRecord = {
  id: string;
  machineId: string;

  type:
    | "photo"
    | "document"
    | "certificate"
    | "video"
    | "other";

  name: string;

  status: EvidenceStatus;

  remarks: string;
};

export type MachineryTrace13Evidence = {
  id: string;
  machineryIndex: number;
  title: string;
  type: MachineryTrace13EvidenceType;
  reference: string;
  status: MachineryTrace13Status;
  uploadedBy: string;
  uploadedAt: string;
  verifiedBy: string;
  verifiedAt: string;
  verificationType: MachineryTrace13VerificationType;
  observation: string;
  findingReference: string;
};

export type MachineryTrace13Verification = {
  id: string;
  machineryIndex: number;
  type: MachineryTrace13VerificationType;
  status: MachineryTrace13Status;
  verifiedBy: string;
  verifiedAt: string;
  observation: string;
  evidenceIds: string[];
};
