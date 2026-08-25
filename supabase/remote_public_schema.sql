


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select coalesce(
    auth.jwt() -> 'app_metadata' ->> 'role',
    ''
  ) = 'admin';
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."assessment_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "rule_type" "text" NOT NULL,
    "conditions" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "actions" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "priority" integer DEFAULT 100 NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "effective_from" timestamp with time zone DEFAULT "now"() NOT NULL,
    "effective_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "assessment_rules_priority_positive" CHECK (("priority" > 0)),
    CONSTRAINT "assessment_rules_version_positive" CHECK (("version" > 0))
);


ALTER TABLE "public"."assessment_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assessment_snapshots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_by" "uuid",
    "entity_type_id" "uuid" NOT NULL,
    "oem_sub_type_id" "uuid",
    "assessment_type" "text" NOT NULL,
    "turnover_amount" numeric(20,2),
    "turnover_slab_code" "text",
    "definition_version" integer DEFAULT 1 NOT NULL,
    "checklist_snapshot" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "rules_snapshot" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "fee_snapshot" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "base_fee" numeric(20,2),
    "gst_percent" numeric(5,2),
    "gst_amount" numeric(20,2),
    "total_fee" numeric(20,2),
    "payment_status" "text" DEFAULT 'unpaid'::"text" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "assessment_snapshots_definition_version" CHECK (("definition_version" > 0)),
    CONSTRAINT "assessment_snapshots_payment_status" CHECK (("payment_status" = ANY (ARRAY['unpaid'::"text", 'pending'::"text", 'paid'::"text", 'failed'::"text", 'refunded'::"text"]))),
    CONSTRAINT "assessment_snapshots_status" CHECK (("status" = ANY (ARRAY['draft'::"text", 'active'::"text", 'in_progress'::"text", 'submitted'::"text", 'under_review'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."assessment_snapshots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "sort_order" integer NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "checklist_categories_code_format" CHECK (("code" ~ '^[a-z0-9_]+$'::"text")),
    CONSTRAINT "checklist_categories_sort_order_positive" CHECK (("sort_order" > 0))
);


ALTER TABLE "public"."checklist_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "code" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "item_type" "text" DEFAULT 'document'::"text" NOT NULL,
    "is_mandatory" boolean DEFAULT false NOT NULL,
    "evidence_required" boolean DEFAULT true NOT NULL,
    "applicability" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "evidence_requirements" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "scoring_weight" numeric(8,3) DEFAULT 0 NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "checklist_items_item_type" CHECK (("item_type" = ANY (ARRAY['document'::"text", 'physical'::"text", 'process'::"text", 'verification'::"text", 'photo'::"text", 'video'::"text", 'financial'::"text", 'certificate'::"text", 'declaration'::"text", 'other'::"text"]))),
    CONSTRAINT "checklist_items_version_positive" CHECK (("version" > 0)),
    CONSTRAINT "checklist_items_weight_nonnegative" CHECK (("scoring_weight" >= (0)::numeric))
);


ALTER TABLE "public"."checklist_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."entity_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "entity_types_code_format" CHECK (("code" ~ '^[a-z0-9_]+$'::"text"))
);


ALTER TABLE "public"."entity_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fee_slabs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type_id" "uuid" NOT NULL,
    "oem_sub_type_id" "uuid",
    "assessment_type" "text" NOT NULL,
    "turnover_slab_code" "text" NOT NULL,
    "min_turnover" numeric(20,2),
    "max_turnover" numeric(20,2),
    "currency_code" character(3) DEFAULT 'INR'::"bpchar" NOT NULL,
    "base_fee" numeric(20,2) NOT NULL,
    "gst_percent" numeric(5,2) DEFAULT 18.00 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "effective_from" timestamp with time zone DEFAULT "now"() NOT NULL,
    "effective_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "fee_slabs_base_fee_nonnegative" CHECK (("base_fee" >= (0)::numeric)),
    CONSTRAINT "fee_slabs_currency_upper" CHECK ((("currency_code")::"text" = "upper"(("currency_code")::"text"))),
    CONSTRAINT "fee_slabs_gst_valid" CHECK ((("gst_percent" >= (0)::numeric) AND ("gst_percent" <= (100)::numeric))),
    CONSTRAINT "fee_slabs_turnover_valid" CHECK ((("min_turnover" IS NULL) OR ("max_turnover" IS NULL) OR ("min_turnover" <= "max_turnover"))),
    CONSTRAINT "fee_slabs_version_positive" CHECK (("version" > 0))
);


ALTER TABLE "public"."fee_slabs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."oem_sub_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type_id" "uuid" NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "oem_sub_types_code_format" CHECK (("code" ~ '^[a-z0-9_]+$'::"text"))
);


ALTER TABLE "public"."oem_sub_types" OWNER TO "postgres";


ALTER TABLE ONLY "public"."assessment_rules"
    ADD CONSTRAINT "assessment_rules_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."assessment_rules"
    ADD CONSTRAINT "assessment_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessment_snapshots"
    ADD CONSTRAINT "assessment_snapshots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_sort_order_key" UNIQUE ("sort_order");



ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."entity_types"
    ADD CONSTRAINT "entity_types_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."entity_types"
    ADD CONSTRAINT "entity_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fee_slabs"
    ADD CONSTRAINT "fee_slabs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."oem_sub_types"
    ADD CONSTRAINT "oem_sub_types_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."oem_sub_types"
    ADD CONSTRAINT "oem_sub_types_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_assessment_rules_active_priority" ON "public"."assessment_rules" USING "btree" ("is_active", "priority");



CREATE INDEX "idx_assessment_rules_conditions" ON "public"."assessment_rules" USING "gin" ("conditions");



CREATE INDEX "idx_assessment_snapshots_created_by" ON "public"."assessment_snapshots" USING "btree" ("created_by");



CREATE INDEX "idx_assessment_snapshots_entity" ON "public"."assessment_snapshots" USING "btree" ("entity_type_id", "oem_sub_type_id");



CREATE INDEX "idx_assessment_snapshots_status" ON "public"."assessment_snapshots" USING "btree" ("status");



CREATE INDEX "idx_checklist_categories_active_sort" ON "public"."checklist_categories" USING "btree" ("is_active", "sort_order");



CREATE INDEX "idx_checklist_items_active" ON "public"."checklist_items" USING "btree" ("is_active");



CREATE INDEX "idx_checklist_items_applicability" ON "public"."checklist_items" USING "gin" ("applicability");



CREATE INDEX "idx_checklist_items_category" ON "public"."checklist_items" USING "btree" ("category_id");



CREATE INDEX "idx_entity_types_active_sort" ON "public"."entity_types" USING "btree" ("is_active", "sort_order");



CREATE INDEX "idx_fee_slabs_resolution" ON "public"."fee_slabs" USING "btree" ("entity_type_id", "oem_sub_type_id", "assessment_type", "turnover_slab_code", "is_active");



CREATE INDEX "idx_oem_sub_types_active_sort" ON "public"."oem_sub_types" USING "btree" ("is_active", "sort_order");



CREATE INDEX "idx_oem_sub_types_entity" ON "public"."oem_sub_types" USING "btree" ("entity_type_id");



CREATE OR REPLACE TRIGGER "trg_assessment_rules_updated_at" BEFORE UPDATE ON "public"."assessment_rules" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_assessment_snapshots_updated_at" BEFORE UPDATE ON "public"."assessment_snapshots" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_checklist_categories_updated_at" BEFORE UPDATE ON "public"."checklist_categories" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_checklist_items_updated_at" BEFORE UPDATE ON "public"."checklist_items" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_entity_types_updated_at" BEFORE UPDATE ON "public"."entity_types" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_fee_slabs_updated_at" BEFORE UPDATE ON "public"."fee_slabs" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_oem_sub_types_updated_at" BEFORE UPDATE ON "public"."oem_sub_types" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."assessment_snapshots"
    ADD CONSTRAINT "assessment_snapshots_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."assessment_snapshots"
    ADD CONSTRAINT "assessment_snapshots_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."assessment_snapshots"
    ADD CONSTRAINT "assessment_snapshots_oem_sub_type_id_fkey" FOREIGN KEY ("oem_sub_type_id") REFERENCES "public"."oem_sub_types"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."checklist_categories"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."fee_slabs"
    ADD CONSTRAINT "fee_slabs_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."fee_slabs"
    ADD CONSTRAINT "fee_slabs_oem_sub_type_id_fkey" FOREIGN KEY ("oem_sub_type_id") REFERENCES "public"."oem_sub_types"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."oem_sub_types"
    ADD CONSTRAINT "oem_sub_types_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE RESTRICT;



CREATE POLICY "assessment_checklist_categories_select" ON "public"."checklist_categories" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



CREATE POLICY "assessment_checklist_items_select" ON "public"."checklist_items" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



CREATE POLICY "assessment_entity_types_select" ON "public"."entity_types" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



CREATE POLICY "assessment_fee_slabs_select" ON "public"."fee_slabs" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



CREATE POLICY "assessment_oem_sub_types_select" ON "public"."oem_sub_types" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



ALTER TABLE "public"."assessment_rules" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "assessment_rules_admin_delete" ON "public"."assessment_rules" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "assessment_rules_admin_insert" ON "public"."assessment_rules" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "assessment_rules_admin_update" ON "public"."assessment_rules" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "assessment_rules_authenticated_read" ON "public"."assessment_rules" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "assessment_rules_select" ON "public"."assessment_rules" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



ALTER TABLE "public"."assessment_snapshots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "assessment_snapshots_owner_insert" ON "public"."assessment_snapshots" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "assessment_snapshots_owner_read" ON "public"."assessment_snapshots" FOR SELECT TO "authenticated" USING ((("created_by" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "assessment_snapshots_owner_update" ON "public"."assessment_snapshots" FOR UPDATE TO "authenticated" USING ((("created_by" = "auth"."uid"()) OR "public"."is_admin"())) WITH CHECK ((("created_by" = "auth"."uid"()) OR "public"."is_admin"()));



ALTER TABLE "public"."checklist_categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checklist_categories_admin_delete" ON "public"."checklist_categories" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "checklist_categories_admin_insert" ON "public"."checklist_categories" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "checklist_categories_admin_update" ON "public"."checklist_categories" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "checklist_categories_authenticated_read" ON "public"."checklist_categories" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."checklist_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checklist_items_admin_delete" ON "public"."checklist_items" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "checklist_items_admin_insert" ON "public"."checklist_items" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "checklist_items_admin_update" ON "public"."checklist_items" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "checklist_items_authenticated_read" ON "public"."checklist_items" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."entity_types" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "entity_types_admin_delete" ON "public"."entity_types" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "entity_types_admin_insert" ON "public"."entity_types" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "entity_types_admin_update" ON "public"."entity_types" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "entity_types_authenticated_read" ON "public"."entity_types" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."fee_slabs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fee_slabs_admin_delete" ON "public"."fee_slabs" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "fee_slabs_admin_insert" ON "public"."fee_slabs" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "fee_slabs_admin_update" ON "public"."fee_slabs" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "fee_slabs_authenticated_read" ON "public"."fee_slabs" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."oem_sub_types" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "oem_sub_types_admin_delete" ON "public"."oem_sub_types" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "oem_sub_types_admin_insert" ON "public"."oem_sub_types" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "oem_sub_types_admin_update" ON "public"."oem_sub_types" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "oem_sub_types_authenticated_read" ON "public"."oem_sub_types" FOR SELECT TO "authenticated" USING (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_rules" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_rules" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_rules" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_snapshots" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_snapshots" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_snapshots" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."checklist_categories" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."checklist_categories" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."checklist_categories" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."checklist_items" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."checklist_items" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."checklist_items" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."entity_types" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."entity_types" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."entity_types" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."fee_slabs" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."fee_slabs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."fee_slabs" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."oem_sub_types" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."oem_sub_types" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."oem_sub_types" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";







