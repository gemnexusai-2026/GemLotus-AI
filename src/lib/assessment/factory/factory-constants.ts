import type {
    FactorySectionCode,
  } from "@/types/assessment/factory";
  
  export interface FactorySectionDefinition {
    code: FactorySectionCode;
    number: string;
    title: string;
    description: string;
  }
  
  export const FACTORY_SECTIONS:
    FactorySectionDefinition[] = [
      {
        code: "identity",
        number: "01",
        title: "Factory Identity",
        description:
          "Factory ownership, registration and premises identity.",
      },
      {
        code: "location",
        number: "02",
        title: "Factory Location",
        description:
          "Physical location and legal premises information.",
      },
      {
        code: "infrastructure",
        number: "03",
        title: "Infrastructure",
        description:
          "Built-up area, utilities, power and logistics infrastructure.",
      },
      {
        code: "machinery",
        number: "04",
        title: "Machinery & Equipment",
        description:
          "Manufacturing machinery and production equipment.",
      },
      {
        code: "process",
        number: "05",
        title: "Manufacturing Process",
        description:
          "Actual manufacturing process and process documentation.",
      },
      {
        code: "capacity",
        number: "06",
        title: "Production Capacity",
        description:
          "Installed capacity, utilization and production capability.",
      },
      {
        code: "manpower",
        number: "07",
        title: "Manpower",
        description:
          "Workers, technical personnel and supervisory capability.",
      },
      {
        code: "quality",
        number: "08",
        title: "Quality Control",
        description:
          "Quality systems, inspections and control procedures.",
      },
      {
        code: "testing",
        number: "09",
        title: "Testing Facilities",
        description:
          "Internal and external product testing capability.",
      },
      {
        code: "storage",
        number: "10",
        title: "Raw Material & Storage",
        description:
          "Raw material, finished goods and inventory controls.",
      },
      {
        code: "safety",
        number: "11",
        title: "Safety & Compliance",
        description:
          "Fire, electrical, worker and operational safety.",
      },
      {
        code: "evidence",
        number: "12",
        title: "Evidence & Verification",
        description:
          "Factory documents, photographs and verification evidence.",
      },
    ];
  
  export const FACTORY_WEIGHTS: Record<
    FactorySectionCode,
    number
  > = {
    identity: 5,
    location: 8,
    infrastructure: 12,
    machinery: 15,
    process: 12,
    capacity: 10,
    manpower: 8,
    quality: 10,
    testing: 6,
    storage: 5,
    safety: 6,
    evidence: 3,
  };