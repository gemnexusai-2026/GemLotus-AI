/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Compliance Decision Engine
   ============================================================ */

import {
  assessProductReadiness,
} from "./productReadiness";

import type {
  ProductComplianceResult,
  ProductDecision,
  ProductRecord,
} from "./product.types";

export function evaluateProductCompliance(
  product: ProductRecord,
): ProductComplianceResult {
  const readiness =
    assessProductReadiness(product);

  const reasons: string[] = [];
  const blockers: string[] = [];
  const requiredActions: string[] = [];

  const criticalFindings =
    product.findings.filter(
      (finding) =>
        finding.severity === "critical" &&
        finding.correctiveActionStatus !==
          "closed",
    );

  const majorFindings =
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

  if (majorFindings.length > 0) {
    blockers.push(
      "Major product findings remain unresolved.",
    );
  }

  if (
    !product.verification
      .manufacturingCapabilityVerified
  ) {
    blockers.push(
      "Manufacturing capability for this product has not been verified.",
    );
  }

  if (
    !product.verification
      .specificationVerified
  ) {
    requiredActions.push(
      "Complete technical specification verification.",
    );
  }

  if (
    !product.productPhotoAvailable
  ) {
    requiredActions.push(
      "Provide product photographic evidence.",
    );
  }

  if (
    !product.catalogAvailable
  ) {
    requiredActions.push(
      "Provide the product catalog or equivalent product documentation.",
    );
  }

  if (
    product.specifications.length === 0
  ) {
    requiredActions.push(
      "Record and verify product technical specifications.",
    );
  }

  if (
    product.evidence.length === 0
  ) {
    requiredActions.push(
      "Upload supporting product evidence.",
    );
  }

  if (blockers.length > 0) {
    reasons.push(
      "Approval cannot proceed while decision blockers remain unresolved.",
    );

    return {
      decision: "rejected",
      canProceed: false,
      reasons,
      blockers,
      requiredActions,
    };
  }

  if (readiness.score >= 85) {
    reasons.push(
      "Product demonstrates high assessment readiness.",
    );

    return {
      decision: "approved",
      canProceed: true,
      reasons,
      blockers,
      requiredActions,
    };
  }

  if (readiness.score >= 70) {
    reasons.push(
      "Product is substantially ready but should complete remaining actions before final approval.",
    );

    return {
      decision: "conditionally_approved",
      canProceed: true,
      reasons,
      blockers,
      requiredActions,
    };
  }

  if (readiness.score >= 50) {
    reasons.push(
      "Product has partial readiness but requires additional evidence and verification.",
    );

    return {
      decision: "hold",
      canProceed: false,
      reasons,
      blockers,
      requiredActions,
    };
  }

  reasons.push(
    "Product readiness is below the minimum assessment threshold.",
  );

  return {
    decision: "rejected",
    canProceed: false,
    reasons,
    blockers,
    requiredActions,
  };
}

export function evaluateProductsCompliance(
  products: ProductRecord[],
) {
  return products.map((product) => ({
    productId: product.id,
    productName: product.productName,
    compliance:
      evaluateProductCompliance(product),
  }));
}

export function getProductDecisionLabel(
  decision: ProductDecision,
): string {
  switch (decision) {
    case "approved":
      return "Approved";

    case "conditionally_approved":
      return "Conditionally Approved";

    case "hold":
      return "On Hold";

    case "rejected":
      return "Rejected";

    default:
      return "Pending Decision";
  }
}
