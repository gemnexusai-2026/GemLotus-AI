import { createAssessmentRepository } from "@/repositories/assessmentRepository";

import {
  resolveAssessmentDefinition,
  type AssessmentDefinitionSources,
} from "@/lib/assessment/assessment-definition";

import {
  DEFAULT_ASSESSMENT_TYPE,
} from "@/lib/assessment/assessment-constants";

import type {
  AssessmentCategoryDefinition,
  AssessmentDefinition,
  AssessmentRuleDefinition,
  ChecklistApplicability,
  ChecklistItemDefinition,
  CreateAssessmentInput,
  EntityTypeDefinition,
  EvidenceRequirement,
  FeeSlabDefinition,
  OemSubTypeDefinition,
} from "@/types/assessment/assessment-definition";

import type {
  EntityTypeCode,
  OemSubTypeCode,
} from "@/types/assessment/assessment-enums";

/**
 * ============================================================
 * Assessment Definition Service
 * ============================================================
 *
 * Responsibility:
 * - Load canonical assessment-definition data from repository
 * - Validate / normalize database rows at the domain boundary
 * - Pass only domain-safe objects to the deterministic engine
 *
 * This service does NOT:
 * - hard-code checklist definitions
 * - calculate assessment scores
 * - access React/browser APIs
 * - bypass the repository
 * ============================================================
 */

export interface ResolveAssessmentDefinitionInput {
  entityTypeCode: EntityTypeCode;

  oemSubTypeCode?: OemSubTypeCode | null;

  assessmentType?: string;

  turnoverAmount?: number | null;
}

export interface AssessmentDefinitionService {
  resolveDefinition(
    input: ResolveAssessmentDefinitionInput,
  ): Promise<AssessmentDefinition>;
}

/**
 * ------------------------------------------------------------
 * Validation
 * ------------------------------------------------------------
 */

function validateInput(
  input: ResolveAssessmentDefinitionInput,
): void {
  if (!input.entityTypeCode) {
    throw new Error("ENTITY_TYPE_REQUIRED");
  }

  if (
    input.turnoverAmount !== null &&
    input.turnoverAmount !== undefined &&
    input.turnoverAmount < 0
  ) {
    throw new Error("TURNOVER_AMOUNT_INVALID");
  }

  if (
    input.oemSubTypeCode !== null &&
    input.oemSubTypeCode !== undefined &&
    input.oemSubTypeCode.trim() === ""
  ) {
    throw new Error("OEM_SUB_TYPE_INVALID");
  }
}

function normalizeChecklistApplicability(
    value: unknown,
  ): ChecklistApplicability {
    if (
      value === null ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return {};
    }
  
    const source =
      value as Record<string, unknown>;
  
    const result: ChecklistApplicability = {};
  
    if (Array.isArray(source.entity_type_codes)) {
      result.entity_type_codes =
        source.entity_type_codes.filter(
          (code): code is EntityTypeCode =>
            typeof code === "string",
        );
    }
  
    if (Array.isArray(source.oem_sub_type_codes)) {
      result.oem_sub_type_codes =
        source.oem_sub_type_codes.filter(
          (code): code is OemSubTypeCode =>
            typeof code === "string",
        );
    }
  
    if (typeof source.include === "boolean") {
      result.include = source.include;
    }
  
    if (typeof source.exclude === "boolean") {
      result.exclude = source.exclude;
    }
  
    return result;
  }

/**
 * ------------------------------------------------------------
 * Entity type normalization
 * ------------------------------------------------------------
 */

function normalizeEntityType(
  row: Awaited<
    ReturnType<
      ReturnType<typeof createAssessmentRepository>["getEntityTypeByCode"]
    >
  >,
): EntityTypeDefinition | null {
  if (!row) {
    return null;
  }

  return {
    ...row,
    code: row.code as EntityTypeCode,
  };
}

/**
 * ------------------------------------------------------------
 * OEM subtype normalization
 * ------------------------------------------------------------
 */

function normalizeOemSubTypes(
  rows: Awaited<
    ReturnType<
      ReturnType<typeof createAssessmentRepository>["getOemSubTypes"]
    >
  >,
): OemSubTypeDefinition[] {
  return rows.map((row) => ({
    ...row,
    code: row.code as OemSubTypeCode,
  }));
}

/**
 * ------------------------------------------------------------
 * Assessment category normalization
 * ------------------------------------------------------------
 *
 * Category codes are canonical database definition values.
 * The domain type owns the stricter union.
 * ------------------------------------------------------------
 */

function normalizeCategories(
  rows: Awaited<
    ReturnType<
      ReturnType<typeof createAssessmentRepository>["getChecklistCategories"]
    >
  >,
): AssessmentCategoryDefinition[] {
  return rows.map((row) => ({
    ...row,
    code:
      row.code as AssessmentCategoryDefinition["code"],
  }));
}

/**
 * ------------------------------------------------------------
 * Checklist item normalization
 * ------------------------------------------------------------
 */

const CHECKLIST_ITEM_TYPES = [
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

type ChecklistItemType =
  (typeof CHECKLIST_ITEM_TYPES)[number];

function normalizeChecklistItemType(
  value: string,
): ChecklistItemType {
  if (
    CHECKLIST_ITEM_TYPES.includes(
      value as ChecklistItemType,
    )
  ) {
    return value as ChecklistItemType;
  }

  throw new Error(
    `INVALID_CHECKLIST_ITEM_TYPE:${value}`,
  );
}

function normalizeEvidenceRequirements(
    value: unknown,
  ): EvidenceRequirement {
    if (
      value === null ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return {
        required: false,
      };
    }
  
    const source =
      value as Record<string, unknown>;
  
    return {
      required:
        typeof source.required === "boolean"
          ? source.required
          : false,
  
      documents:
        Array.isArray(source.documents)
          ? source.documents.filter(
              (item): item is string =>
                typeof item === "string",
            )
          : [],
  
      photos:
        Array.isArray(source.photos)
          ? source.photos.filter(
              (item): item is string =>
                typeof item === "string",
            )
          : [],
  
      videos:
        Array.isArray(source.videos)
          ? source.videos.filter(
              (item): item is string =>
                typeof item === "string",
            )
          : [],
    };
  }

function normalizeChecklistItems(
    rows: Awaited<
      ReturnType<
        ReturnType<
          typeof createAssessmentRepository
        >["getChecklistItems"]
      >
    >,
  ): ChecklistItemDefinition[] {
    return rows.map((row) => ({
  ...row,

  item_type:
    normalizeChecklistItemType(
      row.item_type,
    ),

  applicability:
    normalizeChecklistApplicability(
      row.applicability,
    ),

  evidence_requirements:
    normalizeEvidenceRequirements(
      row.evidence_requirements,
    ),
}));
  }

/**
 * ------------------------------------------------------------
 * JSON normalization
 * ------------------------------------------------------------
 *
 * Supabase Json can legally be:
 *
 * null
 * string
 * number
 * boolean
 * array
 * object
 *
 * Domain rules expect an object.
 * Normalize non-object values to an empty object.
 * ------------------------------------------------------------
 */

function normalizeJsonObject(
  value: unknown,
): Record<string, unknown> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>;
  }

  return {};
}

/**
 * ------------------------------------------------------------
 * Assessment rule normalization
 * ------------------------------------------------------------
 */

function normalizeRules(
    rows: Awaited<
      ReturnType<
        ReturnType<
          typeof createAssessmentRepository
        >["getAssessmentRules"]
      >
    >,
  ): AssessmentRuleDefinition[] {
    return rows.map((row) => ({
      ...row,
  
      conditions:
        normalizeJsonObject(
          row.conditions,
        ),
  
      actions:
        normalizeJsonObject(
          row.actions,
        ),
    }));
  }

/**
 * ------------------------------------------------------------
 * Fee normalization
 * ------------------------------------------------------------
 */

function normalizeFees(
  rows: Awaited<
    ReturnType<
      ReturnType<typeof createAssessmentRepository>["getFeeSlabs"]
    >
  >,
): FeeSlabDefinition[] {
  return rows;
}

/**
 * ============================================================
 * Service Factory
 * ============================================================
 */

export function createAssessmentDefinitionService(): AssessmentDefinitionService {
  const repository =
    createAssessmentRepository();

  return {
    async resolveDefinition(input) {
      validateInput(input);

      /*
       * --------------------------------------------------------
       * STEP 1
       * Resolve the entity type first.
       * --------------------------------------------------------
       */

      const entityTypeRow =
        await repository.getEntityTypeByCode(
          input.entityTypeCode,
        );

      const entityType =
        normalizeEntityType(
          entityTypeRow,
        );

      if (!entityType) {
        throw new Error(
          `ENTITY_TYPE_NOT_FOUND:${input.entityTypeCode}`,
        );
      }

      /*
       * --------------------------------------------------------
       * STEP 2
       * Resolve OEM subtype candidates.
       * --------------------------------------------------------
       */

      const oemSubTypeRows =
        await repository.getOemSubTypes(
          entityType.id,
        );

      const oemSubTypes =
        normalizeOemSubTypes(
          oemSubTypeRows,
        );

      let resolvedOemSubType:
        OemSubTypeDefinition | null =
        null;

      if (input.oemSubTypeCode) {
        resolvedOemSubType =
          oemSubTypes.find(
            (subType) =>
              subType.code ===
                input.oemSubTypeCode &&
              subType.is_active,
          ) ?? null;

        if (!resolvedOemSubType) {
          throw new Error(
            `OEM_SUB_TYPE_NOT_FOUND:${input.oemSubTypeCode}`,
          );
        }
      }

      /*
       * --------------------------------------------------------
       * STEP 3
       * Load canonical assessment categories.
       * --------------------------------------------------------
       */

      const categoryRows =
        await repository.getChecklistCategories();

      const categories =
        normalizeCategories(
          categoryRows,
        );

      /*
       * --------------------------------------------------------
       * STEP 4
       * Load canonical checklist definitions.
       * --------------------------------------------------------
       */

      const checklistRows =
        await repository.getChecklistItems();

      const checklistItems =
        normalizeChecklistItems(
          checklistRows,
        );

      /*
       * --------------------------------------------------------
       * STEP 5
       * Load active assessment rules.
       * --------------------------------------------------------
       */

      const ruleRows =
        await repository.getAssessmentRules();

      const rules =
        normalizeRules(
          ruleRows,
        );

      /*
       * --------------------------------------------------------
       * STEP 6
       * Resolve applicable fee slabs.
       * --------------------------------------------------------
       */

      const feeRows =
        await repository.getFeeSlabs(
          entityType.id,
          resolvedOemSubType?.id ?? null,
          input.assessmentType ??
            DEFAULT_ASSESSMENT_TYPE,
        );

      const fees =
        normalizeFees(
          feeRows,
        );

      /*
       * --------------------------------------------------------
       * STEP 7
       * Convert service input into canonical domain input.
       * --------------------------------------------------------
       */

      const domainInput: CreateAssessmentInput = {
        entity_type_code:
          input.entityTypeCode,

        oem_sub_type_code:
          input.oemSubTypeCode ?? null,

        assessment_type:
          input.assessmentType ??
          DEFAULT_ASSESSMENT_TYPE,

        turnover_amount:
          input.turnoverAmount ?? null,
      };

      /*
       * --------------------------------------------------------
       * STEP 8
       * Build immutable source set.
       * --------------------------------------------------------
       */

      const sources: AssessmentDefinitionSources = {
        entityTypes: [
          entityType,
        ],

        oemSubTypes,

        categories,

        checklistItems,

        rules,

        fees,
      };

      /*
       * --------------------------------------------------------
       * STEP 9
       * Let the deterministic domain engine resolve
       * the final assessment definition.
       * --------------------------------------------------------
       */

      return resolveAssessmentDefinition(
        domainInput,
        sources,
      );
    },
  };
}