import type {
  CompanyComplianceResult,
  CompanyLegalProfile,
} from "./company.types";

export function evaluateCompanyCompliance(
  company: CompanyLegalProfile,
): CompanyComplianceResult {
  const reasons: string[] = [];
  const blockers: string[] = [];
  const requiredActions: string[] = [];

  const documents =
    company.documents ?? [];

  const mandatory =
    documents.filter(
      (document) =>
        document.isMandatory,
    );

  const mandatoryIncomplete =
    mandatory.filter(
      (document) =>
        document.verificationStatus !==
          "verified" ||
        !document.isCurrent,
    );

  const rejected =
    documents.filter(
      (document) =>
        document.verificationStatus ===
        "rejected",
    );

  const expired =
    documents.filter(
      (document) =>
        document.validityStatus ===
        "expired",
    );

  const expiring =
    documents.filter(
      (document) =>
        document.validityStatus ===
        "expiring",
    );

  const criticalFindings =
    company.findings.filter(
      (finding) =>
        finding.severity ===
          "critical" &&
        finding.correctiveActionStatus !==
          "closed",
    );

  const majorFindings =
    company.findings.filter(
      (finding) =>
        finding.severity ===
          "major" &&
        finding.correctiveActionStatus !==
          "closed",
    );

  if (
    !company.legalName.trim()
  ) {
    blockers.push(
      "Legal company name is missing.",
    );
  }

  if (
    !company.panNumber.trim()
  ) {
    blockers.push(
      "PAN details are missing.",
    );
  }

  if (
    company.legalStatus !==
    "active"
  ) {
    blockers.push(
      "Company legal status is not active.",
    );
  }

  if (
    mandatoryIncomplete.length >
    0
  ) {
    blockers.push(
      `${mandatoryIncomplete.length} mandatory legal document(s) are incomplete or not current.`,
    );
  }

  if (rejected.length > 0) {
    blockers.push(
      `${rejected.length} legal document(s) are rejected.`,
    );
  }

  if (expired.length > 0) {
    blockers.push(
      `${expired.length} legal document(s) are expired.`,
    );
  }

  if (
    criticalFindings.length >
    0
  ) {
    blockers.push(
      `${criticalFindings.length} critical compliance finding(s) remain open.`,
    );
  }

  if (
    company.riskLevel ===
    "critical"
  ) {
    blockers.push(
      "Company legal risk is classified as critical.",
    );
  }

  if (documents.length === 0) {
    blockers.push(
      "No legal evidence documents are registered.",
    );
  }

  /* =========================================================
     REASONS
  ========================================================= */

  if (
    company.legalName.trim()
  ) {
    reasons.push(
      "Legal company identity is available.",
    );
  }

  if (
    company.panNumber.trim()
  ) {
    reasons.push(
      "PAN details are available.",
    );
  }

  if (
    company.legalStatus ===
    "active"
  ) {
    reasons.push(
      "Company legal status is active.",
    );
  }

  if (
    mandatory.length > 0 &&
    mandatoryIncomplete.length ===
      0
  ) {
    reasons.push(
      "All mandatory legal documents are verified and current.",
    );
  }

  if (
    rejected.length === 0
  ) {
    reasons.push(
      "No legal documents are currently rejected.",
    );
  }

  if (
    expired.length === 0
  ) {
    reasons.push(
      "No registered legal documents are expired.",
    );
  }

  if (
    criticalFindings.length ===
    0
  ) {
    reasons.push(
      "No open critical compliance findings exist.",
    );
  }

  /* =========================================================
     REQUIRED ACTIONS
  ========================================================= */

  if (
    mandatoryIncomplete.length >
    0
  ) {
    requiredActions.push(
      "Complete and verify all mandatory legal documents.",
    );
  }

  if (rejected.length > 0) {
    requiredActions.push(
      "Replace or correct rejected legal documents and submit them for verification.",
    );
  }

  if (expired.length > 0) {
    requiredActions.push(
      "Renew expired legal documents and update their validity evidence.",
    );
  }

  if (expiring.length > 0) {
    requiredActions.push(
      "Review expiring legal documents and initiate renewal where applicable.",
    );
  }

  if (
    majorFindings.length > 0
  ) {
    requiredActions.push(
      "Close all open major compliance findings.",
    );
  }

  if (
    company.factoryAddress.trim() ===
    ""
  ) {
    requiredActions.push(
      "Record and verify the manufacturing/factory address where applicable.",
    );
  }

  /* =========================================================
     DECISION
  ========================================================= */

  const hasCriticalBlocker =
    blockers.some(
      (item) =>
        item.includes(
          "critical",
        ) ||
        item.includes(
          "rejected",
        ) ||
        item.includes(
          "expired",
        ),
    );

  let decision:
    CompanyComplianceResult["decision"];

  let canProceed = false;

  if (
    blockers.length === 0
  ) {
    decision = "approved";
    canProceed = true;
  } else if (
    hasCriticalBlocker ||
    criticalFindings.length > 0
  ) {
    decision = "rejected";
    canProceed = false;
  } else if (
    mandatoryIncomplete.length >
      0 ||
    company.legalStatus !==
      "active"
  ) {
    decision = "hold";
    canProceed = false;
  } else {
    decision =
      "conditionally_approved";
    canProceed = true;
  }

  return {
    decision,
    canProceed,

    reasons: Array.from(
      new Set(reasons),
    ),

    blockers: Array.from(
      new Set(blockers),
    ),

    requiredActions:
      Array.from(
        new Set(
          requiredActions,
        ),
      ),
  };
}
