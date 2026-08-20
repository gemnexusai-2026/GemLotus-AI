export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      assessment_rules: {
        Row: {
          actions: Json
          code: string
          conditions: Json
          created_at: string
          description: string | null
          effective_from: string
          effective_until: string | null
          id: string
          is_active: boolean
          name: string
          priority: number
          rule_type: string
          updated_at: string
          version: number
        }
        Insert: {
          actions?: Json
          code: string
          conditions?: Json
          created_at?: string
          description?: string | null
          effective_from?: string
          effective_until?: string | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          rule_type: string
          updated_at?: string
          version?: number
        }
        Update: {
          actions?: Json
          code?: string
          conditions?: Json
          created_at?: string
          description?: string | null
          effective_from?: string
          effective_until?: string | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          rule_type?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      assessment_snapshots: {
        Row: {
          assessment_type: string
          base_fee: number | null
          checklist_snapshot: Json
          created_at: string
          created_by: string | null
          definition_version: number
          entity_type_id: string
          fee_snapshot: Json
          gst_amount: number | null
          gst_percent: number | null
          id: string
          oem_sub_type_id: string | null
          payment_status: string
          rules_snapshot: Json
          status: string
          total_fee: number | null
          turnover_amount: number | null
          turnover_slab_code: string | null
          updated_at: string
        }
        Insert: {
          assessment_type: string
          base_fee?: number | null
          checklist_snapshot?: Json
          created_at?: string
          created_by?: string | null
          definition_version?: number
          entity_type_id: string
          fee_snapshot?: Json
          gst_amount?: number | null
          gst_percent?: number | null
          id?: string
          oem_sub_type_id?: string | null
          payment_status?: string
          rules_snapshot?: Json
          status?: string
          total_fee?: number | null
          turnover_amount?: number | null
          turnover_slab_code?: string | null
          updated_at?: string
        }
        Update: {
          assessment_type?: string
          base_fee?: number | null
          checklist_snapshot?: Json
          created_at?: string
          created_by?: string | null
          definition_version?: number
          entity_type_id?: string
          fee_snapshot?: Json
          gst_amount?: number | null
          gst_percent?: number | null
          id?: string
          oem_sub_type_id?: string | null
          payment_status?: string
          rules_snapshot?: Json
          status?: string
          total_fee?: number | null
          turnover_amount?: number | null
          turnover_slab_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_snapshots_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_snapshots_oem_sub_type_id_fkey"
            columns: ["oem_sub_type_id"]
            isOneToOne: false
            referencedRelation: "oem_sub_types"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_categories: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          applicability: Json
          category_id: string
          code: string
          created_at: string
          description: string | null
          evidence_required: boolean
          evidence_requirements: Json
          id: string
          is_active: boolean
          is_mandatory: boolean
          item_type: string
          scoring_weight: number
          sort_order: number
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          applicability?: Json
          category_id: string
          code: string
          created_at?: string
          description?: string | null
          evidence_required?: boolean
          evidence_requirements?: Json
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          item_type?: string
          scoring_weight?: number
          sort_order?: number
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          applicability?: Json
          category_id?: string
          code?: string
          created_at?: string
          description?: string | null
          evidence_required?: boolean
          evidence_requirements?: Json
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          item_type?: string
          scoring_weight?: number
          sort_order?: number
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "checklist_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      fee_slabs: {
        Row: {
          assessment_type: string
          base_fee: number
          created_at: string
          currency_code: string
          effective_from: string
          effective_until: string | null
          entity_type_id: string
          gst_percent: number
          id: string
          is_active: boolean
          max_turnover: number | null
          min_turnover: number | null
          oem_sub_type_id: string | null
          turnover_slab_code: string
          updated_at: string
          version: number
        }
        Insert: {
          assessment_type: string
          base_fee: number
          created_at?: string
          currency_code?: string
          effective_from?: string
          effective_until?: string | null
          entity_type_id: string
          gst_percent?: number
          id?: string
          is_active?: boolean
          max_turnover?: number | null
          min_turnover?: number | null
          oem_sub_type_id?: string | null
          turnover_slab_code: string
          updated_at?: string
          version?: number
        }
        Update: {
          assessment_type?: string
          base_fee?: number
          created_at?: string
          currency_code?: string
          effective_from?: string
          effective_until?: string | null
          entity_type_id?: string
          gst_percent?: number
          id?: string
          is_active?: boolean
          max_turnover?: number | null
          min_turnover?: number | null
          oem_sub_type_id?: string | null
          turnover_slab_code?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "fee_slabs_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_slabs_oem_sub_type_id_fkey"
            columns: ["oem_sub_type_id"]
            isOneToOne: false
            referencedRelation: "oem_sub_types"
            referencedColumns: ["id"]
          },
        ]
      }
      oem_sub_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          entity_type_id: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          entity_type_id: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          entity_type_id?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oem_sub_types_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "entity_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
