import type {
  ProductRecord,
  ProductReadinessResult,
} from "./product.types";

export function calculateProductReadiness(
  product: ProductRecord,
): ProductReadinessResult {
  let score = 0;

  const strengths: string[] = [];
  const gaps: string[] = [];
  const blockers: string[] = [];

  /* =========================================================
     1. PRODUCT DEFINITION
  ========================================================= */

  const definitionFields = [
    product.productCode,
    product.productName,
    product.productCategory,
    product.description,
    product.brandName,
    product.modelNumber,
  ];

  const definitionComplete =
    definitionFields.filter(
      Boolean,
    ).length;

  const definitionScore =
    Math.round(
      (definitionComplete /
        definitionFields.length) *
        20,
    );

  score += definitionScore;

  if (definitionScore >= 17) {
    strengths.push(
      "Product definition is substantially complete.",
    );
  } else {
    gaps.push(
      "Complete product identification and description.",
    );
  }

  /* =========================================================
     2. SPECIFICATIONS
  ========================================================= */

  if (
    product.specifications.length > 0
  ) {
    const verifiedSpecifications =
      product.specifications.filter(
        (specification) =>
          specification.verificationStatus ===
          "verified",
      ).length;

    const specificationScore =
      Math.round(
        (verifiedSpecifications /
          product.specifications.length) *
          20,
      );

    score += specificationScore;

    if (
      verifiedSpecifications ===
      product.specifications.length
    ) {
      strengths.push(
        "All recorded product specifications are verified.",
      );
    } else {
      gaps.push(
        "Verify remaining product specifications.",
      );
    }
  } else {
    gaps.push(
      "Add and verify product specifications.",
    );
  }

  /* =========================================================
     3. EVIDENCE
  ========================================================= */

  if (product.evidence.length > 0) {
    const verifiedEvidence =
      product.evidence.filter(
        (item) =>
          item.status === "verified",
      ).length;

    const evidenceScore =
      Math.round(
        (verifiedEvidence /
          product.evidence.length) *
          20,
      );

    score += evidenceScore;

    if (
      verifiedEvidence ===
      product.evidence.length
    ) {
      strengths.push(
        "Product evidence is fully verified.",
      );
    } else {
      gaps.push(
        "Complete verification of product evidence.",
      );
    }
  } else {
    gaps.push(
      "Provide supporting product evidence.",
    );
  }

  /* =========================================================
     4. PHYSICAL VERIFICATION
  ========================================================= */

  const verification =
    product.verification;

  let physicalScore = 0;

  if (
    verification.physicalSampleAvailable
  ) {
    physicalScore += 5;

    if (
      verification.physicalSampleVerified
    ) {
      physicalScore += 5;
      strengths.push(
        "Physical product/sample has been verified.",
      );
    } else {
      gaps.push(
        "Complete physical sample verification.",
      );
    }
  } else {
    gaps.push(
      "Make a physical product/sample available for verification.",
    );
  }

  if (
    verification.manufacturingCapabilityVerified
  ) {
    physicalScore += 5;
  } else {
    gaps.push(
      "Verify manufacturing capability for the product.",
    );
  }

  if (
    verification.productionProcessVerified
  ) {
    physicalScore += 5;
  } else {
    gaps.push(
      "Verify the production process.",
    );
  }

  score += physicalScore;

  /* =========================================================
     5. QUALITY & TESTING
  ========================================================= */

  const quality =
    product.qualityTesting;

  let qualityScore = 0;

  if (
    quality.qualityControlAvailable
  ) {
    qualityScore += 5;
  } else {
    gaps.push(
      "Establish or document product quality-control arrangements.",
    );
  }

  if (
    quality.inspectionProcedureAvailable
  ) {
    qualityScore += 5;
  } else {
    gaps.push(
      "Provide the applicable product inspection procedure.",
    );
  }

  if (!quality.testRequired) {
    qualityScore += 10;
  } else if (
    quality.testStatus === "available"
  ) {
    qualityScore += 10;

    strengths.push(
      "Required product testing evidence is available.",
    );
  } else {
    gaps.push(
      "Complete the required product testing evidence.",
    );
  }

  score += qualityScore;

  /* =========================================================
     6. FINDINGS / BLOCKERS
  ========================================================= */

  const openFindings =
    product.findings.filter(
      (finding) =>
        finding.correctiveActionStatus !==
        "closed",
    );

  const criticalFindings =
    openFindings.filter(
      (finding) =>
        finding.severity ===
        "critical",
    );

  const majorFindings =
    openFindings.filter(
      (finding) =>
        finding.severity === "major",
    );

  if (
    criticalFindings.length > 0
  ) {
    blockers.push(
      `${criticalFindings.length} critical product finding(s) remain open.`,
    );
  }

  if (
    majorFindings.length > 0
  ) {
    blockers.push(
      `${majorFindings.length} major product finding(s) remain open.`,
    );
  }

  /* =========================================================
     FINAL SCORE NORMALIZATION
  ========================================================= */

  score = Math.max(
    0,
    Math.min(100, score),
  );

  let level: ProductReadinessResult["level"];

  if (
    criticalFindings.length > 0
  ) {
    level = "not_ready";
  } else if (score >= 85) {
    level = "highly_ready";
  } else if (score >= 70) {
    level = "ready";
  } else if (score >= 45) {
    level = "partially_ready";
  } else {
    level = "not_ready";
  }

  let recommendation =
    "Complete the remaining product assessment requirements.";

  if (level === "highly_ready") {
    recommendation =
      "Product is highly ready for assessment progression.";
  } else if (level === "ready") {
    recommendation =
      "Product is ready with no major readiness gap.";
  } else if (level === "partially_ready") {
    recommendation =
      "Close the identified gaps before final approval.";
  } else {
    recommendation =
      "Resolve the identified blockers and complete missing evidence before progression.";
  }

  return {
    score,
    level,
    strengths,
    gaps: Array.from(
      new Set(gaps),
    ),
    blockers: Array.from(
      new Set(blockers),
    ),
    recommendation,
  };
}

