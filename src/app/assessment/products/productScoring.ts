/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Scoring Engine
   ============================================================ */

import {
  PRODUCT_SCORE_WEIGHTS,
} from "./product.constants";

import type {
  ProductRecord,
  ProductScoreBreakdown,
} from "./product.types";

function percentage(
  completed: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round(
    Math.min(
      100,
      Math.max(
        0,
        (completed / total) * 100,
      ),
    ),
  );
}

function scoreProductDefinition(
  product: ProductRecord,
): number {
  let completed = 0;
  let total = 5;

  if (product.productCode.trim()) {
    completed++;
  }

  if (product.productName.trim()) {
    completed++;
  }

  if (product.description.trim()) {
    completed++;
  }

  if (product.brandName.trim()) {
    completed++;
  }

  if (product.modelNumber.trim()) {
    completed++;
  }

  return percentage(
    completed,
    total,
  );
}

function scoreSpecificationCompliance(
  product: ProductRecord,
): number {
  const specifications =
    product.specifications ?? [];

  if (specifications.length === 0) {
    return 0;
  }

  const verified =
    specifications.filter(
      (item) =>
        item.verificationStatus ===
        "verified",
    ).length;

  return percentage(
    verified,
    specifications.length,
  );
}

function scoreEvidenceReadiness(
  product: ProductRecord,
): number {
  const evidence =
    product.evidence ?? [];

  let completed = 0;
  const requiredEvidence = [
    product.productPhotoAvailable,
    product.catalogAvailable,
    product.technicalDocumentsAvailable,
    evidence.some(
      (item) =>
        item.status === "verified",
    ),
  ];

  completed =
    requiredEvidence.filter(
      Boolean,
    ).length;

  return percentage(
    completed,
    requiredEvidence.length,
  );
}

function scorePhysicalVerification(
  product: ProductRecord,
): number {
  const verification =
    product.verification;

  const checks = [
    verification.physicalSampleAvailable,
    verification.physicalSampleVerified,
    verification.specificationVerified,
    verification.manufacturingCapabilityVerified,
  ];

  return percentage(
    checks.filter(Boolean).length,
    checks.length,
  );
}

function scoreQualityTesting(
  product: ProductRecord,
): number {
  const quality =
    product.qualityTesting;

  if (!quality.qualityControlAvailable) {
    return 0;
  }

  let completed = 1;
  let total = 2;

  if (
    quality.inspectionProcedureAvailable
  ) {
    completed++;
  }

  if (quality.testRequired) {
    total++;

    if (
      quality.testStatus ===
      "available"
    ) {
      completed++;
    }
  }

  return percentage(
    completed,
    total,
  );
}

function scoreManufacturingRelevance(
  product: ProductRecord,
): number {
  let completed = 0;
  const checks = [
    product.manufacturingLocation.trim(),
    product.manufacturingProcess.trim(),
    product.ownershipType,
  ];

  checks.forEach((value) => {
    if (String(value).trim()) {
      completed++;
    }
  });

  return percentage(
    completed,
    checks.length,
  );
}

export function scoreProduct(
  product: ProductRecord,
): ProductScoreBreakdown {
  const productDefinition =
    scoreProductDefinition(product);

  const specificationCompliance =
    scoreSpecificationCompliance(
      product,
    );

  const evidenceReadiness =
    scoreEvidenceReadiness(
      product,
    );

  const physicalVerification =
    scorePhysicalVerification(
      product,
    );

  const qualityTesting =
    scoreQualityTesting(
      product,
    );

  const manufacturingRelevance =
    scoreManufacturingRelevance(
      product,
    );

  const overallScore = Math.round(
    (
      productDefinition *
        PRODUCT_SCORE_WEIGHTS
          .productDefinition +
      specificationCompliance *
        PRODUCT_SCORE_WEIGHTS
          .specificationCompliance +
      evidenceReadiness *
        PRODUCT_SCORE_WEIGHTS
          .evidenceReadiness +
      physicalVerification *
        PRODUCT_SCORE_WEIGHTS
          .physicalVerification +
      qualityTesting *
        PRODUCT_SCORE_WEIGHTS
          .qualityTesting +
      manufacturingRelevance *
        PRODUCT_SCORE_WEIGHTS
          .manufacturingRelevance
    ) / 100,
  );

  return {
    productDefinition,
    specificationCompliance,
    evidenceReadiness,
    physicalVerification,
    qualityTesting,
    manufacturingRelevance,
    overallScore,
  };
}

export function scoreProducts(
  products: ProductRecord[],
) {
  return products.map((product) => ({
    productId: product.id,
    productName: product.productName,
    score: scoreProduct(product),
  }));
}

export function calculateAverageProductScore(
  products: ProductRecord[],
): number {
  if (products.length === 0) {
    return 0;
  }

  const total = products.reduce(
    (sum, product) =>
      sum +
      scoreProduct(product)
        .overallScore,
    0,
  );

  return Math.round(
    total / products.length,
  );
}
