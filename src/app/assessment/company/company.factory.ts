import type {
  CompanyDocument,
  CompanyLegalProfile,
} from "./company.types";

function createDocument(
  companyId: string,
  documentType: CompanyDocument["documentType"],
  isMandatory = false,
): CompanyDocument {
  return {
    id: `company-doc-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    companyId,

    documentType,
    documentName: "",
    documentNumber: "",

    issuingAuthority: "",

    issueDate: "",
    expiryDate: "",

    validityStatus: "unknown",
    verificationStatus: "pending",

    fileName: "",
    fileReference: "",

    isMandatory,
    isCurrent: false,

    verifiedBy: "",
    verificationDate: "",

    remarks: "",
  };
}

export function createInitialCompany(
  assessmentId: string,
): CompanyLegalProfile {
  const now =
    new Date().toISOString();

  const companyId =
    `company-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  return {
    id: companyId,
    assessmentId,

    legalName: "",
    tradeName: "",

    entityType: "proprietorship",

    panNumber: "",
    gstNumber: "",
    udyamNumber: "",

    incorporationNumber: "",

    registeredAddress: "",
    factoryAddress: "",

    state: "",
    district: "",
    pincode: "",

    yearOfEstablishment: "",

    legalStatus: "not_available",

    documents: [
      createDocument(
        companyId,
        "pan",
        true,
      ),
      createDocument(
        companyId,
        "gst",
        true,
      ),
      createDocument(
        companyId,
        "udyam",
        true,
      ),
    ],

    findings: [],

    verificationStatus: "pending",

    riskLevel: "medium",

    createdAt: now,
    updatedAt: now,

    remarks: "",
  };
}
