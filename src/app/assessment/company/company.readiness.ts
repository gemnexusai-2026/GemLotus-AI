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

  const documents = company.documents ?? [];
  const findings = company.findings ?? [];

  const hasValue = (value: unknown) =>
    typeof value === "string"
      ? value.trim().length > 0
      : Boolean(value);

  const hasEvidence = (
    document: (typeof documents)[number],
  ) =>
    hasValue(document.documentNumber) ||
    hasValue(document.fileName) ||
    hasValue(document.fileReference);

  const acceptableValidity = (
    document: (typeof documents)[number],
  ) =>
    document.validityStatus === "valid" ||
    document.validityStatus === "not_applicable";

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
        "Add applicable legal and statutory documents before assessment progression.",
    };
  }

  /*
   * =========================================================
   * 1. COMPANY IDENTITY — 20
   * =========================================================
   */

  const identityFields = [
    company.legalName,
    company.entityType,
    company.panNumber,
    company.registeredAddress,
    company.state,
    company.district,
  ];

  const identityComplete =
    identityFields.filter(hasValue).length;

  const identityScore =
    (identityComplete / identityFields.length) * 20;

  /*
   * =========================================================
   * 2. LEGAL DOCUMENT EVIDENCE — 30
   *
   * A document earns this component only when there is
   * actual evidence: number, uploaded file or file reference.
   * =========================================================
   */

  const evidenceComplete = documents.filter(
    hasEvidence,
  ).length;

  const evidenceScore =
    (evidenceComplete / documents.length) * 30;

  /*
   * =========================================================
   * 3. VERIFICATION — 20
   * =========================================================
   */

  const verified = documents.filter(
    (document) =>
      document.verificationStatus === "verified",
  ).length;

  const verificationScore =
    (verified / documents.length) * 20;

  /*
   * =========================================================
   * 4. VALIDITY / CURRENT STATUS — 15
   *
   * A document is complete for this component only when
   * validity is acceptable AND document is current.
   * =========================================================
   */

  const currentValid = documents.filter(
    (document) =>
      acceptableValidity(document) &&
      document.isCurrent,
  ).length;

  const currentValidScore =
    (currentValid / documents.length) * 15;

  /*
   * =========================================================
   * 5. MANDATORY COMPLIANCE — 15
   * =========================================================
   */

  const mandatory = documents.filter(
    (document) => document.isMandatory,
  );

  const mandatoryComplete = mandatory.filter(
    (document) =>
      hasEvidence(document) &&
      document.verificationStatus === "verified" &&
      acceptableValidity(document) &&
      document.isCurrent,
  ).length;

  const mandatoryScore =
    mandatory.length === 0
      ? 15
      : (mandatoryComplete / mandatory.length) * 15;

  /*
   * =========================================================
   * FINDINGS / RISK
   *
   * Findings are NOT double-counted as document scores.
   * Observation/minor findings remain gaps.
   * Major/critical findings become blockers.
   * =========================================================
   */

  const openFindings = findings.filter(
    (finding) =>
      finding.correctiveActionStatus !== "closed",
  );

  const observationFindings =
    openFindings.filter(
      (finding) =>
        finding.severity === "observation",
    ).length;

  const minorFindings =
    openFindings.filter(
      (finding) =>
        finding.severity === "minor",
    ).length;

  const majorFindings =
    openFindings.filter(
      (finding) =>
        finding.severity === "major",
    ).length;

  const criticalFindings =
    openFindings.filter(
      (finding) =>
        finding.severity === "critical",
    ).length;

  const rejected = documents.filter(
    (document) =>
      document.verificationStatus === "rejected",
  ).length;

  const expired = documents.filter(
    (document) =>
      document.validityStatus === "expired",
  ).length;

  const criticalRisk =
    company.riskLevel === "critical";

  /*
   * Small quality adjustment.
   *
   * Observation/minor findings reduce quality slightly,
   * while major/critical findings primarily act as blockers.
   */

  const findingPenalty = Math.min(
    5,
    observationFindings * 0.5 +
      minorFindings * 1,
  );

  const rawScore =
    identityScore +
    evidenceScore +
    verificationScore +
    currentValidScore +
    mandatoryScore;

  const score = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        rawScore - findingPenalty,
      ),
    ),
  );

  /*
   * =========================================================
   * STRENGTHS
   * =========================================================
   */

  if (
    identityComplete ===
    identityFields.length
  ) {
    strengths.push(
      "Core company legal identity information is complete.",
    );
  }

  if (
    evidenceComplete ===
    documents.length
  ) {
    strengths.push(
      "All registered company documents contain evidence references.",
    );
  } else if (
    evidenceComplete / documents.length >= 0.75
  ) {
    strengths.push(
      "Most registered company documents contain evidence references.",
    );
  }

  if (
    verified === documents.length
  ) {
    strengths.push(
      "All registered company documents are verified.",
    );
  } else if (
    verified / documents.length >= 0.75
  ) {
    strengths.push(
      "Most registered company documents are verified.",
    );
  }

  if (
    currentValid === documents.length
  ) {
    strengths.push(
      "All registered company documents are valid and current.",
    );
  }

  if (
    mandatory.length === 0 ||
    mandatoryComplete === mandatory.length
  ) {
    strengths.push(
      "All applicable mandatory company documents are complete, verified and current.",
    );
  }

  if (
    rejected === 0 &&
    expired === 0
  ) {
    strengths.push(
      "No rejected or expired company documents are currently recorded.",
    );
  }

  /*
   * =========================================================
   * GAPS
   * =========================================================
   */

  if (
    identityComplete <
    identityFields.length
  ) {
    gaps.push(
      `${identityFields.length - identityComplete} company legal identity field(s) remain incomplete.`,
    );
  }

  if (
    evidenceComplete <
    documents.length
  ) {
    gaps.push(
      `${documents.length - evidenceComplete} company document(s) do not yet contain sufficient evidence reference, uploaded file or document number.`,
    );
  }

  if (
    verified <
    documents.length
  ) {
    gaps.push(
      `${documents.length - verified} company document(s) require verification.`,
    );
  }

  if (
    currentValid <
    documents.length
  ) {
    gaps.push(
      `${documents.length - currentValid} company document(s) are not both valid and current.`,
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

  if (observationFindings > 0) {
    gaps.push(
      `${observationFindings} observation finding(s) remain open.`,
    );
  }

  if (minorFindings > 0) {
    gaps.push(
      `${minorFindings} minor finding(s) remain open.`,
    );
  }

  /*
   * =========================================================
   * BLOCKERS
   * =========================================================
   */

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

  if (majorFindings > 0) {
    blockers.push(
      `${majorFindings} major company compliance finding(s) remain open.`,
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

  /*
   * =========================================================
   * READINESS LEVEL
   * =========================================================
   */

  const hasHardBlocker =
    criticalRisk ||
    criticalFindings > 0 ||
    majorFindings > 0 ||
    rejected > 0 ||
    expired > 0 ||
    (
      mandatory.length > 0 &&
      mandatoryComplete <
        mandatory.length
    );

  let level:
    CompanyReadinessResult["level"];

  if (hasHardBlocker) {
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

  /*
   * =========================================================
   * RECOMMENDATION
   * =========================================================
   */

  let recommendation =
    "Complete the remaining company legal compliance requirements.";

  if (level === "highly_ready") {
    recommendation =
      "Company legal compliance readiness is strong and suitable for assessment progression.";
  } else if (level === "ready") {
    recommendation =
      "Company legal documentation is ready for progression with only minor observations requiring attention.";
  } else if (level === "partially_ready") {
    recommendation =
      "Complete company identity, evidence, verification, validity and mandatory compliance gaps before progression.";
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
