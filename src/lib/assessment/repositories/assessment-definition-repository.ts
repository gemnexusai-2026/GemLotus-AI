import { createSupabaseServerClient } from "@/lib/supabase/server";

import type {
  AssessmentCategoryDefinition,
  AssessmentRuleDefinition,
  ChecklistItemDefinition,
  EntityTypeDefinition,
  FeeSlabDefinition,
  OemSubTypeDefinition,
} from "@/types/assessment/assessment-definition";

import type {
  EntityTypeCode,
  OemSubTypeCode,
} from "@/types/assessment/assessment-enums";

export interface AssessmentDefinitionRepository {
  getEntityTypes(): Promise<EntityTypeDefinition[]>;

  getEntityTypeByCode(
    code: EntityTypeCode,
  ): Promise<EntityTypeDefinition | null>;

  getOemSubTypes(
    entityTypeId?: string,
  ): Promise<OemSubTypeDefinition[]>;

  getOemSubTypeByCode(
    entityTypeId: string,
    code: OemSubTypeCode,
  ): Promise<OemSubTypeDefinition | null>;

  getCategories(): Promise<
    AssessmentCategoryDefinition[]
  >;

  getChecklistItems(): Promise<
    ChecklistItemDefinition[]
  >;

  getRules(): Promise<
    AssessmentRuleDefinition[]
  >;

  getFeeSlabs(
    entityTypeId: string,
    oemSubTypeId: string | null,
    assessmentType: string,
  ): Promise<FeeSlabDefinition[]>;
}

function assertNoSupabaseError(
  error: { message: string } | null,
): void {
  if (error) {
    throw new Error(
      `ASSESSMENT_DEFINITION_REPOSITORY_ERROR:${error.message}`,
    );
  }
}

export function createAssessmentDefinitionRepository(): AssessmentDefinitionRepository {
  return {
    async getEntityTypes() {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("entity_types")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      assertNoSupabaseError(error);

      return (data ?? []) as EntityTypeDefinition[];
    },

    async getEntityTypeByCode(code) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("entity_types")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .maybeSingle();

      assertNoSupabaseError(error);

      return (data ?? null) as EntityTypeDefinition | null;
    },

    async getOemSubTypes(entityTypeId) {
      const supabase =
        await createSupabaseServerClient();

      let query = supabase
        .from("oem_sub_types")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (entityTypeId) {
        query = query.eq(
          "entity_type_id",
          entityTypeId,
        );
      }

      const { data, error } = await query;

      assertNoSupabaseError(error);

      return (data ?? []) as OemSubTypeDefinition[];
    },

    async getOemSubTypeByCode(
      entityTypeId,
      code,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("oem_sub_types")
        .select("*")
        .eq("entity_type_id", entityTypeId)
        .eq("code", code)
        .eq("is_active", true)
        .maybeSingle();

      assertNoSupabaseError(error);

      return (data ?? null) as OemSubTypeDefinition | null;
    },

    async getCategories() {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("checklist_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      assertNoSupabaseError(error);

      return (
        data ?? []
      ) as AssessmentCategoryDefinition[];
    },

    async getChecklistItems() {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      assertNoSupabaseError(error);

      return (
        data ?? []
      ) as ChecklistItemDefinition[];
    },

    async getRules() {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("assessment_rules")
        .select("*")
        .eq("is_active", true)
        .order("priority", {
          ascending: true,
        });

      assertNoSupabaseError(error);

      return (
        data ?? []
      ) as AssessmentRuleDefinition[];
    },

    async getFeeSlabs(
      entityTypeId,
      oemSubTypeId,
      assessmentType,
    ) {
      const supabase =
        await createSupabaseServerClient();

      let query = supabase
        .from("fee_slabs")
        .select("*")
        .eq(
          "entity_type_id",
          entityTypeId,
        )
        .eq(
          "assessment_type",
          assessmentType,
        )
        .eq("is_active", true);

      if (oemSubTypeId) {
        query = query.or(
          `oem_sub_type_id.eq.${oemSubTypeId},oem_sub_type_id.is.null`,
        );
      }

      const { data, error } = await query;

      assertNoSupabaseError(error);

      return (
        data ?? []
      ) as FeeSlabDefinition[];
    },
  };
}