import type {
  EvidenceComplianceResult,
  EvidenceRecord,
} from "./evidence.types";

export function evaluateEvidenceCompliance(
  evidence: EvidenceRecord[],
): EvidenceComplianceResult {
  const reasons: string[] = [];
  const blockers: string[] = [];
  const requiredActions: string[] = [];

  if (evidence.length === 0) {
    return {
      decision: "hold",
      canProceed: false,
      reasons: [
        "No evidence has been registered.",
      ],
      blockers: [
        "Evidence register is empty.",
      ],
      requiredActions: [
        "Add and classify the required assessment evidence.",
      ],
    };
  }

  const rejected = evidence.filter(
    (item) =>
      item.verificationStatus ===
      "rejected",
  );

  const pending = evidence.filter(
    (item) =>
      item.verificationStatus ===
      "pending" ||
      item.verificationStatus ===
      "needs_review",
  );

  const mandatory = evidence.filter(
    (item) =>
      item.isMandatory,
  );

  const incompleteMandatory =
    mandatory.filter(
      (item) =>
        item.verificationStatus !==
          "verified" ||
        !item.isCurrent,
    );

  const criticalRisk = evidence.filter(
    (item) =>
      item.riskLevel === "critical",
  );

  const highRisk = evidence.filter(
    (item) =>
      item.riskLevel === "high",
  );

  const expired = evidence.filter(
    (item) =>
      item.validityStatus ===
      "expired",
  );

  const openFindings =
    evidence.reduce(
      (count, item) =>
        count +
        item.findings.filter(
          (finding) =>
            finding.correctiveActionStatus !==
            "closed",
        ).length,
      0,
    );

  /* =========================================================
     CRITICAL BLOCKERS
  ========================================================= */

  if (criticalRisk.length > 0) {
    blockers.push(
      `${criticalRisk.length} critical-risk evidence item(s) require resolution.`,
    );
  }

  if (rejected.length > 0) {
    blockers.push(
      `${rejected.length} evidence item(s) have been rejected.`,
    );
  }

  if (
    incompleteMandatory.length > 0
  ) {
    blockers.push(
      `${incompleteMandatory.length} mandatory evidence item(s) are incomplete or not current.`,
    );
  }

  /* =========================================================
     REQUIRED ACTIONS
  ========================================================= */

  if (pending.length > 0) {
    requiredActions.push(
      `${pending.length} evidence item(s) require verification or review.`,
    );
  }

  if (expired.length > 0) {
    requiredActions.push(
      `${expired.length} expired evidence item(s) require renewal or replacement.`,
    );
  }

  if (highRisk.length > 0) {
    requiredActions.push(
      `${highRisk.length} high-risk evidence item(s) require additional review.`,
    );
  }

  if (openFindings > 0) {
    requiredActions.push(
      `${openFindings} open evidence finding(s) require corrective action.`,
    );
  }

  /* =========================================================
     REASONS
  ========================================================= */

  if (
    rejected.length === 0
  ) {
    reasons.push(
      "No rejected evidence records are present.",
    );
  }

  if (
    incompleteMandatory.length === 0
  ) {
    reasons.push(
      "All mandatory evidence requirements are complete and current.",
    );
  }

  if (
    criticalRisk.length === 0
  ) {
    reasons.push(
      "No critical-risk evidence records are present.",
    );
  }

  if (
    pending.length === 0
  ) {
    reasons.push(
      "All registered evidence items have completed verification status.",
    );
  }

  /* =========================================================
     DECISION
  ========================================================= */

  let decision:
    EvidenceComplianceResult["decision"];

  let canProceed = true;

  if (
    criticalRisk.length > 0 ||
    rejected.length > 0
  ) {
    decision = "rejected";
    canProceed = false;
  } else if (
    incompleteMandatory.length > 0
  ) {
    decision = "hold";
    canProceed = false;
  } else if (
    pending.length > 0 ||
    expired.length > 0 ||
    highRisk.length > 0 ||
    openFindings > 0
  ) {
    decision =
      "conditionally_approved";
    canProceed = true;
  } else {
    decision = "approved";
    canProceed = true;
  }

  return {
    decision,
    canProceed,
    reasons,
    blockers,
    requiredActions,
  };
}
