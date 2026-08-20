/**
 * GemLotus AI
 * Assessment Domain — Canonical Enums
 *
 * IMPORTANT:
 * These values are application-level contracts.
 * Database codes must remain compatible with these values.
 */

export const ENTITY_TYPE_CODES = [
    "oem_manufacturer",
    "indian_oem_reseller",
    "foreign_oem_reseller",
    "service_provider",
  ] as const;
  
  export type EntityTypeCode = (typeof ENTITY_TYPE_CODES)[number];
  
  export const OEM_SUB_TYPE_CODES = [
    "in_house_manufacturing",
    "third_party_contract_manufacturing",
    "deemed_oem",
    "brand_owner",
  ] as const;
  
  export type OemSubTypeCode = (typeof OEM_SUB_TYPE_CODES)[number];
  
  export const ASSESSMENT_CATEGORY_CODES = [
    "legal_documentation",
    "product_information",
    "order_history",
    "compliance_assurance",
    "process_documentation",
    "operational_efficiency",
    "quality_assurance",
    "territory_logistics",
    "supplier_management",
    "quality_control_customer_service",
    "safety_standards",
    "warranty_r_and_d",
    "intellectual_property",
  ] as const;
  
  export type AssessmentCategoryCode =
    (typeof ASSESSMENT_CATEGORY_CODES)[number];
  
  export const CHECKLIST_ITEM_TYPES = [
    "document",
    "physical",
    "process",
    "verification",
    "photo",
    "video",
    "financial",
    "certificate",
    "declaration",
    "other",
  ] as const;
  
  export type ChecklistItemType = (typeof CHECKLIST_ITEM_TYPES)[number];
  
  export const ASSESSMENT_STATUSES = [
    "draft",
    "active",
    "in_progress",
    "submitted",
    "under_review",
    "completed",
    "cancelled",
  ] as const;
  
  export type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number];
  
  export const PAYMENT_STATUSES = [
    "unpaid",
    "pending",
    "paid",
    "failed",
    "refunded",
  ] as const;
  
  export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
  
  export const EVIDENCE_STATUSES = [
    "missing",
    "uploaded",
    "processing",
    "verified",
    "rejected",
    "nc",
  ] as const;
  
  export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
  
  export const CHECKLIST_ITEM_STATUSES = [
    "pending",
    "not_applicable",
    "submitted",
    "verified",
    "rejected",
    "nc",
  ] as const;
  
  export type ChecklistItemStatus =
    (typeof CHECKLIST_ITEM_STATUSES)[number];
  
  export const ASSESSMENT_RESULT_STATUSES = [
    "pending",
    "incomplete",
    "eligible",
    "not_eligible",
    "eligible_with_gaps",
  ] as const;
  
  export type AssessmentResultStatus =
    (typeof ASSESSMENT_RESULT_STATUSES)[number];
  
  export const READINESS_STATUSES = [
    "do_not_apply_yet",
    "conditional_fix_gaps",
    "ready",
  ] as const;
  
  export type ReadinessStatus = (typeof READINESS_STATUSES)[number];