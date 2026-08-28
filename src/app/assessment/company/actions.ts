"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { CompanyLegalProfile } from "./company.types";

function toNumber(value: string) {
  if (!value.trim()) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toDate(value: string) {
  if (!value.trim()) return null;

  return /^\d{4}$/.test(value)
    ? `${value}-01-01`
    : value;
}

export async function loadCompanyProfile(
  assessmentId: string,
): Promise<CompanyLegalProfile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  const { data: assessment, error: assessmentError } =
    await supabase
      .from("assessment_snapshots")
      .select("id, organization_id, created_by")
      .eq("id", assessmentId)
      .maybeSingle();

  if (assessmentError) {
    throw new Error(
      `COMPANY_ASSESSMENT_LOAD_FAILED:${assessmentError.message}`,
    );
  }

  if (!assessment) {
    throw new Error("ASSESSMENT_NOT_FOUND");
  }

  if (assessment.organization_id) {
    const { data: membership, error: membershipError } =
      await supabase
        .from("organization_members")
        .select("id")
        .eq("organization_id", assessment.organization_id)
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) {
      throw new Error(
        `COMPANY_MEMBERSHIP_CHECK_FAILED:${membershipError.message}`,
      );
    }

    if (!membership) {
      throw new Error("ORGANIZATION_ACCESS_DENIED");
    }
  } else if (assessment.created_by !== user.id) {
    throw new Error("ASSESSMENT_ACCESS_DENIED");
  }

  const { data, error } = await supabase
    .from("assessment_company_profiles")
    .select("*")
    .eq("assessment_id", assessmentId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `COMPANY_PROFILE_LOAD_FAILED:${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const year =
    data.incorporation_date
      ? String(data.incorporation_date).slice(0, 4)
      : "";

  return {
    id: data.id,
    assessmentId: data.assessment_id,

    legalName: data.legal_name ?? "",
    tradeName: data.trade_name ?? "",

    entityType:
      data.entity_constitution ?? "proprietorship",

    panNumber: data.pan ?? "",
    gstNumber: data.gstin ?? "",
    udyamNumber: data.udyam_number ?? "",

    incorporationNumber:
      data.cin ??
      data.llpin ??
      "",

    registeredAddress:
      [
        data.registered_address_line1,
        data.registered_address_line2,
      ]
        .filter(Boolean)
        .join(", "),

    factoryAddress: "",

    state: data.registered_state ?? "",
    district: data.registered_district ?? "",
    pincode: data.registered_pincode ?? "",

    yearOfEstablishment: year,

    legalStatus:
      data.status ?? "not_available",

    documents: [],
    findings: [],

    verificationStatus: "pending",
    riskLevel: "medium",

    createdAt:
      data.created_at ??
      new Date().toISOString(),

    updatedAt:
      data.updated_at ??
      new Date().toISOString(),

    remarks: "",
  };
}

export async function saveCompanyProfile(
  assessmentId: string,
  company: CompanyLegalProfile,
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  const { data: assessment, error: assessmentError } =
    await supabase
      .from("assessment_snapshots")
      .select("id, organization_id, created_by")
      .eq("id", assessmentId)
      .maybeSingle();

  if (assessmentError) {
    throw new Error(
      `COMPANY_ASSESSMENT_LOAD_FAILED:${assessmentError.message}`,
    );
  }

  if (!assessment) {
    throw new Error("ASSESSMENT_NOT_FOUND");
  }

  if (assessment.organization_id) {
    const { data: membership, error: membershipError } =
      await supabase
        .from("organization_members")
        .select("id")
        .eq("organization_id", assessment.organization_id)
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) {
      throw new Error(
        `COMPANY_MEMBERSHIP_CHECK_FAILED:${membershipError.message}`,
      );
    }

    if (!membership) {
      throw new Error("ORGANIZATION_ACCESS_DENIED");
    }
  } else if (assessment.created_by !== user.id) {
    throw new Error("ASSESSMENT_ACCESS_DENIED");
  }

  const { data: existing } = await supabase
    .from("assessment_company_profiles")
    .select("id")
    .eq("assessment_id", assessmentId)
    .maybeSingle();

  const payload = {
    assessment_id: assessmentId,
    organization_id: assessment.organization_id,
    created_by: user.id,

    legal_name: company.legalName || null,
    trade_name: company.tradeName || null,

    entity_constitution:
      company.entityType || null,

    pan: company.panNumber || null,
    gstin: company.gstNumber || null,
    udyam_number:
      company.udyamNumber || null,

    cin:
      company.incorporationNumber || null,

    registered_address_line1:
      company.registeredAddress || null,

    registered_address_line2: null,

    registered_state:
      company.state || null,

    registered_district:
      company.district || null,

    registered_pincode:
      company.pincode || null,

    incorporation_date:
      toDate(company.yearOfEstablishment),

    status: "draft",

    completion_percent:
      0,
  };

  const result = existing
    ? await supabase
        .from("assessment_company_profiles")
        .update(payload)
        .eq("id", existing.id)
    : await supabase
        .from("assessment_company_profiles")
        .insert(payload);

  if (result.error) {
    throw new Error(
      `COMPANY_PROFILE_SAVE_FAILED:${result.error.message}`,
    );
  }

  return {
    success: true,
    savedAt: new Date().toISOString(),
  };
}

