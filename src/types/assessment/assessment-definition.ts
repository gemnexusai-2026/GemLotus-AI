import type {
    AssessmentCategoryCode,
    AssessmentResultStatus,
    AssessmentStatus,
    ChecklistItemStatus,
    ChecklistItemType,
    EntityTypeCode,
    EvidenceStatus,
    OemSubTypeCode,
    PaymentStatus,
    ReadinessStatus,
  } from "./assessment-enums";
  
  /**
   * ============================================================
   * Generic audit fields
   * ============================================================
   */
  
  export interface AuditTimestamps {
    created_at: string;
    updated_at: string;
  }
  
  /**
   * ============================================================
   * Entity Type
   * ============================================================
   */
  
  export interface EntityTypeDefinition extends AuditTimestamps {
    id: string;
    code: EntityTypeCode;
    name: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
  }
  
  /**
   * ============================================================
   * OEM Sub Type
   * ============================================================
   */
  
  export interface OemSubTypeDefinition extends AuditTimestamps {
    id: string;
    entity_type_id: string;
    code: OemSubTypeCode;
    name: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
  }
  
  /**
   * ============================================================
   * Assessment Category
   * ============================================================
   */
  
  export interface AssessmentCategoryDefinition extends AuditTimestamps {
    id: string;
    code: AssessmentCategoryCode;
    name: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
  }
  
  /**
   * ============================================================
   * Applicability
   *
   * This is intentionally flexible because applicability belongs
   * to policy/configuration and must remain database-driven.
   * ============================================================
   */
  
  export interface ChecklistApplicability {
    entity_type_codes?: EntityTypeCode[];
    oem_sub_type_codes?: OemSubTypeCode[];
  
    /**
     * Optional future policy dimensions.
     */
    assessment_types?: string[];
    countries?: string[];
    states?: string[];
  
    /**
     * Explicit overrides.
     */
    include?: boolean;
    exclude?: boolean;
  
    /**
     * Additional policy conditions.
     */
    [key: string]: unknown;
  }
  
  /**
   * ============================================================
   * Evidence Requirements
   * ============================================================
   */
  
  export interface EvidenceRequirement {
    required: boolean;
  
    accepted_types?: string[];
  
    minimum_count?: number;
  
    maximum_count?: number;
  
    requires_verification?: boolean;
  
    requires_expiry_date?: boolean;
  
    requires_issue_date?: boolean;
  
    requires_reference_number?: boolean;
  
    notes?: string;
  
    [key: string]: unknown;
  }
  
  /**
   * ============================================================
   * Checklist Item
   * ============================================================
   */
  
  export interface ChecklistItemDefinition extends AuditTimestamps {
    id: string;
  
    category_id: string;
  
    code: string;
  
    title: string;
  
    description: string | null;
  
    item_type: ChecklistItemType;
  
    is_mandatory: boolean;
  
    evidence_required: boolean;
  
    applicability: ChecklistApplicability;
  
    evidence_requirements: EvidenceRequirement;
  
    scoring_weight: number;
  
    version: number;
  
    is_active: boolean;
  
    sort_order: number;
  }
  
  /**
   * ============================================================
   * Fee Definition
   * ============================================================
   */
  
  export interface FeeSlabDefinition extends AuditTimestamps {
    id: string;
  
    entity_type_id: string;
  
    oem_sub_type_id: string | null;
  
    assessment_type: string;
  
    turnover_slab_code: string;
  
    min_turnover: number | null;
  
    max_turnover: number | null;
  
    currency_code: string;
  
    base_fee: number;
  
    gst_percent: number;
  
    is_active: boolean;
  
    version: number;
  
    effective_from: string;
  
    effective_until: string | null;
  }
  
  /**
   * ============================================================
   * Assessment Rule
   * ============================================================
   */
  
  export interface AssessmentRuleDefinition extends AuditTimestamps {
    id: string;
  
    code: string;
  
    name: string;
  
    description: string | null;
  
    rule_type: string;
  
    conditions: Record<string, unknown>;
  
    actions: Record<string, unknown>;
  
    priority: number;
  
    version: number;
  
    is_active: boolean;
  
    effective_from: string;
  
    effective_until: string | null;
  }
  
  /**
   * ============================================================
   * Resolved Checklist Item
   *
   * This is the form that the Assessment Core consumes after
   * applicability resolution.
   * ============================================================
   */
  
  export interface ResolvedChecklistItem {
    item_id: string;
  
    category_id: string;
  
    item_code: string;
  
    title: string;
  
    description: string | null;
  
    item_type: ChecklistItemType;
  
    is_mandatory: boolean;
  
    evidence_required: boolean;
  
    evidence_requirements: EvidenceRequirement;
  
    scoring_weight: number;
  
    definition_version: number;
  
    status: ChecklistItemStatus;
  }
  
  /**
   * ============================================================
   * Assessment Definition
   * ============================================================
   */
  
  export interface AssessmentDefinition {
    definition_version: number;
  
    entity_type: EntityTypeDefinition;
  
    oem_sub_type: OemSubTypeDefinition | null;
  
    categories: AssessmentCategoryDefinition[];
  
    checklist_items: ResolvedChecklistItem[];
  
    rules: AssessmentRuleDefinition[];
  
    fee: FeeSlabDefinition | null;
  }
  
  /**
   * ============================================================
   * Assessment Snapshot
   * ============================================================
   */
  
  export interface AssessmentSnapshot {
    id: string;
  
    created_by: string | null;
  
    entity_type_id: string;
  
    oem_sub_type_id: string | null;
  
    assessment_type: string;
  
    turnover_amount: number | null;
  
    turnover_slab_code: string | null;
  
    definition_version: number;
  
    checklist_snapshot: ResolvedChecklistItem[];
  
    rules_snapshot: AssessmentRuleDefinition[];
  
    fee_snapshot: Record<string, unknown>;
  
    base_fee: number | null;
  
    gst_percent: number | null;
  
    gst_amount: number | null;
  
    total_fee: number | null;
  
    payment_status: PaymentStatus;
  
    status: AssessmentStatus;
  
    created_at: string;
  
    updated_at: string;
  }
  
  /**
   * ============================================================
   * Assessment Creation Input
   * ============================================================
   */
  
  export interface CreateAssessmentInput {
    entity_type_code: EntityTypeCode;
  
    oem_sub_type_code?: OemSubTypeCode | null;
  
    assessment_type: string;
  
    turnover_amount?: number | null;
  
    created_by?: string | null;
  }
  
  /**
   * ============================================================
   * Assessment Readiness
   * ============================================================
   */
  
  export interface ReadinessBreakdown {
    documentation: number;
    document_freshness: number;
    data_match_accuracy: number;
    signage_readiness: number;
    video_assessment_preparedness: number;
  }
  
  export interface ReadinessResult {
    score: number;
  
    status: ReadinessStatus;
  
    breakdown: ReadinessBreakdown;
  
    missing_items: string[];
  
    generated_at: string;
  }
  
  /**
   * ============================================================
   * Assessment Result
   * ============================================================
   */
  
  export interface AssessmentScoreBreakdown {
    category_code: AssessmentCategoryCode;
  
    maximum_score: number;
  
    achieved_score: number;
  
    percentage: number;
  }
  
  export interface AssessmentResult {
    assessment_id: string;
  
    score: number;
  
    grade: string | null;
  
    risk_level: string | null;
  
    status: AssessmentResultStatus;
  
    category_breakdown: AssessmentScoreBreakdown[];
  
    missing_requirements: string[];
  
    recommendations: string[];
  
    generated_at: string;
  }
  
  /**
   * ============================================================
   * Engine Result Wrapper
   *
   * Deterministic engines should return structured results
   * rather than throwing for normal business-state conditions.
   * ============================================================
   */
  
  export interface EngineSuccess<T> {
    success: true;
  
    data: T;
  }
  
  export interface EngineFailure {
    success: false;
  
    code: string;
  
    message: string;
  
    details?: Record<string, unknown>;
  }
  
  export type EngineResult<T> = EngineSuccess<T> | EngineFailure;