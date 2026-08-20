import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type EntityTypeRow =
  Database["public"]["Tables"]["entity_types"]["Row"];

type OemSubTypeRow =
  Database["public"]["Tables"]["oem_sub_types"]["Row"];

type ChecklistCategoryRow =
  Database["public"]["Tables"]["checklist_categories"]["Row"];

type ChecklistItemRow =
  Database["public"]["Tables"]["checklist_items"]["Row"];

type FeeSlabRow =
  Database["public"]["Tables"]["fee_slabs"]["Row"];

type AssessmentRuleRow =
  Database["public"]["Tables"]["assessment_rules"]["Row"];

type AssessmentSnapshotRow =
  Database["public"]["Tables"]["assessment_snapshots"]["Row"];

export interface AssessmentRepository {
  getEntityTypes(): Promise<EntityTypeRow[]>;

  getEntityTypeByCode(
    code: string,
  ): Promise<EntityTypeRow | null>;

  getOemSubTypes(
    entityTypeId?: string,
  ): Promise<OemSubTypeRow[]>;

  getOemSubTypeByCode(
    entityTypeId: string,
    code: string,
  ): Promise<OemSubTypeRow | null>;

  getChecklistCategories(): Promise<
    ChecklistCategoryRow[]
  >;

  getChecklistItems(): Promise<
    ChecklistItemRow[]
  >;

  getChecklistItemsByCategory(
    categoryId: string,
  ): Promise<ChecklistItemRow[]>;

  getAssessmentRules(): Promise<
    AssessmentRuleRow[]
  >;

  getFeeSlabs(
    entityTypeId: string,
    oemSubTypeId: string | null,
    assessmentType: string,
  ): Promise<FeeSlabRow[]>;

  getAssessmentSnapshot(
    assessmentId: string,
  ): Promise<AssessmentSnapshotRow | null>;

  getAssessmentSnapshotsForUser(
    userId: string,
  ): Promise<AssessmentSnapshotRow[]>;
}

function throwRepositoryError(
  operation: string,
  error: { message: string } | null,
): void {
  if (!error) {
    return;
  }

  throw new Error(
    `ASSESSMENT_REPOSITORY_${operation}:${error.message}`,
  );
}

export function createAssessmentRepository(): AssessmentRepository {
  return {
    /**
     * ========================================================
     * ENTITY TYPES
     * ========================================================
     */

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

      throwRepositoryError(
        "GET_ENTITY_TYPES",
        error,
      );

      return data ?? [];
    },

    async getEntityTypeByCode(code) {
      const supabase =
        await createSupabaseServerClient();

      const normalizedCode =
        code.trim().toLowerCase();

      const { data, error } = await supabase
        .from("entity_types")
        .select("*")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .maybeSingle();

      throwRepositoryError(
        "GET_ENTITY_TYPE_BY_CODE",
        error,
      );

      return data ?? null;
    },

    /**
     * ========================================================
     * OEM SUB TYPES
     * ========================================================
     */

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

      throwRepositoryError(
        "GET_OEM_SUB_TYPES",
        error,
      );

      return data ?? [];
    },

    async getOemSubTypeByCode(
      entityTypeId,
      code,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const normalizedCode =
        code.trim().toLowerCase();

      const { data, error } = await supabase
        .from("oem_sub_types")
        .select("*")
        .eq(
          "entity_type_id",
          entityTypeId,
        )
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .maybeSingle();

      throwRepositoryError(
        "GET_OEM_SUB_TYPE_BY_CODE",
        error,
      );

      return data ?? null;
    },

    /**
     * ========================================================
     * CHECKLIST CATEGORIES
     * ========================================================
     */

    async getChecklistCategories() {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("checklist_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      throwRepositoryError(
        "GET_CHECKLIST_CATEGORIES",
        error,
      );

      return data ?? [];
    },

    /**
     * ========================================================
     * CHECKLIST ITEMS
     * ========================================================
     */

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

      throwRepositoryError(
        "GET_CHECKLIST_ITEMS",
        error,
      );

      return data ?? [];
    },

    async getChecklistItemsByCategory(
      categoryId,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq(
          "category_id",
          categoryId,
        )
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      throwRepositoryError(
        "GET_CHECKLIST_ITEMS_BY_CATEGORY",
        error,
      );

      return data ?? [];
    },

    /**
     * ========================================================
     * ASSESSMENT RULES
     * ========================================================
     */

    async getAssessmentRules() {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("assessment_rules")
        .select("*")
        .eq("is_active", true)
        .order("priority", {
          ascending: true,
        });

      throwRepositoryError(
        "GET_ASSESSMENT_RULES",
        error,
      );

      return data ?? [];
    },

    /**
     * ========================================================
     * FEE SLABS
     * ========================================================
     */

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

      /*
       * A fee slab may be:
       *
       * 1. Specific to an OEM subtype
       * 2. Generic for the whole entity type
       */
      if (oemSubTypeId) {
        query = query.or(
          `oem_sub_type_id.eq.${oemSubTypeId},oem_sub_type_id.is.null`,
        );
      } else {
        query = query.is(
          "oem_sub_type_id",
          null,
        );
      }

      const { data, error } = await query;

      throwRepositoryError(
        "GET_FEE_SLABS",
        error,
      );

      return data ?? [];
    },

    /**
     * ========================================================
     * ASSESSMENT SNAPSHOT
     * ========================================================
     */

    async getAssessmentSnapshot(
      assessmentId,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("assessment_snapshots")
        .select("*")
        .eq("id", assessmentId)
        .maybeSingle();

      throwRepositoryError(
        "GET_ASSESSMENT_SNAPSHOT",
        error,
      );

      return data ?? null;
    },

    /**
     * ========================================================
     * USER ASSESSMENT HISTORY
     * ========================================================
     *
     * RLS remains the final security boundary.
     * This repository additionally scopes the query to
     * the requested authenticated user.
     */

    async getAssessmentSnapshotsForUser(
      userId,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("assessment_snapshots")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", {
          ascending: false,
        });

      throwRepositoryError(
        "GET_USER_ASSESSMENT_SNAPSHOTS",
        error,
      );

      return data ?? [];
    },
  };
}