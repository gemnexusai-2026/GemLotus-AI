/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Readiness Engine
   ============================================================ */

import {
  PRODUCT_READINESS_THRESHOLDS,
} from "./product.constants";

import {
  scoreProduct,
} from "./productScoring";

import type {
  ProductRecord,
  ProductReadinessLevel,
  ProductReadinessResult,
} from "./product.types";

function getReadinessLevel(
  score: number,
): ProductReadinessLevel {
  if (
    score >=
    PRODUCT_READINESS_THRESHOLDS.highlyReady
  ) {
    return "highly_ready";
  }

  if (
    score >=
    PRODUCT_READINESS_THRESHOLDS.ready
  ) {
    return "ready";
  }

  if (
    score >=
    PRODUCT_READINESS_THRESHOLDS.partiallyReady
  ) {
    return "partially_ready";
  }

  return "not_ready";
}

function buildStrengths(
  product: ProductRecord,
): string[] {
  const strengths: string[] = [];
  const score = scoreProduct(product);

  if (score.productDefinition >= 80) {
    strengths.push(
      "Product definition is sufficiently documented.",
    );
  }

  if (score.specificationCompliance >= 80) {
    strengths.push(
      "Technical specifications show strong verification coverage.",
    );
  }

  if (score.evidenceReadiness >= 80) {
    strengths.push(
      "Product evidence coverage is strong.",
    );
  }

  if (score.physicalVerification >= 80) {
    strengths.push(
      "Physical and manufacturing verification is substantially complete.",
    );
  }

  if (score.qualityTesting >= 80) {
    strengths.push(
      "Quality and testing controls show good readiness.",
    );
  }

  if (score.manufacturingRelevance >= 80) {
    strengths.push(
      "Product is clearly connected to the declared manufacturing capability.",
    );
  }

  return strengths;
}

function buildGaps(
  product: ProductRecord,
): string[] {
  const gaps: string[] = [];
  const score = scoreProduct(product);

  if (score.productDefinition < 80) {
    gaps.push(
      "Product definition and identification require stronger documentation.",
    );
  }

  if (score.specificationCompliance < 80) {
    gaps.push(
      "Technical specification verification is incomplete.",
    );
  }

  if (score.evidenceReadiness < 80) {
    gaps.push(
      "Product evidence coverage is incomplete.",
    );
  }

  if (score.physicalVerification < 80) {
    gaps.push(
      "Physical/product capability verification requires additional evidence.",
    );
  }

  if (score.qualityTesting < 80) {
    gaps.push(
      "Quality or testing evidence requires strengthening.",
    );
  }

  if (score.manufacturingRelevance < 80) {
    gaps.push(
      "Manufacturing relevance and production linkage require verification.",
    );
  }

  return gaps;
}

function buildBlockers(
  product: ProductRecord,
): string[] {
  const blockers: string[] = [];

  const criticalFindings =
    product.findings.filter(
      (finding) =>
        finding.severity ===
        "critical",
    );

  const majorOpenFindings =
    product.findings.filter(
      (finding) =>
        finding.severity === "major" &&
        finding.correctiveActionStatus !==
          "closed",
    );

  if (criticalFindings.length > 0) {
    blockers.push(
      "Critical product findings remain unresolved.",
    );
  }

  if (majorOpenFindings.length > 0) {
    blockers.push(
      "Major product findings remain open.",
    );
  }

  if (
    !product.verification
      .manufacturingCapabilityVerified
  ) {
    blockers.push(
      "Manufacturing capability for the product is not verified.",
    );
  }

  return blockers;
}

function buildRecommendation(
  score: number,
  level: ProductReadinessLevel,
  blockers: string[],
): string {
  if (blockers.length > 0) {
    return "Resolve the identified decision blockers and complete supporting evidence before product approval.";
  }

  if (level === "highly_ready") {
    return "Product demonstrates strong assessment readiness and may proceed subject to final assessor approval.";
  }

  if (level === "ready") {
    return "Product is substantially ready. Close remaining evidence and verification gaps before final approval.";
  }

  if (level === "partially_ready") {
    return "Product requires additional evidence, verification and documentation before it can be considered fully ready.";
  }

  return "Product is not currently ready for approval. Complete the required definition, evidence, verification and quality controls.";
}

export function assessProductReadiness(
  product: ProductRecord,
): ProductReadinessResult {
  const score =
    scoreProduct(product).overallScore;

  const level =
    getReadinessLevel(score);

  const strengths =
    buildStrengths(product);

  const gaps =
    buildGaps(product);

  const blockers =
    buildBlockers(product);

  const recommendation =
    buildRecommendation(
      score,
      level,
      blockers,
    );

  return {
    score,
    level,
    strengths,
    gaps,
    blockers,
    recommendation,
  };
}

export function assessProductsReadiness(
  products: ProductRecord[],
) {
  return products.map((product) => ({
    productId: product.id,
    productName: product.productName,
    readiness:
      assessProductReadiness(product),
  }));
}

export function calculateAverageProductReadiness(
  products: ProductRecord[],
): number {
  if (products.length === 0) {
    return 0;
  }

  const total = products.reduce(
    (sum, product) =>
      sum +
      assessProductReadiness(product)
        .score,
    0,
  );

  return Math.round(
    total / products.length,
  );
}
