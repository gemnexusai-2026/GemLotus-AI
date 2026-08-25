/* ============================================================
   GEMNEXUS AI
   OEM ASSESSMENT OS
   MACHINERY ASSESSMENT — CANONICAL TYPES
   ============================================================

   Purpose:
   Enterprise-grade machinery assessment data contract.

   Scope:
   - GeM OEM readiness
   - RITES-style physical verification support
   - Machinery register
   - Ownership verification
   - Capacity verification
   - Production relevance
   - Condition / operational status
   - Installation / commissioning
   - Maintenance
   - Calibration where applicable
   - Evidence linkage
   - Verification observations

   IMPORTANT:
   This file contains TYPES ONLY.
   No scoring logic.
   No database calls.
   No React code.
   No server actions.
   ============================================================ */


/* ============================================================
   MACHINERY RISK
============================================================ */

export type MachineryRiskLevel =
  | "not_assessed"
  | "low"
  | "moderate"
  | "high"
  | "critical";


/* ============================================================
   MACHINERY ASSESSMENT STATUS
============================================================ */

export type MachineryAssessmentStatus =
  | "draft"
  | "in_progress"
  | "ready_for_review"
  | "submitted"
  | "under_review"
  | "completed";


/* ============================================================
   MACHINERY OWNERSHIP
============================================================ */

export type MachineryOwnershipType =
  | "owned"
  | "leased"
  | "rented"
  | "hired"
  | "shared"
  | "other";


/* ============================================================
   MACHINERY OPERATIONAL STATUS
============================================================ */

export type MachineryOperationalStatus =
  | "operational"
  | "partially_operational"
  | "under_maintenance"
  | "not_operational"
  | "idle"
  | "decommissioned"
  | "unknown";


/* ============================================================
   MACHINERY CONDITION
============================================================ */

export type MachineryCondition =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "critical"
  | "unknown";


/* ============================================================
   MACHINERY INSTALLATION STATUS
============================================================ */

export type MachineryInstallationStatus =
  | "installed"
  | "partially_installed"
  | "not_installed"
  | "under_installation"
  | "unknown";


/* ============================================================
   MACHINERY VERIFICATION STATUS
============================================================ */

export type MachineryVerificationStatus =
  | "not_verified"
  | "verified"
  | "partially_verified"
  | "unable_to_verify"
  | "disputed"
  | "requires_review";


/* ============================================================
   OWNERSHIP VERIFICATION
============================================================ */

export type MachineryOwnershipVerificationStatus =
  | "not_verified"
  | "verified"
  | "partially_verified"
  | "not_available"
  | "disputed"
  | "requires_review";


/* ============================================================
   CAPACITY VERIFICATION
============================================================ */

export type MachineryCapacityVerificationStatus =
  | "not_verified"
  | "verified"
  | "partially_verified"
  | "not_available"
  | "not_applicable"
  | "requires_review";


/* ============================================================
   EVIDENCE TYPE
============================================================ */

export type MachineryEvidenceType =
  | "purchase_invoice"
  | "lease_agreement"
  | "rental_agreement"
  | "asset_register"
  | "machinery_register"
  | "installation_record"
  | "commissioning_report"
  | "maintenance_record"
  | "calibration_certificate"
  | "insurance_document"
  | "photograph"
  | "video"
  | "serial_number_photo"
  | "nameplate_photo"
  | "factory_layout"
  | "production_record"
  | "other";


/* ============================================================
   EVIDENCE VERIFICATION STATUS
============================================================ */

export type MachineryEvidenceVerificationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "needs_review";


/* ============================================================
   MACHINE CATEGORY
============================================================ */

export type MachineryCategory =
  | "production"
  | "fabrication"
  | "cutting"
  | "forming"
  | "welding"
  | "machining"
  | "assembly"
  | "finishing"
  | "surface_treatment"
  | "testing"
  | "quality_control"
  | "material_handling"
  | "utility"
  | "packaging"
  | "other";


/* ============================================================
   MACHINE POWER TYPE
============================================================ */

export type MachineryPowerType =
  | "electrical"
  | "diesel"
  | "petrol"
  | "hydraulic"
  | "pneumatic"
  | "manual"
  | "mixed"
  | "other";


/* ============================================================
   MACHINE RECORD
============================================================ */

export interface MachineryRecord {

  /* ----------------------------------------------------------
     PRIMARY IDENTITY
  ---------------------------------------------------------- */

  id: string;

  machineCode: string;

  machineName: string;

  category: MachineryCategory;

  subCategory: string;

  description: string;


  /* ----------------------------------------------------------
     MANUFACTURER INFORMATION
  ---------------------------------------------------------- */

  manufacturer: string;

  brand: string;

  model: string;

  serialNumber: string;

  assetNumber: string;


  /* ----------------------------------------------------------
     QUANTITY
  ---------------------------------------------------------- */

  quantity: number;


  /* ----------------------------------------------------------
     OWNERSHIP
  ---------------------------------------------------------- */

  ownershipType: MachineryOwnershipType;

  ownershipDetails: string;

  ownerName: string;

  ownershipVerificationStatus:
    MachineryOwnershipVerificationStatus;


  /* ----------------------------------------------------------
     PHYSICAL PRESENCE
  ---------------------------------------------------------- */

  physicallyAvailable: boolean;

  physicalLocation: string;

  installationStatus:
    MachineryInstallationStatus;


  /* ----------------------------------------------------------
     OPERATION
  ---------------------------------------------------------- */

  operationalStatus:
    MachineryOperationalStatus;

  condition:
    MachineryCondition;

  verificationStatus:
    MachineryVerificationStatus;


  /* ----------------------------------------------------------
     POWER / UTILITY
  ---------------------------------------------------------- */

  powerType: MachineryPowerType;

  powerRating: string;

  powerRatingUnit: string;


  /* ----------------------------------------------------------
     CAPACITY
  ---------------------------------------------------------- */

  ratedCapacity: string;

  ratedCapacityUnit: string;

  actualCapacity: string;

  actualCapacityUnit: string;

  capacityVerificationStatus:
    MachineryCapacityVerificationStatus;


  /* ----------------------------------------------------------
     PRODUCTION RELEVANCE
  ---------------------------------------------------------- */

  productProcess: string;

  processStage: string;

  productionUse: string;

  productionRelevant: boolean;


  /* ----------------------------------------------------------
     AGE / ACQUISITION
  ---------------------------------------------------------- */

  yearOfManufacture: string;

  yearOfPurchase: string;

  installationDate: string;


  /* ----------------------------------------------------------
     MAINTENANCE
  ---------------------------------------------------------- */

  maintenanceAvailable: boolean;

  preventiveMaintenanceAvailable: boolean;

  lastMaintenanceDate: string;

  maintenanceFrequency: string;

  maintenanceRemarks: string;


  /* ----------------------------------------------------------
     CALIBRATION
  ---------------------------------------------------------- */

  calibrationApplicable: boolean;

  calibrationAvailable: boolean;

  calibrationCertificateNumber: string;

  calibrationDate: string;

  calibrationExpiryDate: string;


  /* ----------------------------------------------------------
     VERIFICATION
  ---------------------------------------------------------- */

  verifiedBy: string;

  verificationDate: string;

  verificationRemarks: string;


  /* ----------------------------------------------------------
     EVIDENCE
  ---------------------------------------------------------- */

  evidenceIds: string[];


  /* ----------------------------------------------------------
     NOTES
  ---------------------------------------------------------- */

  remarks: string;
}


/* ============================================================
   MACHINERY EVIDENCE
============================================================ */

export interface MachineryEvidence {

  id: string;

  assessmentId: string;

  machineryId: string;

  type: MachineryEvidenceType;

  title: string;

  description: string;

  fileName: string;

  filePath: string;

  mimeType: string;

  fileSize: number;

  uploadedAt: string;

  uploadedBy: string;

  verificationStatus:
    MachineryEvidenceVerificationStatus;

  verifiedBy: string;

  verifiedAt: string;

  verificationRemarks: string;
}


/* ============================================================
   MACHINERY VERIFICATION RECORD
============================================================ */

export interface MachineryVerificationRecord {

  id: string;

  assessmentId: string;

  machineryId: string;

  verificationStatus:
    MachineryVerificationStatus;

  physicalPresenceVerified: boolean;

  identityVerified: boolean;

  serialNumberVerified: boolean;

  ownershipVerified: boolean;

  installationVerified: boolean;

  operationalStatusVerified: boolean;

  capacityVerified: boolean;

  productionRelevanceVerified: boolean;

  evidenceVerified: boolean;

  verifierName: string;

  verifierRole: string;

  verificationDate: string;

  observations: string;

  discrepancies: string[];

  correctiveActions: string[];
}


/* ============================================================
   MACHINERY SECTION STATUS
============================================================ */

export interface MachinerySectionStatus {

  completion: number;

  ready: boolean;

  verifiedCount: number;

  totalCount: number;

  evidenceCount: number;

  missingEvidenceCount: number;

  issues: string[];

  warnings: string[];

}


/* ============================================================
   MACHINERY SUMMARY
============================================================ */

export interface MachinerySummary {

  totalMachines: number;

  totalQuantity: number;

  ownedMachines: number;

  leasedMachines: number;

  rentedMachines: number;

  hiredMachines: number;

  operationalMachines: number;

  nonOperationalMachines: number;

  verifiedMachines: number;

  unverifiedMachines: number;

  evidenceBackedMachines: number;

  machinesRequiringReview: number;

}


/* ============================================================
   MACHINERY ASSESSMENT INPUT
============================================================ */

export interface MachineryAssessmentInput {

  assessmentId: string;

  machineryDetails: MachineryRecord[];

  evidence: MachineryEvidence[];

  verificationRecords:
    MachineryVerificationRecord[];

  notes: string;

}


/* ============================================================
   MACHINERY ASSESSMENT RESULT
============================================================ */

export interface MachineryAssessmentResult {

  assessmentId: string;

  completionPercent: number;

  readinessScore: number;

  riskLevel: MachineryRiskLevel;

  status: MachineryAssessmentStatus;

  summary: MachinerySummary;

  sectionStatus: MachinerySectionStatus;

  issues: string[];

  warnings: string[];

  recommendations: string[];

}