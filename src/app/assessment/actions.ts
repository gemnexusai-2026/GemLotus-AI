"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CompanyProfileInput {
  legalName: string;
  tradeName: string;
  entityConstitution: string;

  pan: string;
  gstin: string;
  cin: string;
  llpin: string;
  udyamNumber: string;

  incorporationDate: string;

  businessActivity: string;
  industrySector: string;
  yearsInOperation: string;

  manufacturerStatus: string;
  oemStatus: string;
  ownBrandStatus: string;

  registeredAddressLine1: string;
  registeredAddressLine2: string;
  registeredCity: string;
  registeredDistrict: string;
  registeredState: string;
  registeredPincode: string;

  authorizedPersonName: string;
  authorizedPersonDesignation: string;
  authorizedPersonEmail: string;
  authorizedPersonPhone: string;

  employeeCount: string;
  technicalEmployeeCount: string;

  annualTurnover: string;
  turnoverFinancialYear: string;
  netWorth: string;

  governmentExperience: boolean;
  governmentClientCount: string;

  qualityCertifications: string[];
  statutoryLicenses: string[];
}

function clean(value: string) {
  return value.trim();
}

function numberOrNull(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

function calculateCompletion(
  data: CompanyProfileInput,
) {
  const required = [
    data.legalName,
    data.entityConstitution,
    data.pan,
    data.businessActivity,
    data.registeredAddressLine1,
    data.registeredCity,
    data.registeredState,
    data.registeredPincode,
    data.authorizedPersonName,
    data.authorizedPersonEmail,
    data.authorizedPersonPhone,
    data.employeeCount,
  ];

  const completed = required.filter(
    (value) => clean(value).length > 0,
  ).length;

  return Math.round(
    (completed / required.length) * 100,
  );
}

export async function saveCompanyProfile(
  assessmentId: string,
  input: CompanyProfileInput,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/assessment/company?assessmentId=${assessmentId}`,
      )}`,
    );
  }

  const completionPercent =
    calculateCompletion(input);

  const status =
    completionPercent >= 100
      ? "complete"
      : completionPercent > 0
        ? "in_progress"
        : "draft";

  const payload = {
    assessment_id: assessmentId,
    created_by: user.id,

    legal_name: clean(input.legalName),
    trade_name: clean(input.tradeName),
    entity_constitution:
      clean(input.entityConstitution),

    pan: clean(input.pan).toUpperCase(),
    gstin: clean(input.gstin).toUpperCase(),
    cin: clean(input.cin).toUpperCase(),
    llpin: clean(input.llpin).toUpperCase(),
    udyam_number:
      clean(input.udyamNumber).toUpperCase(),

    incorporation_date:
      input.incorporationDate || null,

    business_activity:
      clean(input.businessActivity),
    industry_sector:
      clean(input.industrySector),
    years_in_operation:
      numberOrNull(input.yearsInOperation),

    manufacturer_status:
      clean(input.manufacturerStatus),
    oem_status:
      clean(input.oemStatus),
    own_brand_status:
      clean(input.ownBrandStatus),

    registered_address_line1:
      clean(input.registeredAddressLine1),
    registered_address_line2:
      clean(input.registeredAddressLine2),
    registered_city:
      clean(input.registeredCity),
    registered_district:
      clean(input.registeredDistrict),
    registered_state:
      clean(input.registeredState),
    registered_pincode:
      clean(input.registeredPincode),

    authorized_person_name:
      clean(input.authorizedPersonName),
    authorized_person_designation:
      clean(input.authorizedPersonDesignation),
    authorized_person_email:
      clean(input.authorizedPersonEmail),
    authorized_person_phone:
      clean(input.authorizedPersonPhone),

    employee_count:
      numberOrNull(input.employeeCount),
    technical_employee_count:
      numberOrNull(
        input.technicalEmployeeCount,
      ),

    annual_turnover:
      numberOrNull(input.annualTurnover),
    turnover_financial_year:
      clean(input.turnoverFinancialYear),
    net_worth:
      numberOrNull(input.netWorth),

    government_experience:
      input.governmentExperience,

    government_client_count:
      numberOrNull(
        input.governmentClientCount,
      ),

    quality_certifications:
      input.qualityCertifications,

    statutory_licenses:
      input.statutoryLicenses,

    completion_percent:
      completionPercent,

    status,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("assessment_company_profiles")
    .upsert(payload, {
      onConflict: "assessment_id",
    });

  if (error) {
    throw new Error(
      `COMPANY_PROFILE_SAVE_FAILED:${error.message}`,
    );
  }

  return {
    success: true,
    completionPercent,
    status,
  };
}
export async function startAssessment(
  entityTypeCode: string,
  organizationId?: string,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        "/assessment",
      )}`,
    );
  }  
  if (organizationId) {
    const { data: membership, error: membershipError } =
      await supabase
        .from("organization_members")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) {
      throw new Error(`ORGANIZATION_MEMBERSHIP_CHECK_FAILED:${membershipError.message}`);
    }

    if (!membership) {
      throw new Error(
        "ORGANIZATION_ACCESS_DENIED",
      );
    }
  }

  const normalizedCode =
    entityTypeCode.trim().toLowerCase();

  if (!normalizedCode) {
    redirect("/assessment");
  }

  const { data: entityType, error: entityError } =
    await supabase
      .from("entity_types")
      .select("*")
      .eq("code", normalizedCode)
      .eq("is_active", true)
      .maybeSingle();

  if (entityError || !entityType) {
    throw new Error(
      `ASSESSMENT_ENTITY_NOT_FOUND:${entityError?.message ?? normalizedCode}`,
    );
  }

  const [
    { data: checklistCategories, error: categoryError },
    { data: checklistItems, error: itemError },
    { data: assessmentRules, error: rulesError },
  ] = await Promise.all([
    supabase
      .from("checklist_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("checklist_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("assessment_rules")
      .select("*")
      .eq("is_active", true)
      .order("priority", {
        ascending: true,
      }),
  ]);

  if (categoryError) {
    throw new Error(
      `ASSESSMENT_CHECKLIST_CATEGORY_LOAD_FAILED:${categoryError.message}`,
    );
  }

  if (itemError) {
    throw new Error(
      `ASSESSMENT_CHECKLIST_ITEM_LOAD_FAILED:${itemError.message}`,
    );
  }

  if (rulesError) {
    throw new Error(
      `ASSESSMENT_RULE_LOAD_FAILED:${rulesError.message}`,
    );
  }

  const { data: assessment, error: assessmentError } =
    await supabase
      .from("assessment_snapshots")
      .insert({
        created_by: user.id,
        organization_id: organizationId,
        entity_type_id: entityType.id,

        assessment_type:
          normalizedCode === "oem"
            ? "oem"
            : "vendor_assessment",

        oem_sub_type_id: null,

        definition_version: 1,

        checklist_snapshot: {
          categories: checklistCategories ?? [],
          items: checklistItems ?? [],
        },

        rules_snapshot:
          assessmentRules ?? [],

        fee_snapshot: {},

        base_fee: null,
        gst_percent: null,
        gst_amount: null,
        total_fee: null,

        turnover_amount: null,
        turnover_slab_code: null,

        status: "draft",
        payment_status: "pending",
      })
      .select("id")
      .single();

  if (assessmentError || !assessment) {
    throw new Error(
      `ASSESSMENT_CREATE_FAILED:${assessmentError?.message ?? "Unknown error"}`,
    );
  }

  redirect(
    `/assessment/company?assessmentId=${assessment.id}`,
  );
}





