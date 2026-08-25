/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Validation Rules
   ============================================================ */

import type {
  ProductRecord,
  ProductSpecification,
  ProductEvidence,
  ProductVerification,
  ProductQualityTesting,
} from "./product.types";

export type ProductValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

function required(
  value: string,
  label: string,
  errors: string[],
) {
  if (!value.trim()) {
    errors.push(`${label} is required.`);
  }
}

function validateSpecification(
  specification: ProductSpecification,
  index: number,
  errors: string[],
) {
  if (!specification.parameter.trim()) {
    errors.push(
      `Specification #${index + 1}: parameter is required.`,
    );
  }

  if (!specification.declaredValue.trim()) {
    errors.push(
      `Specification #${index + 1}: declared value is required.`,
    );
  }
}

function validateEvidence(
  evidence: ProductEvidence,
  index: number,
  errors: string[],
) {
  if (!evidence.name.trim()) {
    errors.push(
      `Evidence #${index + 1}: evidence name is required.`,
    );
  }

  if (evidence.status === "verified" && !evidence.referenceNumber.trim()) {
    errors.push(
      `Evidence #${index + 1}: verified evidence requires a reference number.`,
    );
  }
}

function validateVerification(
  verification: ProductVerification,
  errors: string[],
) {
  if (
    verification.verificationStatus === "verified" &&
    !verification.verifiedBy.trim()
  ) {
    errors.push(
      "Verified product must have a verifier name.",
    );
  }

  if (
    verification.physicalSampleVerified &&
    !verification.physicalSampleAvailable
  ) {
    errors.push(
      "Physical sample cannot be verified when it is not available.",
    );
  }
}

function validateQualityTesting(
  quality: ProductQualityTesting,
  errors: string[],
) {
  if (quality.testStatus === "available") {
    if (!quality.testName.trim()) {
      errors.push(
        "Available test evidence requires a test name.",
      );
    }

    if (!quality.reportNumber.trim()) {
      errors.push(
        "Available test evidence requires a report number.",
      );
    }
  }
}

export function validateProduct(
  product: ProductRecord,
): ProductValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  required(
    product.productCode,
    "Product code",
    errors,
  );

  required(
    product.productName,
    "Product name",
    errors,
  );

  required(
    product.description,
    "Product description",
    errors,
  );

  required(
    product.manufacturingLocation,
    "Manufacturing location",
    errors,
  );

  if (product.specifications.length === 0) {
    warnings.push(
      "No technical specifications have been recorded.",
    );
  }

  if (product.evidence.length === 0) {
    warnings.push(
      "No product evidence has been recorded.",
    );
  }

  if (!product.productPhotoAvailable) {
    warnings.push(
      "Product photograph is not available.",
    );
  }

  if (!product.catalogAvailable) {
    warnings.push(
      "Product catalog is not available.",
    );
  }

  product.specifications.forEach(
    (specification, index) =>
      validateSpecification(
        specification,
        index,
        errors,
      ),
  );

  product.evidence.forEach(
    (evidence, index) =>
      validateEvidence(
        evidence,
        index,
        errors,
      ),
  );

  validateVerification(
    product.verification,
    errors,
  );

  validateQualityTesting(
    product.qualityTesting,
    errors,
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateProducts(
  products: ProductRecord[],
): ProductValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (products.length === 0) {
    warnings.push(
      "No products have been registered for assessment.",
    );
  }

  products.forEach((product, index) => {
    const result = validateProduct(product);

    result.errors.forEach((error) => {
      errors.push(
        `Product #${index + 1}: ${error}`,
      );
    });

    result.warnings.forEach((warning) => {
      warnings.push(
        `Product #${index + 1}: ${warning}`,
      );
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
