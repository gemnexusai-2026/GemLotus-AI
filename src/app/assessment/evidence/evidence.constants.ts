import type {
  EvidenceCategory,
  EvidenceRiskLevel,
  EvidenceType,
  EvidenceVerificationStatus,
  EvidenceValidityStatus,
} from "./evidence.types";

export const EVIDENCE_CATEGORIES: {
  value: EvidenceCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "company_legal",
    label: "Company & Legal",
    description:
      "Legal registrations, licenses and statutory records.",
  },
  {
    value: "factory",
    label: "Factory",
    description:
      "Factory infrastructure and premises evidence.",
  },
  {
    value: "machinery",
    label: "Machinery",
    description:
      "Machinery ownership, capability and verification evidence.",
  },
  {
    value: "product",
    label: "Product",
    description:
      "Product photographs, catalogs and technical evidence.",
  },
  {
    value: "quality",
    label: "Quality",
    description:
      "Quality-control and inspection evidence.",
  },
  {
    value: "testing",
    label: "Testing",
    description:
      "Testing reports, certificates and laboratory evidence.",
  },
  {
    value: "financial",
    label: "Financial",
    description:
      "Financial and commercial supporting evidence.",
  },
  {
    value: "safety",
    label: "Safety",
    description:
      "Safety, compliance and workplace evidence.",
  },
  {
    value: "other",
    label: "Other",
    description:
      "Other assessment-supporting evidence.",
  },
];

export const EVIDENCE_TYPES: {
  value: EvidenceType;
  label: string;
}[] = [
  {
    value: "certificate",
    label: "Certificate",
  },
  {
    value: "license",
    label: "License",
  },
  {
    value: "registration",
    label: "Registration",
  },
  {
    value: "invoice",
    label: "Invoice",
  },
  {
    value: "test_report",
    label: "Test Report",
  },
  {
    value: "calibration_certificate",
    label: "Calibration Certificate",
  },
  {
    value: "photograph",
    label: "Photograph",
  },
  {
    value: "video",
    label: "Video",
  },
  {
    value: "drawing",
    label: "Drawing",
  },
  {
    value: "catalog",
    label: "Catalog",
  },
  {
    value: "purchase_document",
    label: "Purchase Document",
  },
  {
    value: "ownership_document",
    label: "Ownership Document",
  },
  {
    value: "process_document",
    label: "Process Document",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const EVIDENCE_VERIFICATION_STATUSES: {
  value: EvidenceVerificationStatus;
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

export const EVIDENCE_VALIDITY_STATUSES: {
  value: EvidenceValidityStatus;
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

export const EVIDENCE_RISK_LEVELS: {
  value: EvidenceRiskLevel;
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

export const EVIDENCE_MODULES = [
  "Company",
  "Factory",
  "Machinery",
  "Products",
  "Quality",
  "Testing",
  "Safety",
  "Other",
] as const;
