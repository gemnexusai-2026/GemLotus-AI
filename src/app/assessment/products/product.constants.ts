/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Constants
   ============================================================ */

import type {
  ProductCategory,
  ProductStatus,
  ProductEvidenceType,
  ProductFindingSeverity,
} from "./product.types";

export const PRODUCT_CATEGORIES: {
  value: ProductCategory;
  label: string;
}[] = [
  { value: "furniture", label: "Furniture" },
  { value: "electrical", label: "Electrical Equipment" },
  { value: "mechanical", label: "Mechanical Equipment" },
  { value: "textile", label: "Textile Products" },
  { value: "plastic", label: "Plastic Products" },
  { value: "medical", label: "Medical Equipment" },
  { value: "it_equipment", label: "IT Equipment" },
  { value: "other", label: "Other" },
];

export const PRODUCT_STATUSES: {
  value: ProductStatus;
  label: string;
}[] = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "under_review", label: "Under Review" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

export const PRODUCT_EVIDENCE_TYPES: {
  value: ProductEvidenceType;
  label: string;
}[] = [
  { value: "product_photo", label: "Product Photograph" },
  { value: "technical_document", label: "Technical Document" },
  { value: "test_report", label: "Test Report" },
  { value: "certificate", label: "Certificate" },
  { value: "catalog", label: "Product Catalog" },
  { value: "drawing", label: "Technical Drawing" },
  { value: "sample_photo", label: "Sample Photograph" },
  { value: "other", label: "Other Evidence" },
];

export const PRODUCT_FINDING_SEVERITIES: {
  value: ProductFindingSeverity;
  label: string;
}[] = [
  { value: "observation", label: "Observation" },
  { value: "minor", label: "Minor" },
  { value: "major", label: "Major" },
  { value: "critical", label: "Critical" },
];

export const PRODUCT_SCORE_WEIGHTS = {
  productDefinition: 15,
  specificationCompliance: 20,
  evidenceReadiness: 15,
  physicalVerification: 20,
  qualityTesting: 15,
  manufacturingRelevance: 15,
} as const;

export const PRODUCT_READINESS_THRESHOLDS = {
  notReady: 0,
  partiallyReady: 50,
  ready: 70,
  highlyReady: 85,
} as const;

export const PRODUCT_MODULE_META = {
  step: "05",
  title: "Product Assessment",
  subtitle: "Product verification and manufacturing capability",
  description:
    "Evidence-first assessment of product definition, technical specifications, physical verification, quality testing and manufacturing relevance.",
} as const;
