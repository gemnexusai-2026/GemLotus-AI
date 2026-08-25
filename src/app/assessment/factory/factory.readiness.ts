import type {
  FactoryProfile,
  FactoryReadinessResult,
} from "./factory.types";

export function calculateFactoryReadiness(
  factory: FactoryProfile,
): FactoryReadinessResult {
  const strengths: string[] = [];
  const gaps: string[] = [];
  const blockers: string[] = [];

  const documents =
    factory.documents ?? [];

  const utilities =
    factory.infrastructure?.utilities ?? [];

  const totalDocuments =
    documents.length;

  const verifiedDocuments =
    documents.filter(
      (document) =>
        document.verificationStatus ===
        "verified",
    ).length;

  const validDocuments =
    documents.filter(
      (document) =>
        document.validityStatus ===
        "valid",
    ).length;

  const mandatoryDocuments =
    documents.filter(
      (document) =>
        document.isMandatory,
    );

  const mandatoryComplete =
    mandatoryDocuments.filter(
      (document) =>
        document.verificationStatus ===
          "verified" &&
        document.isCurrent,
    ).length;

  const rejectedDocuments =
    documents.filter(
      (document) =>
        document.verificationStatus ===
        "rejected",
    ).length;

  const expiredDocuments =
    documents.filter(
      (document) =>
        document.validityStatus ===
        "expired",
    ).length;

  const verifiedUtilities =
    utilities.filter(
      (utility) =>
        utility.verified &&
        utility.status ===
          "available",
    ).length;

  const totalUtilities =
    utilities.length;

  const infrastructureChecks = [
    factory.infrastructure
      .rawMaterialStorage,

    factory.infrastructure
      .finishedGoodsStorage,

    factory.infrastructure
      .qualityInspectionArea,

    factory.infrastructure
      .maintenanceArea,

    factory.infrastructure
      .loadingUnloadingArea,

    factory.infrastructure
      .workerFacilitiesAvailable,

    factory.infrastructure
      .layoutAvailable,

    factory.infrastructure
      .layoutVerified,
  ];

  const completedInfrastructureChecks =
    infrastructureChecks.filter(
      Boolean,
    ).length;

  const totalInfrastructureChecks =
    infrastructureChecks.length;

  const criticalFindings =
    factory.findings.filter(
      (finding) =>
        finding.severity ===
          "critical" &&
        finding.correctiveActionStatus !==
          "closed",
    ).length;

  const majorFindings =
    factory.findings.filter(
      (finding) =>
        finding.severity ===
          "major" &&
        finding.correctiveActionStatus !==
          "closed",
    ).length;

  /* =========================================================
     1. PREMISES & IDENTITY — 20%
  ========================================================= */

  const premisesFields = [
    factory.factoryName,
    factory.factoryAddress,
    factory.state,
    factory.district,
    factory.pincode,
    factory.totalArea,
    factory.manufacturingArea,
  ];

  const premisesComplete =
    premisesFields.filter(
      Boolean,
    ).length;

  const premisesScore =
    (premisesComplete /
      premisesFields.length) *
    20;

  /* =========================================================
     2. DOCUMENT READINESS — 25%
  ========================================================= */

  const documentScore =
    totalDocuments === 0
      ? 0
      : (verifiedDocuments /
          totalDocuments) *
        15;

  const validityScore =
    totalDocuments === 0
      ? 0
      : (validDocuments /
          totalDocuments) *
        10;

  /* =========================================================
     3. MANDATORY DOCUMENTS — 15%
  ========================================================= */

  const mandatoryScore =
    mandatoryDocuments.length ===
    0
      ? 15
      : (mandatoryComplete /
          mandatoryDocuments.length) *
        15;

  /* =========================================================
     4. INFRASTRUCTURE — 20%
  ========================================================= */

  const infrastructureScore =
    totalInfrastructureChecks ===
    0
      ? 0
      : (completedInfrastructureChecks /
          totalInfrastructureChecks) *
        20;

  /* =========================================================
     5. UTILITIES — 10%
  ========================================================= */

  const utilityScore =
    totalUtilities === 0
      ? 0
      : (verifiedUtilities /
          totalUtilities) *
        10;

  /* =========================================================
     6. OPERATIONAL STATUS / RISK — 10%
  ========================================================= */

  let operationalScore = 10;

  if (
    factory.premisesStatus !==
    "operational"
  ) {
    operationalScore -= 5;
  }

  if (
    factory.riskLevel ===
    "high"
  ) {
    operationalScore -= 3;
  }

  if (
    factory.riskLevel ===
    "critical"
  ) {
    operationalScore -= 5;
  }

  if (rejectedDocuments > 0) {
    operationalScore -= Math.min(
      2,
      rejectedDocuments,
    );
  }

  if (expiredDocuments > 0) {
    operationalScore -= Math.min(
      2,
      expiredDocuments,
    );
  }

  const score = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        premisesScore +
          documentScore +
          validityScore +
          mandatoryScore +
          infrastructureScore +
          utilityScore +
          operationalScore,
      ),
    ),
  );

  /* =========================================================
     STRENGTHS
  ========================================================= */

  if (
    factory.premisesStatus ===
    "operational"
  ) {
    strengths.push(
      "Factory premises are marked operational.",
    );
  }

  if (
    premisesComplete ===
    premisesFields.length
  ) {
    strengths.push(
      "Core factory premises information is complete.",
    );
  }

  if (
    totalDocuments > 0 &&
    verifiedDocuments ===
      totalDocuments
  ) {
    strengths.push(
      "All registered factory documents are verified.",
    );
  }

  if (
    mandatoryDocuments.length ===
      0 ||
    mandatoryComplete ===
      mandatoryDocuments.length
  ) {
    strengths.push(
      "Mandatory factory documents are complete and current.",
    );
  }

  if (
    totalInfrastructureChecks >
      0 &&
    completedInfrastructureChecks ===
      totalInfrastructureChecks
  ) {
    strengths.push(
      "Factory infrastructure checks are complete.",
    );
  }

  if (
    totalUtilities > 0 &&
    verifiedUtilities ===
      totalUtilities
  ) {
    strengths.push(
      "All registered utilities are available and verified.",
    );
  }

  /* =========================================================
     GAPS
  ========================================================= */

  if (
    premisesComplete <
    premisesFields.length
  ) {
    gaps.push(
      "Complete the missing factory premises and location information.",
    );
  }

  if (
    totalDocuments === 0
  ) {
    gaps.push(
      "No factory infrastructure documents have been registered.",
    );
  } else if (
    verifiedDocuments <
    totalDocuments
  ) {
    gaps.push(
      `${totalDocuments - verifiedDocuments} factory document(s) require verification.`,
    );
  }

  if (
    validDocuments <
    totalDocuments
  ) {
    gaps.push(
      `${totalDocuments - validDocuments} factory document(s) are not currently marked valid.`,
    );
  }

  if (
    mandatoryDocuments.length >
      0 &&
    mandatoryComplete <
      mandatoryDocuments.length
  ) {
    gaps.push(
      `${mandatoryDocuments.length - mandatoryComplete} mandatory factory document(s) remain incomplete.`,
    );
  }

  if (
    completedInfrastructureChecks <
    totalInfrastructureChecks
  ) {
    gaps.push(
      `${totalInfrastructureChecks - completedInfrastructureChecks} infrastructure check(s) remain incomplete.`,
    );
  }

  if (
    verifiedUtilities <
    totalUtilities
  ) {
    gaps.push(
      `${totalUtilities - verifiedUtilities} utility item(s) require verification.`,
    );
  }

  if (
    majorFindings > 0
  ) {
    gaps.push(
      `${majorFindings} major factory compliance finding(s) remain open.`,
    );
  }

  /* =========================================================
     BLOCKERS
  ========================================================= */

  if (
    factory.premisesStatus ===
    "non_operational"
  ) {
    blockers.push(
      "Factory premises are currently marked non-operational.",
    );
  }

  if (
    factory.premisesStatus ===
    "not_available"
  ) {
    blockers.push(
      "Factory operational status has not been established.",
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

  if (
    criticalFindings > 0
  ) {
    blockers.push(
      `${criticalFindings} critical factory finding(s) remain open.`,
    );
  }

  if (
    rejectedDocuments > 0
  ) {
    blockers.push(
      `${rejectedDocuments} factory document(s) have been rejected.`,
    );
  }

  if (
    expiredDocuments > 0
  ) {
    blockers.push(
      `${expiredDocuments} factory document(s) are expired.`,
    );
  }

  if (
    mandatoryDocuments.length >
      0 &&
    mandatoryComplete <
      mandatoryDocuments.length
  ) {
    blockers.push(
      "Mandatory factory infrastructure evidence is incomplete.",
    );
  }

  /* =========================================================
     READINESS LEVEL
  ========================================================= */

  let level:
    FactoryReadinessResult["level"];

  if (
    factory.riskLevel ===
      "critical" ||
    criticalFindings > 0 ||
    rejectedDocuments > 0
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
    "Complete factory premises, infrastructure and statutory evidence before progression.";

  if (
    level ===
    "highly_ready"
  ) {
    recommendation =
      "Factory infrastructure readiness is strong and suitable for assessment progression.";
  } else if (
    level === "ready"
  ) {
    recommendation =
      "Factory infrastructure is substantially ready with no major blocker.";
  } else if (
    level ===
    "partially_ready"
  ) {
    recommendation =
      "Complete outstanding infrastructure, utility and document verification gaps before final progression.";
  } else {
    recommendation =
      "Resolve factory infrastructure blockers and establish complete premises evidence before progression.";
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
