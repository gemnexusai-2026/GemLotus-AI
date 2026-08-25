/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Verification Adapter
   ============================================================ */

import type {
  ProductRecord,
  VerificationStatus,
} from "./product.types";

export type ProductVerificationAdapterResult = {
  productId: string;
  productName: string;

  physicalSampleAvailable: boolean;
  physicalSampleVerified: boolean;

  specificationVerified: boolean;
  manufacturingCapabilityVerified: boolean;
  productionProcessVerified: boolean;

  verificationStatus: VerificationStatus;

  verificationPercent: number;

  verifiedBy: string;
  verificationDate: string;
  remarks: string;
};

export function adaptProductVerifications(
  products: ProductRecord[],
): ProductVerificationAdapterResult[] {
  return products.map((product) => {
    const verification = product.verification;

    const checks = [
      verification.physicalSampleVerified,
      verification.specificationVerified,
      verification.manufacturingCapabilityVerified,
      verification.productionProcessVerified,
    ];

    const completedChecks = checks.filter(
      Boolean,
    ).length;

    const verificationPercent = Math.round(
      (completedChecks / checks.length) * 100,
    );

    return {
      productId: product.id,
      productName: product.productName,

      physicalSampleAvailable:
        verification.physicalSampleAvailable,

      physicalSampleVerified:
        verification.physicalSampleVerified,

      specificationVerified:
        verification.specificationVerified,

      manufacturingCapabilityVerified:
        verification.manufacturingCapabilityVerified,

      productionProcessVerified:
        verification.productionProcessVerified,

      verificationStatus:
        verification.verificationStatus,

      verificationPercent,

      verifiedBy: verification.verifiedBy,
      verificationDate:
        verification.verificationDate,
      remarks: verification.remarks,
    };
  });
}

export function getProductVerificationSummary(
  products: ProductRecord[],
) {
  const adapted =
    adaptProductVerifications(products);

  const total = adapted.length;

  const verified = adapted.filter(
    (item) =>
      item.verificationStatus === "verified",
  ).length;

  const pending = adapted.filter(
    (item) =>
      item.verificationStatus === "pending",
  ).length;

  const rejected = adapted.filter(
    (item) =>
      item.verificationStatus === "rejected",
  ).length;

  const needsReview = adapted.filter(
    (item) =>
      item.verificationStatus ===
      "needs_review",
  ).length;

  const averageVerification =
    total === 0
      ? 0
      : Math.round(
          adapted.reduce(
            (sum, item) =>
              sum + item.verificationPercent,
            0,
          ) / total,
        );

  return {
    total,
    verified,
    pending,
    rejected,
    needsReview,
    averageVerification,
  };
}
