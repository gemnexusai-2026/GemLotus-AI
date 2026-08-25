import type {
  FactoryDocumentType,
  FactoryOwnershipType,
  FactoryPremisesStatus,
  FactoryRiskLevel,
  FactoryValidityStatus,
  FactoryVerificationStatus,
} from "./factory.types";

export const FACTORY_OWNERSHIP_TYPES: {
  value: FactoryOwnershipType;
  label: string;
  description: string;
}[] = [
  {
    value: "owned",
    label: "Owned",
    description: "Factory premises owned by the assessed organization.",
  },
  {
    value: "leased",
    label: "Leased",
    description: "Factory premises operated under a lease.",
  },
  {
    value: "rented",
    label: "Rented",
    description: "Factory premises operated under a rental arrangement.",
  },
  {
    value: "shared",
    label: "Shared",
    description: "Factory premises shared with another organization.",
  },
  {
    value: "other",
    label: "Other",
    description: "Other premises arrangement.",
  },
];

export const FACTORY_PREMISES_STATUSES: {
  value: FactoryPremisesStatus;
  label: string;
}[] = [
  {
    value: "operational",
    label: "Operational",
  },
  {
    value: "under_setup",
    label: "Under Setup",
  },
  {
    value: "partially_operational",
    label: "Partially Operational",
  },
  {
    value: "non_operational",
    label: "Non Operational",
  },
  {
    value: "not_available",
    label: "Not Available",
  },
];

export const FACTORY_DOCUMENT_TYPES: {
  value: FactoryDocumentType;
  label: string;
  description: string;
}[] = [
  {
    value: "ownership_proof",
    label: "Ownership Proof",
    description: "Evidence establishing premises ownership.",
  },
  {
    value: "lease_agreement",
    label: "Lease Agreement",
    description: "Lease agreement for factory premises.",
  },
  {
    value: "rent_agreement",
    label: "Rent Agreement",
    description: "Rental agreement for factory premises.",
  },
  {
    value: "factory_license",
    label: "Factory License",
    description: "Applicable factory license.",
  },
  {
    value: "layout_plan",
    label: "Factory Layout",
    description: "Factory layout / floor plan.",
  },
  {
    value: "electricity_bill",
    label: "Electricity Bill",
    description: "Utility evidence for factory premises.",
  },
  {
    value: "property_tax",
    label: "Property Tax",
    description: "Applicable property tax evidence.",
  },
  {
    value: "pollution_consent",
    label: "Pollution Consent",
    description: "Applicable pollution control consent.",
  },
  {
    value: "fire_noc",
    label: "Fire NOC",
    description: "Applicable fire safety clearance.",
  },
  {
    value: "other",
    label: "Other",
    description: "Other factory/infrastructure evidence.",
  },
];

export const FACTORY_VERIFICATION_STATUSES: {
  value: FactoryVerificationStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "verified",
    label: "Verified",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "needs_review",
    label: "Needs Review",
  },
];

export const FACTORY_VALIDITY_STATUSES: {
  value: FactoryValidityStatus;
  label: string;
}[] = [
  {
    value: "valid",
    label: "Valid",
  },
  {
    value: "expiring",
    label: "Expiring",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "not_applicable",
    label: "Not Applicable",
  },
  {
    value: "unknown",
    label: "Unknown",
  },
];

export const FACTORY_RISK_LEVELS: {
  value: FactoryRiskLevel;
  label: string;
}[] = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
  {
    value: "critical",
    label: "Critical",
  },
];

export const FACTORY_MANDATORY_DOCUMENTS: FactoryDocumentType[] = [
  "layout_plan",
  "factory_license",
];

export const FACTORY_MODULE_TITLE =
  "Factory & Infrastructure Assessment";

export const FACTORY_MODULE_DESCRIPTION =
  "Verify factory premises, infrastructure, utilities, layout, statutory evidence and operational readiness.";

export const FACTORY_INFRASTRUCTURE_CHECKS = [
  "rawMaterialStorage",
  "finishedGoodsStorage",
  "qualityInspectionArea",
  "maintenanceArea",
  "loadingUnloadingArea",
  "workerFacilitiesAvailable",
  "layoutAvailable",
  "layoutVerified",
] as const;
