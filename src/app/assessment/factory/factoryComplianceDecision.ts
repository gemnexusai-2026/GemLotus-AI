import type {
  FactoryComplianceResult,
  FactoryProfile,
} from "./factory.types";

export function evaluateFactoryCompliance(
  factory: FactoryProfile,
): FactoryComplianceResult {
  const reasons: string[] = [];
  const blockers: string[] = [];
  const requiredActions: string[] = [];

  const documents =
    factory.documents ?? [];

  const utilities =
    factory.infrastructure?.utilities ?? [];

  const mandatoryDocuments =
    documents.filter(
      (document) =>
        document.isMandatory,
    );

  const mandatoryIncomplete =
    mandatoryDocuments.filter(
      (document) =>
        document.verificationStatus !==
          "verified" ||
        !document.isCurrent,
    );

  const rejectedDocuments =
    documents.filter(
      (document) =>
        document.verificationStatus ===
        "rejected",
    );

  const expiredDocuments =
    documents.filter(
      (document) =>
        document.validityStatus ===
        "expired",
    );

  const criticalFindings =
    factory.findings.filter(
      (finding) =>
        finding.severity ===
          "critical" &&
        finding.correctiveActionStatus !==
          "closed",
    );

  const majorFindings =
    factory.findings.filter(
      (finding) =>
        finding.severity ===
          "major" &&
        finding.correctiveActionStatus !==
          "closed",
    );

  const unavailableUtilities =
    utilities.filter(
      (utility) =>
        utility.status ===
        "not_available",
    );

  /* =========================================================
     BLOCKERS
  ========================================================= */

  if (
    !factory.factoryName.trim()
  ) {
    blockers.push(
      "Factory name is missing.",
    );
  }

  if (
    !factory.factoryAddress.trim()
  ) {
    blockers.push(
      "Factory address is missing.",
    );
  }

  if (
    factory.premisesStatus ===
    "not_available"
  ) {
    blockers.push(
      "Factory premises availability has not been established.",
    );
  }

  if (
    factory.premisesStatus ===
    "non_operational"
  ) {
    blockers.push(
      "Factory premises are marked non-operational.",
    );
  }

  if (
    mandatoryIncomplete.length >
    0
  ) {
    blockers.push(
      `${mandatoryIncomplete.length} mandatory factory document(s) are incomplete or not current.`,
    );
  }

  if (
    rejectedDocuments.length >
    0
  ) {
    blockers.push(
      `${rejectedDocuments.length} factory document(s) are rejected.`,
    );
  }

  if (
    expiredDocuments.length >
    0
  ) {
    blockers.push(
      `${expiredDocuments.length} factory document(s) are expired.`,
    );
  }

  if (
    criticalFindings.length >
    0
  ) {
    blockers.push(
      `${criticalFindings.length} critical factory finding(s) remain open.`,
    );
  }

  if (
    factory.riskLevel ===
    "critical"
  ) {
    blockers.push(
      "Factory infrastructure risk is classified as critical.",
    );
  }

  /* =========================================================
     REASONS
  ========================================================= */

  if (
    factory.factoryName.trim()
  ) {
    reasons.push(
      "Factory identity is available.",
    );
  }

  if (
    factory.factoryAddress.trim()
  ) {
    reasons.push(
      "Factory premises address is available.",
    );
  }

  if (
    factory.premisesStatus ===
    "operational"
  ) {
    reasons.push(
      "Factory premises are marked operational.",
    );
  }

  if (
    mandatoryDocuments.length >
      0 &&
    mandatoryIncomplete.length ===
      0
  ) {
    reasons.push(
      "All mandatory factory documents are verified and current.",
    );
  }

  if (
    rejectedDocuments.length ===
    0
  ) {
    reasons.push(
      "No factory documents are currently rejected.",
    );
  }

  if (
    expiredDocuments.length ===
    0
  ) {
    reasons.push(
      "No registered factory documents are expired.",
    );
  }

  if (
    criticalFindings.length ===
    0
  ) {
    reasons.push(
      "No open critical factory findings exist.",
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
      "Complete and verify all mandatory factory documents.",
    );
  }

  if (
    rejectedDocuments.length >
    0
  ) {
    requiredActions.push(
      "Replace or correct rejected factory documents and submit them for verification.",
    );
  }

  if (
    expiredDocuments.length >
    0
  ) {
    requiredActions.push(
      "Renew expired factory documents and update their validity evidence.",
    );
  }

  if (
    factory.infrastructure
      .layoutAvailable ===
      false ||
    factory.infrastructure
      .layoutVerified ===
      false
  ) {
    requiredActions.push(
      "Provide and verify the factory layout / floor plan.",
    );
  }

  if (
    unavailableUtilities.length >
    0
  ) {
    requiredActions.push(
      "Establish and verify required factory utilities.",
    );
  }

  if (
    majorFindings.length >
    0
  ) {
    requiredActions.push(
      "Close all open major factory compliance findings.",
    );
  }

  if (
    !factory.totalArea.trim()
  ) {
    requiredActions.push(
      "Record the total factory premises area.",
    );
  }

  if (
    !factory.manufacturingArea.trim()
  ) {
    requiredActions.push(
      "Record the manufacturing / production area.",
    );
  }

  /* =========================================================
     DECISION
  ========================================================= */

  const hasCriticalBlocker =
    factory.riskLevel ===
      "critical" ||
    criticalFindings.length >
      0 ||
    rejectedDocuments.length >
      0 ||
    expiredDocuments.length >
      0 ||
    factory.premisesStatus ===
      "non_operational";

  let decision:
    FactoryComplianceResult["decision"];

  let canProceed = false;

  if (
    blockers.length === 0
  ) {
    decision = "approved";
    canProceed = true;
  } else if (
    hasCriticalBlocker
  ) {
    decision = "rejected";
    canProceed = false;
  } else if (
    mandatoryIncomplete.length >
      0 ||
    factory.premisesStatus ===
      "not_available"
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
