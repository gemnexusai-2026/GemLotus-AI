import type {
  CompanyDocumentType,
  CompanyEntityType,
  CompanyLegalStatus,
  CompanyRiskLevel,
  CompanyValidityStatus,
  CompanyVerificationStatus,
} from "./company.types";

export const COMPANY_ENTITY_TYPES: {
  value: CompanyEntityType;
  label: string;
  description: string;
}[] = [
  {
    value: "proprietorship",
    label: "Proprietorship",
    description:
      "Sole proprietor business entity.",
  },
  {
    value: "partnership",
    label: "Partnership",
    description:
      "Registered or unregistered partnership structure.",
  },
  {
    value: "llp",
    label: "LLP",
    description:
      "Limited Liability Partnership.",
  },
  {
    value: "private_limited",
    label: "Private Limited",
    description:
      "Private limited company.",
  },
  {
    value: "public_limited",
    label: "Public Limited",
    description:
      "Public limited company.",
  },
  {
    value: "section_8",
    label: "Section 8",
    description:
      "Section 8 company / not-for-profit entity.",
  },
  {
    value: "trust",
    label: "Trust",
    description:
      "Trust-based legal entity.",
  },
  {
    value: "society",
    label: "Society",
    description:
      "Registered society.",
  },
  {
    value: "other",
    label: "Other",
    description:
      "Other legal entity structure.",
  },
];

export const COMPANY_DOCUMENT_TYPES: {
  value: CompanyDocumentType;
  label: string;
  description: string;
}[] = [
  {
    value: "pan",
    label: "PAN",
    description:
      "Permanent Account Number evidence.",
  },
  {
    value: "gst",
    label: "GST Registration",
    description:
      "GST registration certificate and details.",
  },
  {
    value: "udyam",
    label: "Udyam Registration",
    description:
      "MSME / Udyam registration evidence.",
  },
  {
    value: "incorporation",
    label: "Incorporation",
    description:
      "Company incorporation / registration evidence.",
  },
  {
    value: "partnership_deed",
    label: "Partnership Deed",
    description:
      "Partnership constitution document.",
  },
  {
    value: "llp_agreement",
    label: "LLP Agreement",
    description:
      "LLP agreement and constitution evidence.",
  },
  {
    value: "shop_establishment",
    label: "Shop & Establishment",
    description:
      "Applicable establishment registration.",
  },
  {
    value: "factory_license",
    label: "Factory License",
    description:
      "Applicable factory license evidence.",
  },
  {
    value: "trade_license",
    label: "Trade License",
    description:
      "Applicable local trade license.",
  },
  {
    value: "other",
    label: "Other",
    description:
      "Other legal/compliance document.",
  },
];

export const COMPANY_VERIFICATION_STATUSES: {
  value: CompanyVerificationStatus;
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

export const COMPANY_VALIDITY_STATUSES: {
  value: CompanyValidityStatus;
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

export const COMPANY_RISK_LEVELS: {
  value: CompanyRiskLevel;
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

export const COMPANY_LEGAL_STATUSES: {
  value: CompanyLegalStatus;
  label: string;
}[] = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "not_available",
    label: "Not Available",
  },
];

export const COMPANY_MODULE_TITLE =
  "Company & Legal Compliance Assessment";

export const COMPANY_MODULE_DESCRIPTION =
  "Verify legal identity, statutory registrations, company documents, validity, risk and compliance readiness.";

export const COMPANY_MANDATORY_DOCUMENTS: CompanyDocumentType[] =
  [
    "pan",
    "gst",
    "udyam",
  ];
