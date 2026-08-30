"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type {
  CompanyDocument,
  CompanyFinding,
  CompanyLegalProfile,
} from "./company.types";

function toDate(value: string) {
  return value.trim() ? value : null;
}

function toNumber(value: string) {
  if (!value.trim()) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function verifyAssessmentAccess(
  assessmentId: string,
  userId: string,
) {
  const supabase = await createSupabaseServerClient();

  const { data: assessment, error } =
    await supabase
      .from("assessment_snapshots")
      .select("id, organization_id, created_by")
      .eq("id", assessmentId)
      .maybeSingle();

  if (error) {
    throw new Error(
      `COMPANY_ASSESSMENT_LOAD_FAILED:${error.message}`,
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
        .eq(
          "organization_id",
          assessment.organization_id,
        )
        .eq("user_id", userId)
        .maybeSingle();

    if (membershipError) {
      throw new Error(
        `COMPANY_MEMBERSHIP_CHECK_FAILED:${membershipError.message}`,
      );
    }

    if (!membership) {
      throw new Error("ORGANIZATION_ACCESS_DENIED");
    }
  } else if (assessment.created_by !== userId) {
    throw new Error("ASSESSMENT_ACCESS_DENIED");
  }

  return assessment;
}

function mapDocument(
  row: Record<string, unknown>,
): CompanyDocument {
  return {
    id: String(row.id),
    companyId: String(row.company_id),

    documentType:
      row.document_type as CompanyDocument["documentType"],

    documentName: String(row.document_name ?? ""),
    documentNumber: String(row.document_number ?? ""),

    issuingAuthority:
      String(row.issuing_authority ?? ""),

    issueDate: row.issue_date
      ? String(row.issue_date)
      : "",

    expiryDate: row.expiry_date
      ? String(row.expiry_date)
      : "",

    validityStatus:
      row.validity_status as CompanyDocument["validityStatus"],

    verificationStatus:
      row.verification_status as CompanyDocument["verificationStatus"],

    fileName: String(row.file_name ?? ""),
    fileReference:
      String(row.file_reference ?? ""),

    isMandatory: Boolean(row.is_mandatory),
    isCurrent: Boolean(row.is_current),

    verifiedBy:
      String(row.verified_by ?? ""),

    verificationDate:
      row.verification_date
        ? String(row.verification_date)
        : "",

    remarks: String(row.remarks ?? ""),
  };
}

function mapFinding(
  row: Record<string, unknown>,
): CompanyFinding {
  return {
    id: String(row.id),
    companyId: String(row.company_id ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    severity:
      row.severity as CompanyFinding["severity"],
    requirement:
      String(row.requirement ?? ""),
    evidenceReference:
      String(row.evidence_reference ?? ""),
    correctiveAction:
      String(row.corrective_action ?? ""),
    correctiveActionStatus:
      row.corrective_action_status as CompanyFinding["correctiveActionStatus"],
    remarks:
      String(row.remarks ?? ""),
  };
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

  const assessment =
    await verifyAssessmentAccess(
      assessmentId,
      user.id,
    );

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

  const { data: documentRows, error: documentError } =
    await supabase
      .from("assessment_company_documents")
      .select("*")
      .eq("assessment_id", assessmentId)
      .order("created_at", {
        ascending: true,
      });

  if (documentError) {
    throw new Error(
      `COMPANY_DOCUMENTS_LOAD_FAILED:${documentError.message}`,
    );
  }

  const { data: findingRows, error: findingError } =
    await supabase
      .from("assessment_company_findings")
      .select("*")
      .eq("assessment_id", assessmentId)
      .order("created_at", {
        ascending: true,
      });

  if (findingError) {
    throw new Error(
      `COMPANY_FINDINGS_LOAD_FAILED:${findingError.message}`,
    );
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
    udyamNumber:
      data.udyam_number ?? "",

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

    state:
      data.registered_state ?? "",

    district:
      data.registered_district ?? "",

    pincode:
      data.registered_pincode ?? "",

    yearOfEstablishment: year,

    legalStatus:
      data.status === "complete"
        ? "active"
        : "not_available",

    documents:
      (documentRows ?? []).map(
        (row) =>
          mapDocument(
            row as Record<string, unknown>,
          ),
      ),

    findings:
      (findingRows ?? []).map(
        (row) =>
          mapFinding(
            row as Record<string, unknown>,
          ),
      ),

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

  const assessment =
    await verifyAssessmentAccess(
      assessmentId,
      user.id,
    );

  const { data: existing } = await supabase
    .from("assessment_company_profiles")
    .select("id")
    .eq("assessment_id", assessmentId)
    .maybeSingle();

  const payload = {
    assessment_id: assessmentId,
    organization_id:
      assessment.organization_id,
    created_by: user.id,

    legal_name:
      company.legalName || null,

    trade_name:
      company.tradeName || null,

    entity_constitution:
      company.entityType || null,

    pan:
      company.panNumber || null,

    gstin:
      company.gstNumber || null,

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
      toDate(
        company.yearOfEstablishment,
      ),

    status: "draft",

    completion_percent: 0,
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

export async function saveCompanyDocuments(
  assessmentId: string,
  documents: CompanyDocument[],
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  const assessment =
    await verifyAssessmentAccess(
      assessmentId,
      user.id,
    );

  /*
   * Autosave-safe persistence:
   *
   * Natural identity:
   * assessment_id + company_id + document_type
   *
   * Never use the temporary client-side document ID
   * as the persistence identity.
   */

  if (documents.length === 0) {
    const { error } =
      await supabase
        .from("assessment_company_documents")
        .delete()
        .eq(
          "assessment_id",
          assessmentId,
        );

    if (error) {
      throw new Error(
        `COMPANY_DOCUMENTS_CLEAR_FAILED:${error.message}`,
      );
    }

    return {
      success: true,
      savedAt: new Date().toISOString(),
    };
  }

  const normalizedDocuments =
    documents.filter(
      (document) =>
        Boolean(document.documentType),
    );

  const rows =
    normalizedDocuments.map(
      (document) => ({
        assessment_id:
          assessmentId,

        organization_id:
          assessment.organization_id,

        company_id:
          document.companyId,

        document_type:
          document.documentType,

        document_name:
          document.documentName || "",

        document_number:
          document.documentNumber || "",

        issuing_authority:
          document.issuingAuthority || "",

        issue_date:
          toDate(document.issueDate),

        expiry_date:
          toDate(document.expiryDate),

        validity_status:
          document.validityStatus,

        verification_status:
          document.verificationStatus,

        file_name:
          document.fileName || "",

        file_reference:
          document.fileReference || "",

        is_mandatory:
          document.isMandatory,

        is_current:
          document.isCurrent,

        verified_by:
          document.verifiedBy || "",

        verification_date:
          toDate(
            document.verificationDate,
          ),

        remarks:
          document.remarks || "",
      }),
    );

  const { error: upsertError } =
    await supabase
      .from(
        "assessment_company_documents",
      )
      .upsert(rows, {
        onConflict:
          "assessment_id,company_id,document_type",
      });

  if (upsertError) {
    throw new Error(
      `COMPANY_DOCUMENTS_SAVE_FAILED:${upsertError.message}`,
    );
  }

  /*
   * Delete only document types that are no longer
   * present in the current client state.
   *
   * We compare natural keys instead of client IDs
   * because the UI IDs are temporary.
   */

  const companyIds =
    Array.from(
      new Set(
        normalizedDocuments.map(
          (document) =>
            document.companyId,
        ),
      ),
    );

  for (const companyId of companyIds) {
    const activeTypes =
      normalizedDocuments
        .filter(
          (document) =>
            document.companyId ===
            companyId,
        )
        .map(
          (document) =>
            document.documentType,
        );

    const { data: existingRows, error: existingError } =
      await supabase
        .from(
          "assessment_company_documents",
        )
        .select(
          "id, document_type",
        )
        .eq(
          "assessment_id",
          assessmentId,
        )
        .eq(
          "company_id",
          companyId,
        );

    if (existingError) {
      throw new Error(
        `COMPANY_DOCUMENTS_EXISTING_LOAD_FAILED:${existingError.message}`,
      );
    }

    const staleIds =
      (existingRows ?? [])
        .filter(
          (row) =>
            !activeTypes.includes(
              row.document_type as CompanyDocument["documentType"],
            ),
        )
        .map(
          (row) => row.id,
        );

    if (staleIds.length > 0) {
      const { error: deleteError } =
        await supabase
          .from(
            "assessment_company_documents",
          )
          .delete()
          .eq(
            "assessment_id",
            assessmentId,
          )
          .eq(
            "company_id",
            companyId,
          )
          .in(
            "id",
            staleIds,
          );

      if (deleteError) {
        throw new Error(
          `COMPANY_DOCUMENTS_DELETE_FAILED:${deleteError.message}`,
        );
      }
    }
  }

  return {
    success: true,
    savedAt: new Date().toISOString(),
  };
}
export async function saveCompanyFindings(
  assessmentId: string,
  findings: CompanyFinding[],
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  const assessment =
    await verifyAssessmentAccess(
      assessmentId,
      user.id,
    );

  const { error: deleteError } =
    await supabase
      .from("assessment_company_findings")
      .delete()
      .eq("assessment_id", assessmentId);

  if (deleteError) {
    throw new Error(
      `COMPANY_FINDINGS_DELETE_FAILED:${deleteError.message}`,
    );
  }

  if (findings.length === 0) {
    return {
      success: true,
      savedAt: new Date().toISOString(),
    };
  }

  const rows = findings.map(
    (finding) => ({
      assessment_id:
        assessmentId,

      organization_id:
        assessment.organization_id,

      company_id:
        finding.companyId,

      title:
        finding.title || "",

      description:
        finding.description || "",

      severity:
        finding.severity,

      requirement:
        finding.requirement || "",

      evidence_reference:
        finding.evidenceReference || "",

      corrective_action:
        finding.correctiveAction || "",

      corrective_action_status:
        finding.correctiveActionStatus,

      remarks:
        finding.remarks || "",
    }),
  );

  const { error: insertError } =
    await supabase
      .from("assessment_company_findings")
      .insert(rows);

  if (insertError) {
    throw new Error(
      `COMPANY_FINDINGS_SAVE_FAILED:${insertError.message}`,
    );
  }

  return {
    success: true,
    savedAt: new Date().toISOString(),
  };
}




