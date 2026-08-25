import type {
  FactoryDocument,
  FactoryInfrastructure,
  FactoryProfile,
  FactoryUtility,
} from "./factory.types";

function createDocument(
  factoryId: string,
  documentType: FactoryDocument["documentType"],
  isMandatory = false,
): FactoryDocument {
  return {
    id: `factory-doc-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    factoryId,

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

function createUtility(
  factoryId: string,
  utilityName: string,
): FactoryUtility {
  return {
    id: `factory-utility-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    factoryId,

    utilityName,

    status: "not_available",

    capacity: "",
    source: "",

    verified: false,

    evidenceReference: "",

    remarks: "",
  };
}

function createInfrastructure(
  factoryId: string,
): FactoryInfrastructure {
  return {
    id: `factory-infra-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    factoryId,

    productionArea: "",
    storageArea: "",
    officeArea: "",
    totalBuiltUpArea: "",

    floorCount: "",

    rawMaterialStorage: false,
    finishedGoodsStorage: false,
    qualityInspectionArea: false,
    maintenanceArea: false,

    loadingUnloadingArea: false,
    workerFacilitiesAvailable: false,

    layoutAvailable: false,
    layoutVerified: false,

    utilities: [
      createUtility(
        factoryId,
        "Electricity",
      ),
      createUtility(
        factoryId,
        "Water",
      ),
      createUtility(
        factoryId,
        "Compressed Air",
      ),
      createUtility(
        factoryId,
        "Internet / Communication",
      ),
      createUtility(
        factoryId,
        "Waste Management",
      ),
    ],

    remarks: "",
  };
}

export function createInitialFactory(
  assessmentId: string,
): FactoryProfile {
  const now =
    new Date().toISOString();

  const factoryId =
    `factory-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  return {
    id: factoryId,

    assessmentId,

    factoryName: "",

    ownershipType: "owned",
    premisesStatus: "not_available",

    registeredAddress: "",
    factoryAddress: "",

    state: "",
    district: "",
    pincode: "",

    areaUnit: "sqft",
    totalArea: "",

    manufacturingArea: "",

    operationalSince: "",

    infrastructure:
      createInfrastructure(
        factoryId,
      ),

    documents: [
      createDocument(
        factoryId,
        "layout_plan",
        true,
      ),
      createDocument(
        factoryId,
        "factory_license",
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
