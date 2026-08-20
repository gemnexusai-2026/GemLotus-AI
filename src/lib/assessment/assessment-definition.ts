import type {
    AssessmentCategoryDefinition,
    AssessmentDefinition,
    AssessmentRuleDefinition,
    ChecklistItemDefinition,
    CreateAssessmentInput,
    EntityTypeDefinition,
    FeeSlabDefinition,
    OemSubTypeDefinition,
    ResolvedChecklistItem,
  } from "@/types/assessment/assessment-definition";
  
  import type {
    EntityTypeCode,
    OemSubTypeCode,
  } from "@/types/assessment/assessment-enums";
  
  import {
    ASSESSMENT_CATEGORIES,
    ASSESSMENT_DEFINITION_VERSION,
  } from "./assessment-constants";
  
  /**
   * ============================================================
   * GemLotus AI — Assessment Definition Domain Engine
   * ============================================================
   *
   * This file contains deterministic domain logic only.
   *
   * It does NOT:
   * - access Supabase
   * - access React
   * - access browser APIs
   * - perform authentication
   * - fabricate checklist items
   *
   * Repository/database access belongs elsewhere.
   * ============================================================
   */
  
  /**
   * ------------------------------------------------------------
   * Internal validation helpers
   * ------------------------------------------------------------
   */
  
  function normalizeCode(value: string): string {
    return value.trim().toLowerCase();
  }
  
  function assertSupportedEntityType(
    code: EntityTypeCode,
  ): void {
    if (!code) {
      throw new Error("ENTITY_TYPE_REQUIRED");
    }
  }
  
  function assertSupportedOemSubtype(
    code: OemSubTypeCode | null | undefined,
  ): void {
    if (code === null || code === undefined) {
      return;
    }
  
    if (!code.trim()) {
      throw new Error("OEM_SUB_TYPE_INVALID");
    }
  }
  
  /**
   * ------------------------------------------------------------
   * Entity type resolution
   * ------------------------------------------------------------
   */
  
  export function resolveEntityType(
    entityTypes: EntityTypeDefinition[],
    code: EntityTypeCode,
  ): EntityTypeDefinition | null {
    const normalized = normalizeCode(code);
  
    return (
      entityTypes.find(
        (entityType) =>
          entityType.code === normalized &&
          entityType.is_active,
      ) ?? null
    );
  }
  
  /**
   * ------------------------------------------------------------
   * OEM subtype resolution
   * ------------------------------------------------------------
   */
  
  export function resolveOemSubType(
    oemSubTypes: OemSubTypeDefinition[],
    entityTypeId: string,
    code: OemSubTypeCode | null | undefined,
  ): OemSubTypeDefinition | null {
    if (!code) {
      return null;
    }
  
    const normalized = normalizeCode(code);
  
    return (
      oemSubTypes.find(
        (subType) =>
          subType.entity_type_id === entityTypeId &&
          subType.code === normalized &&
          subType.is_active,
      ) ?? null
    );
  }
  
  /**
   * ------------------------------------------------------------
   * Category resolution
   *
   * Categories themselves are database-driven.
   * This function only orders and filters resolved database data.
   * ------------------------------------------------------------
   */
  
  export function resolveCategories(
    categories: AssessmentCategoryDefinition[],
  ): AssessmentCategoryDefinition[] {
    return categories
      .filter((category) => category.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  
  /**
   * ------------------------------------------------------------
   * Checklist applicability
   * ------------------------------------------------------------
   */
  
  export function isChecklistItemApplicable(
    item: ChecklistItemDefinition,
    input: CreateAssessmentInput,
  ): boolean {
    if (!item.is_active) {
      return false;
    }
  
    const applicability = item.applicability ?? {};
  
    const entityCodes = applicability.entity_type_codes;
  
    if (
      entityCodes &&
      entityCodes.length > 0 &&
      !entityCodes.includes(input.entity_type_code)
    ) {
      return false;
    }
  
    const subtypeCodes = applicability.oem_sub_type_codes;
  
    if (
      subtypeCodes &&
      subtypeCodes.length > 0
    ) {
      if (!input.oem_sub_type_code) {
        return false;
      }
  
      if (
        !subtypeCodes.includes(
          input.oem_sub_type_code,
        )
      ) {
        return false;
      }
    }
  
    if (applicability.include === false) {
      return false;
    }
  
    if (applicability.exclude === true) {
      return false;
    }
  
    return true;
  }
  
  /**
   * ------------------------------------------------------------
   * Resolve applicable checklist
   * ------------------------------------------------------------
   */
  
  export function resolveChecklist(
    items: ChecklistItemDefinition[],
    input: CreateAssessmentInput,
  ): ResolvedChecklistItem[] {
    return items
      .filter((item) =>
        isChecklistItemApplicable(item, input),
      )
      .sort((a, b) => {
        if (a.category_id !== b.category_id) {
          return a.category_id.localeCompare(
            b.category_id,
          );
        }
  
        return a.sort_order - b.sort_order;
      })
      .map((item) => ({
        item_id: item.id,
        category_id: item.category_id,
        item_code: item.code,
        title: item.title,
        description: item.description,
        item_type: item.item_type,
        is_mandatory: item.is_mandatory,
        evidence_required: item.evidence_required,
        evidence_requirements:
          item.evidence_requirements,
        scoring_weight: item.scoring_weight,
        definition_version: item.version,
        status: "pending",
      }));
  }
  
  /**
   * ------------------------------------------------------------
   * Rule resolution
   * ------------------------------------------------------------
   */
  
  export function resolveRules(
    rules: AssessmentRuleDefinition[],
  ): AssessmentRuleDefinition[] {
    return rules
      .filter((rule) => rule.is_active)
      .sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * ------------------------------------------------------------
   * Fee resolution
   * ------------------------------------------------------------
   *
   * Fee matching itself remains repository/policy driven.
   * This helper selects an already-resolved fee definition.
   * ------------------------------------------------------------
   */
  
  export function resolveFee(
    fees: FeeSlabDefinition[],
    input: CreateAssessmentInput & {
      entity_type_id?: string | null;
      oem_sub_type_id?: string | null;
    },
  ): FeeSlabDefinition | null {
    const candidates = fees.filter((fee) => {
      if (!fee.is_active) {
        return false;
      }
  
      if (
        input.entity_type_id &&
        fee.entity_type_id !== input.entity_type_id
      ) {
        return false;
      }
  
      if (
        input.oem_sub_type_id &&
        fee.oem_sub_type_id !== null &&
        fee.oem_sub_type_id !==
          input.oem_sub_type_id
      ) {
        return false;
      }
  
      return true;
    });
  
    if (candidates.length === 0) {
      return null;
    }
  
    const turnover = input.turnover_amount;
  
    if (
      turnover === null ||
      turnover === undefined
    ) {
      return (
        candidates.find(
          (fee) =>
            fee.min_turnover === null &&
            fee.max_turnover === null,
        ) ?? null
      );
    }
  
    return (
      candidates.find((fee) => {
        const minimumValid =
          fee.min_turnover === null ||
          turnover >= fee.min_turnover;
  
        const maximumValid =
          fee.max_turnover === null ||
          turnover <= fee.max_turnover;
  
        return (
          minimumValid &&
          maximumValid
        );
      }) ?? null
    );
  }
  
  
  
  /**
   * ------------------------------------------------------------
   * Fee calculation
   * ------------------------------------------------------------
   */
  
  export interface CalculatedFee {
    base_fee: number;
    gst_percent: number;
    gst_amount: number;
    total_fee: number;
    currency_code: string;
  }
  
  export function calculateFee(
    fee: FeeSlabDefinition,
  ): CalculatedFee {
    const baseFee = Math.max(
      0,
      Number(fee.base_fee),
    );
  
    const gstPercent = Math.max(
      0,
      Number(fee.gst_percent),
    );
  
    const gstAmount =
      Math.round(
        (baseFee * gstPercent) / 100 * 100,
      ) / 100;
  
    const totalFee =
      Math.round(
        (baseFee + gstAmount) * 100,
      ) / 100;
  
    return {
      base_fee: baseFee,
      gst_percent: gstPercent,
      gst_amount: gstAmount,
      total_fee: totalFee,
      currency_code: fee.currency_code,
    };
  }
  
  /**
   * ------------------------------------------------------------
   * Full definition resolution
   * ------------------------------------------------------------
   */
  
  export interface AssessmentDefinitionSources {
    entityTypes: EntityTypeDefinition[];
  
    oemSubTypes: OemSubTypeDefinition[];
  
    categories: AssessmentCategoryDefinition[];
  
    checklistItems: ChecklistItemDefinition[];
  
    rules: AssessmentRuleDefinition[];
  
    fees: FeeSlabDefinition[];
  }
  
  export function resolveAssessmentDefinition(
    input: CreateAssessmentInput,
    sources: AssessmentDefinitionSources,
  ): AssessmentDefinition {
    assertSupportedEntityType(
      input.entity_type_code,
    );
  
    assertSupportedOemSubtype(
      input.oem_sub_type_code,
    );
  
    const entityType = resolveEntityType(
      sources.entityTypes,
      input.entity_type_code,
    );
  
    if (!entityType) {
      throw new Error(
        `ENTITY_TYPE_NOT_FOUND:${input.entity_type_code}`,
      );
    }
  
    const oemSubType = resolveOemSubType(
      sources.oemSubTypes,
      entityType.id,
      input.oem_sub_type_code,
    );
  
    if (
      input.oem_sub_type_code &&
      !oemSubType
    ) {
      throw new Error(
        `OEM_SUB_TYPE_NOT_FOUND:${input.oem_sub_type_code}`,
      );
    }
  
    const categories = resolveCategories(
      sources.categories,
    );
  
    const checklistItems = resolveChecklist(
      sources.checklistItems,
      input,
    );
  
    const rules = resolveRules(
      sources.rules,
    );
  
    const fee = resolveFee(
        sources.fees,
        {
          ...input,
          entity_type_id: entityType.id,
          oem_sub_type_id:
            oemSubType?.id ?? null,
        },
      );
    return {
      definition_version:
        ASSESSMENT_DEFINITION_VERSION,
  
      entity_type: entityType,
  
      oem_sub_type: oemSubType,
  
      categories,
  
      checklist_items: checklistItems,
  
      rules,
  
      fee,
    };
  }
  
  /**
   * ------------------------------------------------------------
   * Snapshot serializer
   *
   * Snapshot must contain immutable copies of the definition
   * objects used at assessment creation time.
   * ------------------------------------------------------------
   */
  
  export function createSnapshotPayload(
    definition: AssessmentDefinition,
  ) {
    const calculatedFee = definition.fee
      ? calculateFee(definition.fee)
      : null;
  
    return {
      definition_version:
        definition.definition_version,
  
      entity_type_id:
        definition.entity_type.id,
  
      oem_sub_type_id:
        definition.oem_sub_type?.id ?? null,
  
      checklist_snapshot:
        structuredClone(
          definition.checklist_items,
        ),
  
      rules_snapshot:
        structuredClone(
          definition.rules,
        ),
  
      fee_snapshot:
        structuredClone(
          definition.fee ?? {},
        ),
  
      base_fee:
        calculatedFee?.base_fee ?? null,
  
      gst_percent:
        calculatedFee?.gst_percent ?? null,
  
      gst_amount:
        calculatedFee?.gst_amount ?? null,
  
      total_fee:
        calculatedFee?.total_fee ?? null,
    };
  }