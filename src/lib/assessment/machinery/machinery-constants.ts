/* ============================================================
   GEMNEXUS AI
   OEM ASSESSMENT OS
   MACHINERY ASSESSMENT — CONSTANTS
   ============================================================

   Purpose:
   - Canonical machinery assessment sections
   - Machine categories
   - Ownership options
   - Operational status
   - Verification options
   - Evidence types
   - Assessment metadata

   IMPORTANT:
   This file contains constants/configuration only.
   No React.
   No database.
   No server actions.
   No scoring calculations.
============================================================ */

import type {
    MachineryCategory,
    MachineryCondition,
    MachineryInstallationStatus,
    MachineryOperationalStatus,
    MachineryOwnershipType,
    MachineryPowerType,
    MachineryVerificationStatus,
    MachineryOwnershipVerificationStatus,
    MachineryCapacityVerificationStatus,
    MachineryEvidenceType,
  } from "@/types/assessment/machinery";
  
  
  /* ============================================================
     SECTION CODE
  ============================================================ */
  
  export type MachinerySectionCode =
    | "overview"
    | "register"
    | "ownership"
    | "physical"
    | "capacity"
    | "operation"
    | "maintenance"
    | "calibration"
    | "verification"
    | "evidence";
  
  
  /* ============================================================
     SECTION DEFINITION
  ============================================================ */
  
  export interface MachinerySectionDefinition {
    number: string;
    code: MachinerySectionCode;
    title: string;
    description: string;
  }
  
  
  /* ============================================================
     MACHINERY SECTIONS
  ============================================================ */
  
  export const MACHINERY_SECTIONS:
    MachinerySectionDefinition[] = [
    {
      number: "01",
      code: "overview",
      title: "Machinery Overview",
      description:
        "Overall machinery infrastructure, machine count and manufacturing capability.",
    },
  
    {
      number: "02",
      code: "register",
      title: "Machinery Register",
      description:
        "Detailed machine-wise register including manufacturer, model, serial number and asset information.",
    },
  
    {
      number: "03",
      code: "ownership",
      title: "Ownership & Asset Verification",
      description:
        "Verify ownership, lease, rental and supporting asset documentation.",
    },
  
    {
      number: "04",
      code: "physical",
      title: "Physical Verification",
      description:
        "Verify physical presence, identification, installation and location of machinery.",
    },
  
    {
      number: "05",
      code: "capacity",
      title: "Capacity Verification",
      description:
        "Record rated and actual machine capacity and verify production relevance.",
    },
  
    {
      number: "06",
      code: "operation",
      title: "Operational Condition",
      description:
        "Assess operational status, machine condition and production usability.",
    },
  
    {
      number: "07",
      code: "maintenance",
      title: "Maintenance",
      description:
        "Review preventive maintenance, maintenance records and service history.",
    },
  
    {
      number: "08",
      code: "calibration",
      title: "Calibration",
      description:
        "Capture calibration information for applicable measuring and testing equipment.",
    },
  
    {
      number: "09",
      code: "verification",
      title: "Assessment Verification",
      description:
        "Record verifier observations, discrepancies, verification status and corrective actions.",
    },
  
    {
      number: "10",
      code: "evidence",
      title: "Evidence & Documents",
      description:
        "Upload and verify documentary, photographic and physical evidence supporting machinery claims.",
    },
  ];
  
  
  /* ============================================================
     MACHINE CATEGORIES
  ============================================================ */
  
  export const MACHINERY_CATEGORIES:
    {
      value: MachineryCategory;
      label: string;
    }[] = [
    {
      value: "production",
      label: "Production Machinery",
    },
  
    {
      value: "fabrication",
      label: "Fabrication Machinery",
    },
  
    {
      value: "cutting",
      label: "Cutting Machinery",
    },
  
    {
      value: "forming",
      label: "Forming Machinery",
    },
  
    {
      value: "welding",
      label: "Welding Machinery",
    },
  
    {
      value: "machining",
      label: "Machining Machinery",
    },
  
    {
      value: "assembly",
      label: "Assembly Machinery",
    },
  
    {
      value: "finishing",
      label: "Finishing Machinery",
    },
  
    {
      value: "surface_treatment",
      label: "Surface Treatment",
    },
  
    {
      value: "testing",
      label: "Testing Equipment",
    },
  
    {
      value: "quality_control",
      label: "Quality Control Equipment",
    },
  
    {
      value: "material_handling",
      label: "Material Handling Equipment",
    },
  
    {
      value: "utility",
      label: "Utility Equipment",
    },
  
    {
      value: "packaging",
      label: "Packaging Machinery",
    },
  
    {
      value: "other",
      label: "Other",
    },
  ];
  
  
  /* ============================================================
     OWNERSHIP OPTIONS
  ============================================================ */
  
  export const MACHINERY_OWNERSHIP_OPTIONS:
    {
      value: MachineryOwnershipType;
      label: string;
    }[] = [
    {
      value: "owned",
      label: "Owned",
    },
  
    {
      value: "leased",
      label: "Leased",
    },
  
    {
      value: "rented",
      label: "Rented",
    },
  
    {
      value: "hired",
      label: "Hired",
    },
  
    {
      value: "shared",
      label: "Shared",
    },
  
    {
      value: "other",
      label: "Other",
    },
  ];
  
  
  /* ============================================================
     OPERATIONAL STATUS OPTIONS
  ============================================================ */
  
  export const MACHINERY_OPERATIONAL_STATUS_OPTIONS:
    {
      value: MachineryOperationalStatus;
      label: string;
    }[] = [
    {
      value: "operational",
      label: "Operational",
    },
  
    {
      value: "partially_operational",
      label: "Partially Operational",
    },
  
    {
      value: "under_maintenance",
      label: "Under Maintenance",
    },
  
    {
      value: "not_operational",
      label: "Not Operational",
    },
  
    {
      value: "idle",
      label: "Idle",
    },
  
    {
      value: "decommissioned",
      label: "Decommissioned",
    },
  
    {
      value: "unknown",
      label: "Unknown",
    },
  ];
  
  
  /* ============================================================
     CONDITION OPTIONS
  ============================================================ */
  
  export const MACHINERY_CONDITION_OPTIONS:
    {
      value: MachineryCondition;
      label: string;
    }[] = [
    {
      value: "excellent",
      label: "Excellent",
    },
  
    {
      value: "good",
      label: "Good",
    },
  
    {
      value: "fair",
      label: "Fair",
    },
  
    {
      value: "poor",
      label: "Poor",
    },
  
    {
      value: "critical",
      label: "Critical",
    },
  
    {
      value: "unknown",
      label: "Unknown",
    },
  ];
  
  
  /* ============================================================
     INSTALLATION STATUS
  ============================================================ */
  
  export const MACHINERY_INSTALLATION_STATUS_OPTIONS:
    {
      value: MachineryInstallationStatus;
      label: string;
    }[] = [
    {
      value: "installed",
      label: "Installed",
    },
  
    {
      value: "partially_installed",
      label: "Partially Installed",
    },
  
    {
      value: "not_installed",
      label: "Not Installed",
    },
  
    {
      value: "under_installation",
      label: "Under Installation",
    },
  
    {
      value: "unknown",
      label: "Unknown",
    },
  ];
  
  
  /* ============================================================
     POWER TYPE
  ============================================================ */
  
  export const MACHINERY_POWER_TYPE_OPTIONS:
    {
      value: MachineryPowerType;
      label: string;
    }[] = [
    {
      value: "electrical",
      label: "Electrical",
    },
  
    {
      value: "diesel",
      label: "Diesel",
    },
  
    {
      value: "petrol",
      label: "Petrol",
    },
  
    {
      value: "hydraulic",
      label: "Hydraulic",
    },
  
    {
      value: "pneumatic",
      label: "Pneumatic",
    },
  
    {
      value: "manual",
      label: "Manual",
    },
  
    {
      value: "mixed",
      label: "Mixed",
    },
  
    {
      value: "other",
      label: "Other",
    },
  ];
  
  
  /* ============================================================
     VERIFICATION STATUS
  ============================================================ */
  
  export const MACHINERY_VERIFICATION_STATUS_OPTIONS:
    {
      value: MachineryVerificationStatus;
      label: string;
    }[] = [
    {
      value: "not_verified",
      label: "Not Verified",
    },
  
    {
      value: "verified",
      label: "Verified",
    },
  
    {
      value: "partially_verified",
      label: "Partially Verified",
    },
  
    {
      value: "unable_to_verify",
      label: "Unable to Verify",
    },
  
    {
      value: "disputed",
      label: "Disputed",
    },
  
    {
      value: "requires_review",
      label: "Requires Review",
    },
  ];
  
  
  /* ============================================================
     OWNERSHIP VERIFICATION STATUS
  ============================================================ */
  
  export const MACHINERY_OWNERSHIP_VERIFICATION_OPTIONS:
    {
      value: MachineryOwnershipVerificationStatus;
      label: string;
    }[] = [
    {
      value: "not_verified",
      label: "Not Verified",
    },
  
    {
      value: "verified",
      label: "Verified",
    },
  
    {
      value: "partially_verified",
      label: "Partially Verified",
    },
  
    {
      value: "not_available",
      label: "Evidence Not Available",
    },
  
    {
      value: "disputed",
      label: "Disputed",
    },
  
    {
      value: "requires_review",
      label: "Requires Review",
    },
  ];
  
  
  /* ============================================================
     CAPACITY VERIFICATION STATUS
  ============================================================ */
  
  export const MACHINERY_CAPACITY_VERIFICATION_OPTIONS:
    {
      value: MachineryCapacityVerificationStatus;
      label: string;
    }[] = [
    {
      value: "not_verified",
      label: "Not Verified",
    },
  
    {
      value: "verified",
      label: "Verified",
    },
  
    {
      value: "partially_verified",
      label: "Partially Verified",
    },
  
    {
      value: "not_available",
      label: "Evidence Not Available",
    },
  
    {
      value: "not_applicable",
      label: "Not Applicable",
    },
  
    {
      value: "requires_review",
      label: "Requires Review",
    },
  ];
  
  
  /* ============================================================
     EVIDENCE TYPES
  ============================================================ */
  
  export const MACHINERY_EVIDENCE_TYPES:
    {
      value: MachineryEvidenceType;
      label: string;
    }[] = [
    {
      value: "purchase_invoice",
      label: "Purchase Invoice",
    },
  
    {
      value: "lease_agreement",
      label: "Lease Agreement",
    },
  
    {
      value: "rental_agreement",
      label: "Rental Agreement",
    },
  
    {
      value: "asset_register",
      label: "Asset Register",
    },
  
    {
      value: "machinery_register",
      label: "Machinery Register",
    },
  
    {
      value: "installation_record",
      label: "Installation Record",
    },
  
    {
      value: "commissioning_report",
      label: "Commissioning Report",
    },
  
    {
      value: "maintenance_record",
      label: "Maintenance Record",
    },
  
    {
      value: "calibration_certificate",
      label: "Calibration Certificate",
    },
  
    {
      value: "insurance_document",
      label: "Insurance Document",
    },
  
    {
      value: "photograph",
      label: "Machinery Photograph",
    },
  
    {
      value: "video",
      label: "Machinery Video",
    },
  
    {
      value: "serial_number_photo",
      label: "Serial Number Photograph",
    },
  
    {
      value: "nameplate_photo",
      label: "Machine Nameplate Photograph",
    },
  
    {
      value: "factory_layout",
      label: "Factory Layout",
    },
  
    {
      value: "production_record",
      label: "Production Record",
    },
  
    {
      value: "other",
      label: "Other Evidence",
    },
  ];
  
  
  /* ============================================================
     DEFAULT MACHINERY RECORD
  ============================================================ */
  
  export const DEFAULT_MACHINERY_RECORD = {
    id: "",
    machineCode: "",
    machineName: "",
    category: "production" as MachineryCategory,
    subCategory: "",
    description: "",
  
    manufacturer: "",
    brand: "",
    model: "",
    serialNumber: "",
    assetNumber: "",
  
    quantity: 1,
  
    ownershipType:
      "owned" as MachineryOwnershipType,
  
    ownershipDetails: "",
    ownerName: "",
  
    ownershipVerificationStatus:
      "not_verified" as MachineryOwnershipVerificationStatus,
  
    physicallyAvailable: false,
    physicalLocation: "",
  
    installationStatus:
      "unknown" as MachineryInstallationStatus,
  
    operationalStatus:
      "unknown" as MachineryOperationalStatus,
  
    condition:
      "unknown" as MachineryCondition,
  
    verificationStatus:
      "not_verified" as MachineryVerificationStatus,
  
    powerType:
      "electrical" as MachineryPowerType,
  
    powerRating: "",
    powerRatingUnit: "",
  
    ratedCapacity: "",
    ratedCapacityUnit: "",
  
    actualCapacity: "",
    actualCapacityUnit: "",
  
    capacityVerificationStatus:
      "not_verified" as MachineryCapacityVerificationStatus,
  
    productProcess: "",
    processStage: "",
    productionUse: "",
    productionRelevant: false,
  
    yearOfManufacture: "",
    yearOfPurchase: "",
    installationDate: "",
  
    maintenanceAvailable: false,
    preventiveMaintenanceAvailable: false,
    lastMaintenanceDate: "",
    maintenanceFrequency: "",
    maintenanceRemarks: "",
  
    calibrationApplicable: false,
    calibrationAvailable: false,
    calibrationCertificateNumber: "",
    calibrationDate: "",
    calibrationExpiryDate: "",
  
    verifiedBy: "",
    verificationDate: "",
    verificationRemarks: "",
  
    evidenceIds: [],
  
    remarks: "",
  };
  
  
  /* ============================================================
     DEFAULT MACHINERY SUMMARY
  ============================================================ */
  
  export const DEFAULT_MACHINERY_SUMMARY = {
    totalMachines: 0,
    totalQuantity: 0,
  
    ownedMachines: 0,
    leasedMachines: 0,
    rentedMachines: 0,
    hiredMachines: 0,
  
    operationalMachines: 0,
    nonOperationalMachines: 0,
  
    verifiedMachines: 0,
    unverifiedMachines: 0,
  
    evidenceBackedMachines: 0,
    machinesRequiringReview: 0,
  };
  
  
  /* ============================================================
     DEFAULT SECTION STATUS
  ============================================================ */
  
  export const DEFAULT_MACHINERY_SECTION_STATUS = {
    completion: 0,
    ready: false,
    verifiedCount: 0,
    totalCount: 0,
    evidenceCount: 0,
    missingEvidenceCount: 0,
    issues: [] as string[],
    warnings: [] as string[],
  };
  
  
  /* ============================================================
     MACHINERY REQUIRED VERIFICATION CHECKLIST
  ============================================================ */
  
  export const MACHINERY_VERIFICATION_CHECKLIST = [
    {
      code: "physical_presence",
      label: "Physical presence verified",
    },
  
    {
      code: "machine_identity",
      label: "Machine identity verified",
    },
  
    {
      code: "serial_number",
      label: "Serial number verified",
    },
  
    {
      code: "ownership",
      label: "Ownership verified",
    },
  
    {
      code: "installation",
      label: "Installation verified",
    },
  
    {
      code: "operational_status",
      label: "Operational status verified",
    },
  
    {
      code: "capacity",
      label: "Capacity verified",
    },
  
    {
      code: "production_relevance",
      label: "Production relevance verified",
    },
  
    {
      code: "evidence",
      label: "Supporting evidence verified",
    },
  ] as const;
  
  
  /* ============================================================
     MACHINERY DOCUMENT CHECKLIST
  ============================================================ */
  
  export const MACHINERY_DOCUMENT_CHECKLIST = [
    {
      code: "machinery_register",
      label: "Machinery Register",
      mandatory: true,
    },
  
    {
      code: "purchase_invoice",
      label: "Purchase / Ownership Evidence",
      mandatory: false,
    },
  
    {
      code: "lease_agreement",
      label: "Lease / Rental Agreement",
      mandatory: false,
    },
  
    {
      code: "asset_register",
      label: "Asset Register",
      mandatory: false,
    },
  
    {
      code: "installation_record",
      label: "Installation Record",
      mandatory: false,
    },
  
    {
      code: "maintenance_record",
      label: "Maintenance Record",
      mandatory: false,
    },
  
    {
      code: "calibration_certificate",
      label: "Calibration Certificate",
      mandatory: false,
    },
  
    {
      code: "nameplate_photo",
      label: "Machine Nameplate Photograph",
      mandatory: true,
    },
  
    {
      code: "serial_number_photo",
      label: "Serial Number Photograph",
      mandatory: true,
    },
  
    {
      code: "photograph",
      label: "Machine Photograph",
      mandatory: true,
    },
  
    {
      code: "production_record",
      label: "Production / Utilization Evidence",
      mandatory: false,
    },
  ] as const;
  
  
  /* ============================================================
     MACHINERY ASSESSMENT LABELS
  ============================================================ */
  
  export const MACHINERY_LABELS = {
    title: "Machinery Assessment",
  
    subtitle:
      "Physical machinery infrastructure and verification assessment",
  
    machineRegister:
      "Machinery Register",
  
    ownership:
      "Ownership & Asset Verification",
  
    physical:
      "Physical Verification",
  
    capacity:
      "Capacity Verification",
  
    operation:
      "Operational Condition",
  
    maintenance:
      "Maintenance",
  
    calibration:
      "Calibration",
  
    verification:
      "Assessment Verification",
  
    evidence:
      "Evidence & Documents",
  } as const;
  
  
  /* ============================================================
     MACHINERY VALIDATION LIMITS
  ============================================================ */
  
  export const MACHINERY_VALIDATION_LIMITS = {
    minimumMachineNameLength: 2,
  
    maximumMachineNameLength: 200,
  
    maximumDescriptionLength: 2000,
  
    maximumRemarksLength: 2000,
  
    maximumQuantity: 100000,
  
    minimumQuantity: 1,
  
    minimumUtilizationPercent: 0,
  
    maximumUtilizationPercent: 100,
  
    minimumYear: 1900,
  
    maximumFutureYearOffset: 1,
  } as const;
  
  
  /* ============================================================
     MACHINERY ASSESSMENT WEIGHT MAP
  ============================================================ */
  
  /*
   * These are assessment dimensions, NOT final scoring logic.
   *
   * Final scoring must be implemented in the machinery engine
   * after the canonical assessment rules are locked.
   */
  
  export const MACHINERY_ASSESSMENT_DIMENSIONS = {
    physicalPresence: 15,
  
    machineIdentity: 10,
  
    ownershipVerification: 10,
  
    installation: 10,
  
    operationalCondition: 10,
  
    capacityVerification: 15,
  
    productionRelevance: 10,
  
    maintenance: 5,
  
    calibration: 5,
  
    evidence: 10,
  } as const;
  
  
  /* ============================================================
     TOTAL DIMENSION WEIGHT
  ============================================================ */
  
  export const MACHINERY_TOTAL_WEIGHT =
    Object.values(
      MACHINERY_ASSESSMENT_DIMENSIONS,
    ).reduce(
      (total, weight) => total + weight,
      0,
    );
  
  
  /* ============================================================
     SAFETY NOTE
  ============================================================ */
  
  export const MACHINERY_ASSESSMENT_NOTE =
    "Machinery claims should be supported by appropriate documentary and physical verification evidence. Assessment status must not be treated as proof of compliance unless independently verified.";