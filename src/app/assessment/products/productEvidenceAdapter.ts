/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Evidence Adapter
   ============================================================ */

import type {
  ProductEvidence,
  ProductRecord,
} from "./product.types";

export type ProductEvidenceAdapterResult = {
  productId: string;
  productName: string;

  total: number;
  verified: number;
  uploaded: number;
  partial: number;
  missing: number;
  rejected: number;

  completionPercent: number;

  evidence: ProductEvidence[];
};

export function adaptProductEvidence(
  products: ProductRecord[],
): ProductEvidenceAdapterResult[] {
  return products.map((product) => {
    const evidence = product.evidence ?? [];

    const total = evidence.length;

    const verified = evidence.filter(
      (item) => item.status === "verified",
    ).length;

    const uploaded = evidence.filter(
      (item) => item.status === "uploaded",
    ).length;

    const partial = evidence.filter(
      (item) => item.status === "partial",
    ).length;

    const missing = evidence.filter(
      (item) => item.status === "missing",
    ).length;

    const rejected = evidence.filter(
      (item) => item.status === "rejected",
    ).length;

    const completionPercent =
      total === 0
        ? 0
        : Math.round(
            ((verified + uploaded) / total) * 100,
          );

    return {
      productId: product.id,
      productName: product.productName,

      total,
      verified,
      uploaded,
      partial,
      missing,
      rejected,

      completionPercent,

      evidence,
    };
  });
}

export function getProductEvidenceSummary(
  products: ProductRecord[],
) {
  const adapted = adaptProductEvidence(products);

  return {
    totalEvidence: adapted.reduce(
      (sum, item) => sum + item.total,
      0,
    ),

    verifiedEvidence: adapted.reduce(
      (sum, item) => sum + item.verified,
      0,
    ),

    uploadedEvidence: adapted.reduce(
      (sum, item) => sum + item.uploaded,
      0,
    ),

    partialEvidence: adapted.reduce(
      (sum, item) => sum + item.partial,
      0,
    ),

    missingEvidence: adapted.reduce(
      (sum, item) => sum + item.missing,
      0,
    ),

    rejectedEvidence: adapted.reduce(
      (sum, item) => sum + item.rejected,
      0,
    ),
  };
}
