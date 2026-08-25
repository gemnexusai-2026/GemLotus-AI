import type { ProductRecord } from "./product.types";

export function createInitialProduct(): ProductRecord {
  const now =
    new Date().toISOString();

  const productId =
    `product-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  return {
    id: productId,

    productCode: "",
    productName: "",
    productCategory: "other",

    brandName: "",
    modelNumber: "",
    sku: "",

    description: "",

    ownershipType: "manufactured",

    manufacturingLocation: "",
    manufacturingProcess: "",

    productStatus: "draft",

    specifications: [],

    evidence: [],

    verification: {
      id: `verification-${productId}`,
      productId,

      physicalSampleAvailable: false,
      physicalSampleVerified: false,

      specificationVerified: false,
      manufacturingCapabilityVerified: false,
      productionProcessVerified: false,

      verificationStatus: "pending",

      verifiedBy: "",
      verificationDate: "",

      remarks: "",
    },

    qualityTesting: {
      id: `quality-${productId}`,
      productId,

      qualityControlAvailable: false,
      inspectionProcedureAvailable: false,

      testRequired: false,
      testStatus: "not_required",

      testName: "",
      testingLaboratory: "",
      reportNumber: "",

      testDate: "",
      expiryDate: "",

      remarks: "",
    },

    findings: [],

    technicalDocumentsAvailable: false,
    catalogAvailable: false,
    productPhotoAvailable: false,

    createdAt: now,
    updatedAt: now,

    remarks: "",
  };
}

