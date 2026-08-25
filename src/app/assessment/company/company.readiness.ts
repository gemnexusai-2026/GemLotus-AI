import type {
  CompanyLegalProfile,
  CompanyReadinessResult,
} from "./company.types";

export function calculateCompanyReadiness(
  company: CompanyLegalProfile,
): CompanyReadinessResult {
  const strengths: string[] = [];
  const gaps: string[] = [];
  const blockers: string[] = [];

  const documents =
    company.documents ?? [];

  if (documents.length === 0) {
    return {
      score: 0,
      level: "not_ready",
      strengths: [],
      gaps: [
        "No company legal documents have been registered.",
      ],
      blockers: [
        "Company legal evidence register is empty.",
      ],
      recommendation:
        "Add the applicable legal and statutory documents before assessment progression.",
    };
  }

  const total =
    documents.length;

  const verified =
    documents.filter(
      (document) =>
        document.verificationStatus ===
        "verified",
    ).length;

  const valid =
    documents.filter(
      (document) =>
        document.validityStatus ===
        "valid",
    ).length;

  const mandatory =
    documents.filter(
      (document) =>
        document.isMandatory,
    );

  const mandatoryComplete =
    mandatory.filter(
      (document) =>
        document.verificationStatus ===
          "verified" &&
        document.isCurrent,
    ).length;

  const current =
    documents.filter(
      (document) =>
        document.isCurrent,
    ).length;

  const rejected =
    documents.filter(
      (document) =>
        document.verificationStatus ===
        "rejected",
    ).length;

  const expired =
    documents.filter(
      (document) =>
        document.validityStatus ===
        "expired",
    ).length;

  const criticalRisk =
    company.riskLevel ===
    "critical";

  const majorFindings =
    company.findings.filter(
      (finding) =>
        finding.severity ===
          "major" &&
        finding.correctiveActionStatus !==
          "closed",
    ).length;

  const criticalFindings =
    company.findings.filter(
      (finding) =>
        finding.severity ===
          "critical" &&
        finding.correctiveActionStatus !==
          "closed",
    ).length;

  /* =========================================================
     COMPANY IDENTITY
     20%
  ========================================================= */

  const identityFields = [
    company.legalName,
    company.entityType,
    company.panNumber,
    company.registeredAddress,
    company.state,
    company.district,
  ];

  const identityComplete =
    identityFields.filter(
      Boolean,
    ).length;

  const identityScore =
    (identityComplete /
      identityFields.length) *
    20;

  /* =========================================================
     DOCUMENT VERIFICATION
     25%
  ========================================================= */

  const verificationScore =
    (verified / total) * 25;

  /* =========================================================
     VALIDITY
     15%
  ========================================================= */

  const validityScore =
    (valid / total) * 15;

  /* =========================================================
     MANDATORY DOCUMENTS
     25%
  ========================================================= */

  const mandatoryScore =
    mandatory.length === 0
      ? 25
      : (mandatoryComplete /
          mandatory.length) *
        25;

  /* =========================================================
     CURRENT STATUS
     10%
  ========================================================= */

  const currentScore =
    (current / total) * 10;

  /* =========================================================
     RISK / FINDINGS
     5%
  ========================================================= */

  let riskScore = 5;

  if (rejected > 0) {
    riskScore -= Math.min(
      3,
      rejected,
    );
  }

  if (expired > 0) {
    riskScore -= Math.min(
      2,
      expired,
    );
  }

  const score = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        identityScore +
          verificationScore +
          validityScore +
          mandatoryScore +
          currentScore +
          riskScore,
      ),
    ),
  );

  /* =========================================================
     STRENGTHS
  ========================================================= */

  if (
    identityComplete ===
    identityFields.length
  ) {
    strengths.push(
      "Core company legal identity information is complete.",
    );
  }

  if (verified === total) {
    strengths.push(
      "All registered company documents are verified.",
    );
  } else if (
    verified / total >=
    0.75
  ) {
    strengths.push(
      "Most company documents have been verified.",
    );
  }

  if (
    mandatory.length === 0 ||
    mandatoryComplete ===
      mandatory.length
  ) {
    strengths.push(
      "Mandatory company documents are complete and current.",
    );
  }

  if (rejected === 0) {
    strengths.push(
      "No company documents are currently rejected.",
    );
  }

  /* =========================================================
     GAPS
  ========================================================= */

  if (
    identityComplete <
    identityFields.length
  ) {
    gaps.push(
      "Complete the missing company legal identity fields.",
    );
  }

  if (verified < total) {
    gaps.push(
      `${total - verified} company document(s) require verification.`,
    );
  }

  if (valid < total) {
    gaps.push(
      `${total - valid} company document(s) are not currently marked valid.`,
    );
  }

  if (
    mandatory.length > 0 &&
    mandatoryComplete <
      mandatory.length
  ) {
    gaps.push(
      `${mandatory.length - mandatoryComplete} mandatory company document(s) remain incomplete.`,
    );
  }

  if (current < total) {
    gaps.push(
      `${total - current} company document(s) are not marked current.`,
    );
  }

  if (majorFindings > 0) {
    gaps.push(
      `${majorFindings} major company compliance finding(s) remain open.`,
    );
  }

  /* =========================================================
     BLOCKERS
  ========================================================= */

  if (criticalRisk) {
    blockers.push(
      "Company legal profile is classified as critical risk.",
    );
  }

  if (criticalFindings > 0) {
    blockers.push(
      `${criticalFindings} critical company compliance finding(s) remain open.`,
    );
  }

  if (rejected > 0) {
    blockers.push(
      `${rejected} company document(s) have been rejected.`,
    );
  }

  if (expired > 0) {
    blockers.push(
      `${expired} company document(s) are expired.`,
    );
  }

  if (
    mandatory.length > 0 &&
    mandatoryComplete <
      mandatory.length
  ) {
    blockers.push(
      "Mandatory company legal requirements are incomplete.",
    );
  }

  /* =========================================================
     READINESS LEVEL
  ========================================================= */

  let level:
    CompanyReadinessResult["level"];

  if (
    criticalRisk ||
    criticalFindings > 0 ||
    rejected > 0
  ) {
    level = "not_ready";
  } else if (score >= 90) {
    level = "highly_ready";
  } else if (score >= 75) {
    level = "ready";
  } else if (score >= 50) {
    level = "partially_ready";
  } else {
    level = "not_ready";
  }

  /* =========================================================
     RECOMMENDATION
  ========================================================= */

  let recommendation =
    "Complete the remaining company legal compliance requirements.";

  if (level === "highly_ready") {
    recommendation =
      "Company legal compliance readiness is strong and suitable for assessment progression.";
  } else if (level === "ready") {
    recommendation =
      "Company legal documentation is ready for progression with no major blocker.";
  } else if (
    level === "partially_ready"
  ) {
    recommendation =
      "Complete verification, validity and mandatory document gaps before final progression.";
  } else {
    recommendation =
      "Resolve company legal blockers and complete mandatory statutory evidence before progression.";
  }

  return {
    score,
    level,
    strengths: Array.from(
      new Set(strengths),
    ),
    gaps: Array.from(
      new Set(gaps),
    ),
    blockers: Array.from(
      new Set(blockers),
    ),
    recommendation,
  };
}
