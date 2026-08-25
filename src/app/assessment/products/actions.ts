"use server";

/* ============================================================
   GEMLOTUS AI — PRODUCT ASSESSMENT OS
   Product Server Actions
   ============================================================ */

import type {
  ProductRecord,
} from "./product.types";

export async function saveProductAssessment(
  assessmentId: string,
  products: ProductRecord[],
) {
  if (!assessmentId.trim()) {
    throw new Error(
      "Assessment ID is required.",
    );
  }

  return {
    success: true,
    assessmentId,
    products,
  };
}

export async function saveProduct(
  assessmentId: string,
  product: ProductRecord,
) {
  if (!assessmentId.trim()) {
    throw new Error(
      "Assessment ID is required.",
    );
  }

  return {
    success: true,
    assessmentId,
    product,
  };
}
