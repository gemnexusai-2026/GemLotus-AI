import type {
    AssessmentCategoryCode,
    EntityTypeCode,
    OemSubTypeCode,
  } from "@/types/assessment/assessment-enums";
  
  /**
   * ============================================================
   * GemLotus AI — Assessment Constants
   * ============================================================
   *
   * IMPORTANT:
   * These are canonical identifiers only.
   *
   * Business definitions, checklist content, fee slabs and
   * assessment rules remain database-driven.
   * ============================================================
   */
  
  export const ASSESSMENT_DEFINITION_VERSION = 1;
  
  export const DEFAULT_ASSESSMENT_TYPE = "oem_assessment";
  
  export const DEFAULT_GST_PERCENT = 18;
  
  export const DEFAULT_CURRENCY = "INR";
  
  /**
   * ============================================================
   * Canonical Entity Type Order
   * ============================================================
   */
  
  export const ENTITY_TYPE_ORDER: readonly EntityTypeCode[] = [
    "oem_manufacturer",
    "indian_oem_reseller",
    "foreign_oem_reseller",
    "service_provider",
  ];
  
  /**
   * ============================================================
   * Canonical OEM Subtype Order
   * ============================================================
   */
  
  export const OEM_SUB_TYPE_ORDER: readonly OemSubTypeCode[] = [
    "in_house_manufacturing",
    "third_party_contract_manufacturing",
    "deemed_oem",
    "brand_owner",
  ];
  
  /**
   * ============================================================
   * Canonical 13 Assessment Categories
   * ============================================================
   */
  
  export interface AssessmentCategoryMetadata {
    code: AssessmentCategoryCode;
  
    name: string;
  
    description: string;
  
    sort_order: number;
  }
  
  export const ASSESSMENT_CATEGORIES: readonly AssessmentCategoryMetadata[] = [
    {
      code: "legal_documentation",
      name: "Legal Documentation",
      description:
        "Legal identity, registration and statutory documentation.",
      sort_order: 1,
    },
    {
      code: "product_information",
      name: "Product Information",
      description:
        "Product identity, specifications, catalogues and related information.",
      sort_order: 2,
    },
    {
      code: "order_history",
      name: "Order History",
      description:
        "Historical orders, supply records and relevant transaction evidence.",
      sort_order: 3,
    },
    {
      code: "compliance_assurance",
      name: "Compliance & Assurance",
      description:
        "Regulatory, statutory, certification and assurance evidence.",
      sort_order: 4,
    },
    {
      code: "process_documentation",
      name: "Process Documentation",
      description:
        "Manufacturing, operational and documented process controls.",
      sort_order: 5,
    },
    {
      code: "operational_efficiency",
      name: "Operational Efficiency",
      description:
        "Operational capability, capacity and efficiency evidence.",
      sort_order: 6,
    },
    {
      code: "quality_assurance",
      name: "Quality Assurance",
      description:
        "Quality management systems and assurance practices.",
      sort_order: 7,
    },
    {
      code: "territory_logistics",
      name: "Territory & Logistics",
      description:
        "Geographic coverage, delivery capability and logistics readiness.",
      sort_order: 8,
    },
    {
      code: "supplier_management",
      name: "Supplier Management",
      description:
        "Supplier qualification, sourcing and supplier-control practices.",
      sort_order: 9,
    },
    {
      code: "quality_control_customer_service",
      name: "Quality Control & Customer Service",
      description:
        "Quality control systems, complaint handling and customer service capability.",
      sort_order: 10,
    },
    {
      code: "safety_standards",
      name: "Safety Standards",
      description:
        "Workplace, product and operational safety controls.",
      sort_order: 11,
    },
    {
      code: "warranty_r_and_d",
      name: "Warranty & R&D",
      description:
        "Warranty capability, product support and research/development capability.",
      sort_order: 12,
    },
    {
      code: "intellectual_property",
      name: "Intellectual Property",
      description:
        "Trademarks, patents, designs, copyrights and related IP evidence.",
      sort_order: 13,
    },
  ];
  
  /**
   * ============================================================
   * Readiness Framework
   *
   * Locked initial framework from Master Source of Truth.
   * ============================================================
   */
  
  export const READINESS_WEIGHTS = {
    documentation: 40,
    document_freshness: 20,
    data_match_accuracy: 15,
    signage_readiness: 10,
    video_assessment_preparedness: 15,
  } as const;
  
  export const READINESS_THRESHOLDS = {
    do_not_apply_yet: 70,
    conditional_fix_gaps: 85,
  } as const;
  
  /**
   * ============================================================
   * Utility
   * ============================================================
   */
  
  export function isValidAssessmentCategoryCode(
    value: string,
  ): value is AssessmentCategoryCode {
    return ASSESSMENT_CATEGORIES.some(
      (category) => category.code === value,
    );
  }