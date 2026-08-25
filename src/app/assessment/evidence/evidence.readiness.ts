import type {
  EvidenceReadinessResult,
  EvidenceRecord,
} from "./evidence.types";

export function calculateEvidenceReadiness(
  evidence: EvidenceRecord[],
): EvidenceReadinessResult {
  const strengths: string[] = [];
  const gaps: string[] = [];
  const blockers: string[] = [];

  if (evidence.length === 0) {
    return {
      score: 0,
      level: "not_ready",
      strengths: [],
      gaps: [
        "No assessment evidence has been recorded.",
      ],
      blockers: [
        "Evidence register is empty.",
      ],
      recommendation:
        "Add the required assessment evidence before proceeding.",
    };
  }

  const total = evidence.length;

  const verified = evidence.filter(
    (item) =>
      item.verificationStatus ===
      "verified",
  ).length;

  const valid = evidence.filter(
    (item) =>
      item.validityStatus ===
      "valid",
  ).length;

  const mandatory = evidence.filter(
    (item) =>
      item.isMandatory,
  );

  const mandatoryComplete =
    mandatory.filter(
      (item) =>
        item.verificationStatus ===
          "verified" &&
        item.isCurrent,
    ).length;

  const current = evidence.filter(
    (item) =>
      item.isCurrent,
  ).length;

  const highRisk = evidence.filter(
    (item) =>
      item.riskLevel === "high" ||
      item.riskLevel === "critical",
  );

  const criticalRisk = evidence.filter(
    (item) =>
      item.riskLevel === "critical",
  );

  const openFindings =
    evidence.reduce(
      (totalFindings, item) =>
        totalFindings +
        item.findings.filter(
          (finding) =>
            finding.correctiveActionStatus !==
            "closed",
        ).length,
      0,
    );

  /* =========================================================
     SCORE
     30% verification
     20% validity
     20% mandatory completion
     15% current evidence
     15% finding / risk condition
  ========================================================= */

  const verificationScore =
    (verified / total) * 30;

  const validityScore =
    (valid / total) * 20;

  const mandatoryScore =
    mandatory.length === 0
      ? 20
      : (mandatoryComplete /
          mandatory.length) *
        20;

  const currentScore =
    (current / total) * 15;

  let riskScore = 15;

  if (highRisk.length > 0) {
    riskScore -= Math.min(
      10,
      highRisk.length * 2,
    );
  }

  if (openFindings > 0) {
    riskScore -= Math.min(
      5,
      openFindings,
    );
  }

  const score = Math.round(
    Math.max(
      0,
      Math.min(
        100,
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

  if (verified === total) {
    strengths.push(
      "All registered evidence items are verified.",
    );
  } else if (
    verified / total >=
    0.75
  ) {
    strengths.push(
      "Most registered evidence items are verified.",
    );
  }

  if (
    mandatory.length === 0 ||
    mandatoryComplete ===
      mandatory.length
  ) {
    strengths.push(
      "Mandatory evidence requirements are complete.",
    );
  }

  if (current === total) {
    strengths.push(
      "All evidence records are marked current.",
    );
  }

  if (criticalRisk.length === 0) {
    strengths.push(
      "No critical-risk evidence records are present.",
    );
  }

  /* =========================================================
     GAPS
  ========================================================= */

  if (verified < total) {
    gaps.push(
      `${total - verified} evidence item(s) require verification.`,
    );
  }

  if (valid < total) {
    gaps.push(
      `${total - valid} evidence item(s) are not currently marked valid.`,
    );
  }

  if (
    mandatory.length > 0 &&
    mandatoryComplete <
      mandatory.length
  ) {
    gaps.push(
      `${mandatory.length - mandatoryComplete} mandatory evidence item(s) remain incomplete.`,
    );
  }

  if (current < total) {
    gaps.push(
      `${total - current} evidence item(s) are not marked current.`,
    );
  }

  if (openFindings > 0) {
    gaps.push(
      `${openFindings} evidence-related finding(s) remain open.`,
    );
  }

  /* =========================================================
     BLOCKERS
  ========================================================= */

  if (criticalRisk.length > 0) {
    blockers.push(
      `${criticalRisk.length} critical-risk evidence item(s) require attention.`,
    );
  }

  if (
    mandatory.length > 0 &&
    mandatoryComplete <
      mandatory.length
  ) {
    blockers.push(
      "Mandatory evidence requirements are incomplete.",
    );
  }

  const rejected = evidence.filter(
    (item) =>
      item.verificationStatus ===
      "rejected",
  ).length;

  if (rejected > 0) {
    blockers.push(
      `${rejected} evidence item(s) have been rejected.`,
    );
  }

  /* =========================================================
     READINESS LEVEL
  ========================================================= */

  let level:
    EvidenceReadinessResult["level"];

  if (
    criticalRisk.length > 0 ||
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
    "Complete the remaining evidence requirements.";

  if (level === "highly_ready") {
    recommendation =
      "Evidence readiness is strong and suitable for assessment progression.";
  } else if (level === "ready") {
    recommendation =
      "Evidence is ready for progression with no major readiness blocker.";
  } else if (
    level === "partially_ready"
  ) {
    recommendation =
      "Complete verification, validity and mandatory evidence gaps before final progression.";
  } else {
    recommendation =
      "Resolve evidence blockers and complete mandatory evidence requirements before progression.";
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
