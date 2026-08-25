/* ============================================================
   GEMNEXUS AI
   OEM ASSESSMENT OS
   MACHINERY ASSESSMENT ENGINE
   ============================================================

   Responsibilities:
   - Machinery data validation
   - Completion calculation
   - Evidence-gap detection
   - Verification-gap detection
   - Machinery summary
   - Readiness calculation
   - Risk classification
   - Recommendations
   - Section readiness

   IMPORTANT:
   This engine does NOT:
   - access Supabase
   - upload files
   - render React
   - modify database
   ============================================================ */

   import type {
    MachineryAssessmentInput,
    MachineryAssessmentResult,
    MachineryAssessmentStatus,
    MachineryEvidence,
    MachineryRecord,
    MachineryRiskLevel,
    MachinerySectionStatus,
    MachinerySummary,
    MachineryVerificationRecord,
  } from "@/types/assessment/machinery";
  
  import {
    MACHINERY_ASSESSMENT_DIMENSIONS,
    MACHINERY_DOCUMENT_CHECKLIST,
    MACHINERY_TOTAL_WEIGHT,
    MACHINERY_VERIFICATION_CHECKLIST,
  } from "./machinery-constants";
  
  
  /* ============================================================
     INTERNAL HELPERS
  ============================================================ */
  
  function hasText(value: unknown): boolean {
    return (
      typeof value === "string" &&
      value.trim().length > 0
    );
  }
  
  
  function positiveNumber(value: unknown): boolean {
    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    );
  }
  
  
  function isMachineComplete(
    machine: MachineryRecord,
  ): boolean {
    return (
      hasText(machine.machineName) &&
      hasText(machine.manufacturer) &&
      hasText(machine.model) &&
      machine.quantity > 0 &&
      hasText(machine.category)
    );
  }
  
  
  function hasMachineEvidence(
    machine: MachineryRecord,
    evidence: MachineryEvidence[],
  ): boolean {
    if (machine.evidenceIds.length > 0) {
      return true;
    }
  
    return evidence.some(
      (item) =>
        item.machineryId === machine.id &&
        item.verificationStatus !== "rejected",
    );
  }
  
  
  function getMachineVerification(
    machineId: string,
    records: MachineryVerificationRecord[],
  ): MachineryVerificationRecord | undefined {
    return records.find(
      (record) =>
        record.machineryId === machineId,
    );
  }
  
  
  /* ============================================================
     MACHINE FIELD VALIDATION
  ============================================================ */
  
  export function validateMachineryRecord(
    machine: MachineryRecord,
  ): string[] {
    const issues: string[] = [];
  
    if (!hasText(machine.machineName)) {
      issues.push("Machine name is missing.");
    }
  
    if (!hasText(machine.manufacturer)) {
      issues.push(
        `Manufacturer is missing for ${machine.machineName || "machine"}.`,
      );
    }
  
    if (!hasText(machine.model)) {
      issues.push(
        `Model is missing for ${machine.machineName || "machine"}.`,
      );
    }
  
    if (!positiveNumber(machine.quantity)) {
      issues.push(
        `Valid quantity is required for ${machine.machineName || "machine"}.`,
      );
    }
  
    if (
      machine.ownershipType === "owned" &&
      !hasText(machine.ownerName)
    ) {
      issues.push(
        `Owner name is missing for ${machine.machineName || "machine"}.`,
      );
    }
  
    if (
      machine.physicallyAvailable &&
      !hasText(machine.physicalLocation)
    ) {
      issues.push(
        `Physical location is missing for ${machine.machineName || "machine"}.`,
      );
    }
  
    if (
      machine.productionRelevant &&
      !hasText(machine.productProcess)
    ) {
      issues.push(
        `Production process is missing for ${machine.machineName || "machine"}.`,
      );
    }
  
    if (
      machine.calibrationApplicable &&
      !machine.calibrationAvailable
    ) {
      issues.push(
        `Calibration evidence is missing for ${machine.machineName || "machine"}.`,
      );
    }
  
    return issues;
  }
  
  
  /* ============================================================
     EVIDENCE VALIDATION
  ============================================================ */
  
  export function validateMachineryEvidence(
    evidence: MachineryEvidence,
  ): string[] {
    const issues: string[] = [];
  
    if (!hasText(evidence.title)) {
      issues.push("Evidence title is missing.");
    }
  
    if (!hasText(evidence.fileName)) {
      issues.push(
        `Evidence file name is missing for ${evidence.title || "evidence"}.`,
      );
    }
  
    if (!hasText(evidence.filePath)) {
      issues.push(
        `Evidence file path is missing for ${evidence.title || "evidence"}.`,
      );
    }
  
    if (!hasText(evidence.machineryId)) {
      issues.push(
        `Machinery reference is missing for ${evidence.title || "evidence"}.`,
      );
    }
  
    return issues;
  }
  
  
  /* ============================================================
     SUMMARY
  ============================================================ */
  
  export function buildMachinerySummary(
    machines: MachineryRecord[],
    evidence: MachineryEvidence[],
    verificationRecords: MachineryVerificationRecord[],
  ): MachinerySummary {
    let totalQuantity = 0;
  
    let ownedMachines = 0;
    let leasedMachines = 0;
    let rentedMachines = 0;
    let hiredMachines = 0;
  
    let operationalMachines = 0;
    let nonOperationalMachines = 0;
  
    let verifiedMachines = 0;
    let unverifiedMachines = 0;
  
    let evidenceBackedMachines = 0;
    let machinesRequiringReview = 0;
  
    for (const machine of machines) {
      totalQuantity += machine.quantity || 0;
  
      switch (machine.ownershipType) {
        case "owned":
          ownedMachines += machine.quantity || 0;
          break;
  
        case "leased":
          leasedMachines += machine.quantity || 0;
          break;
  
        case "rented":
          rentedMachines += machine.quantity || 0;
          break;
  
        case "hired":
          hiredMachines += machine.quantity || 0;
          break;
  
        default:
          break;
      }
  
      if (
        machine.operationalStatus ===
          "operational" ||
        machine.operationalStatus ===
          "partially_operational"
      ) {
        operationalMachines += machine.quantity || 0;
      }
  
      if (
        machine.operationalStatus ===
          "not_operational" ||
        machine.operationalStatus ===
          "decommissioned"
      ) {
        nonOperationalMachines += machine.quantity || 0;
      }
  
      const verification =
        getMachineVerification(
          machine.id,
          verificationRecords,
        );
  
      if (
        machine.verificationStatus ===
          "verified" ||
        verification?.verificationStatus ===
          "verified"
      ) {
        verifiedMachines += machine.quantity || 0;
      } else {
        unverifiedMachines += machine.quantity || 0;
      }
  
      if (
        hasMachineEvidence(
          machine,
          evidence,
        )
      ) {
        evidenceBackedMachines += machine.quantity || 0;
      }
  
      if (
        machine.verificationStatus ===
          "requires_review" ||
        machine.verificationStatus ===
          "disputed" ||
        verification?.verificationStatus ===
          "requires_review" ||
        verification?.verificationStatus ===
          "disputed"
      ) {
        machinesRequiringReview +=
          machine.quantity || 0;
      }
    }
  
    return {
      totalMachines: machines.length,
  
      totalQuantity,
  
      ownedMachines,
  
      leasedMachines,
  
      rentedMachines,
  
      hiredMachines,
  
      operationalMachines,
  
      nonOperationalMachines,
  
      verifiedMachines,
  
      unverifiedMachines,
  
      evidenceBackedMachines,
  
      machinesRequiringReview,
    };
  }
  
  
  /* ============================================================
     COMPLETION
  ============================================================ */
  
  export function calculateMachineryCompletion(
    machines: MachineryRecord[],
    evidence: MachineryEvidence[],
    verificationRecords: MachineryVerificationRecord[],
  ): number {
    if (machines.length === 0) {
      return 0;
    }
  
    let completed = 0;
  
    for (const machine of machines) {
      let score = 0;
  
      /*
       * Identity
       */
      if (hasText(machine.machineName)) {
        score += 1;
      }
  
      if (hasText(machine.manufacturer)) {
        score += 1;
      }
  
      if (hasText(machine.model)) {
        score += 1;
      }
  
      if (hasText(machine.serialNumber)) {
        score += 1;
      }
  
      /*
       * Ownership
       */
      if (hasText(machine.ownershipType)) {
        score += 1;
      }
  
      /*
       * Physical presence
       */
      if (machine.physicallyAvailable) {
        score += 1;
      }
  
      if (hasText(machine.physicalLocation)) {
        score += 1;
      }
  
      /*
       * Capacity
       */
      if (hasText(machine.ratedCapacity)) {
        score += 1;
      }
  
      /*
       * Operation
       */
      if (
        machine.operationalStatus !==
        "unknown"
      ) {
        score += 1;
      }
  
      /*
       * Production relevance
       */
      if (machine.productionRelevant) {
        score += 1;
      }
  
      /*
       * Evidence
       */
      if (
        hasMachineEvidence(
          machine,
          evidence,
        )
      ) {
        score += 2;
      }
  
      /*
       * Verification
       */
      const verification =
        getMachineVerification(
          machine.id,
          verificationRecords,
        );
  
      if (
        machine.verificationStatus ===
          "verified" ||
        verification?.verificationStatus ===
          "verified"
      ) {
        score += 2;
      }
  
      completed += score / 14;
    }
  
    return Math.min(
      100,
      Math.round(
        (completed / machines.length) *
          100,
      ),
    );
  }
  
  
  /* ============================================================
     EVIDENCE GAP DETECTION
  ============================================================ */
  
  export function findEvidenceGaps(
    machines: MachineryRecord[],
    evidence: MachineryEvidence[],
  ): string[] {
    const gaps: string[] = [];
  
    for (const machine of machines) {
      const machineEvidence =
        evidence.filter(
          (item) =>
            item.machineryId ===
            machine.id &&
            item.verificationStatus !==
              "rejected",
        );
  
      if (machineEvidence.length === 0) {
        gaps.push(
          `No supporting evidence attached for ${machine.machineName || "machine"}.`,
        );
        continue;
      }
  
      const hasMachinePhoto =
        machineEvidence.some(
          (item) =>
            item.type ===
              "photograph" ||
            item.type ===
              "nameplate_photo" ||
            item.type ===
              "serial_number_photo",
        );
  
      if (!hasMachinePhoto) {
        gaps.push(
          `Machine photograph/nameplate evidence is missing for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (
        machine.ownershipType === "owned"
      ) {
        const hasOwnershipEvidence =
          machineEvidence.some(
            (item) =>
              item.type ===
                "purchase_invoice" ||
              item.type ===
                "asset_register",
          );
  
        if (!hasOwnershipEvidence) {
          gaps.push(
            `Ownership evidence is missing for ${machine.machineName || "machine"}.`,
          );
        }
      }
  
      if (
        machine.ownershipType === "leased" ||
        machine.ownershipType === "rented"
      ) {
        const hasLeaseEvidence =
          machineEvidence.some(
            (item) =>
              item.type ===
                "lease_agreement" ||
              item.type ===
                "rental_agreement",
          );
  
        if (!hasLeaseEvidence) {
          gaps.push(
            `Lease/rental evidence is missing for ${machine.machineName || "machine"}.`,
          );
        }
      }
  
      if (
        machine.calibrationApplicable
      ) {
        const hasCalibration =
          machineEvidence.some(
            (item) =>
              item.type ===
              "calibration_certificate",
          );
  
        if (
          !machine.calibrationAvailable ||
          !hasCalibration
        ) {
          gaps.push(
            `Calibration evidence is missing for ${machine.machineName || "machine"}.`,
          );
        }
      }
    }
  
    return gaps;
  }
  
  
  /* ============================================================
     VERIFICATION GAP DETECTION
  ============================================================ */
  
  export function findVerificationGaps(
    machines: MachineryRecord[],
    verificationRecords: MachineryVerificationRecord[],
  ): string[] {
    const gaps: string[] = [];
  
    for (const machine of machines) {
      const record =
        getMachineVerification(
          machine.id,
          verificationRecords,
        );
  
      if (!record) {
        gaps.push(
          `Verification record is missing for ${machine.machineName || "machine"}.`,
        );
        continue;
      }
  
      if (
        !record.physicalPresenceVerified
      ) {
        gaps.push(
          `Physical presence is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (!record.identityVerified) {
        gaps.push(
          `Machine identity is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (!record.serialNumberVerified) {
        gaps.push(
          `Serial number is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (!record.ownershipVerified) {
        gaps.push(
          `Ownership is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (!record.installationVerified) {
        gaps.push(
          `Installation is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (
        !record.operationalStatusVerified
      ) {
        gaps.push(
          `Operational status is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (!record.capacityVerified) {
        gaps.push(
          `Capacity is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (
        !record.productionRelevanceVerified
      ) {
        gaps.push(
          `Production relevance is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (!record.evidenceVerified) {
        gaps.push(
          `Supporting evidence is not verified for ${machine.machineName || "machine"}.`,
        );
      }
  
      if (record.discrepancies.length > 0) {
        gaps.push(
          ...record.discrepancies.map(
            (item) =>
              `${machine.machineName || "Machine"}: ${item}`,
          ),
        );
      }
    }
  
    return gaps;
  }
  
  
  /* ============================================================
     REQUIRED DOCUMENT GAP DETECTION
  ============================================================ */
  
  export function findDocumentGaps(
    machines: MachineryRecord[],
    evidence: MachineryEvidence[],
  ): string[] {
    const gaps: string[] = [];
  
    if (machines.length === 0) {
      gaps.push(
        "Machinery Register has no machine records.",
      );
  
      return gaps;
    }
  
    const registerEvidence =
      evidence.some(
        (item) =>
          item.type ===
            "machinery_register" &&
          item.verificationStatus !==
            "rejected",
      );
  
    if (!registerEvidence) {
      gaps.push(
        "Machinery Register supporting document is not attached.",
      );
    }
  
    const machinePhotoCount =
      evidence.filter(
        (item) =>
          (
            item.type ===
              "photograph" ||
            item.type ===
              "nameplate_photo" ||
            item.type ===
              "serial_number_photo"
          ) &&
          item.verificationStatus !==
            "rejected",
      ).length;
  
    if (machinePhotoCount === 0) {
      gaps.push(
        "No machinery photographs are attached.",
      );
    }
  
    for (const document of MACHINERY_DOCUMENT_CHECKLIST) {
      if (!document.mandatory) {
        continue;
      }
  
      if (
        document.code ===
        "machinery_register"
      ) {
        continue;
      }
  
      if (
        document.code ===
          "nameplate_photo" &&
        !evidence.some(
          (item) =>
            item.type ===
              "nameplate_photo" &&
            item.verificationStatus !==
              "rejected",
        )
      ) {
        gaps.push(
          "Machine nameplate photograph is missing.",
        );
      }
  
      if (
        document.code ===
          "serial_number_photo" &&
        !evidence.some(
          (item) =>
            item.type ===
              "serial_number_photo" &&
            item.verificationStatus !==
              "rejected",
        )
      ) {
        gaps.push(
          "Machine serial-number photograph is missing.",
        );
      }
    }
  
    return gaps;
  }
  
  
  /* ============================================================
     SECTION STATUS
  ============================================================ */
  
  export function calculateMachinerySectionStatus(
    machines: MachineryRecord[],
    evidence: MachineryEvidence[],
    verificationRecords: MachineryVerificationRecord[],
  ): MachinerySectionStatus {
    const issues: string[] = [];
  
    const warnings: string[] = [];
  
    const evidenceGaps =
      findEvidenceGaps(
        machines,
        evidence,
      );
  
    const verificationGaps =
      findVerificationGaps(
        machines,
        verificationRecords,
      );
  
    const documentGaps =
      findDocumentGaps(
        machines,
        evidence,
      );
  
    issues.push(
      ...verificationGaps,
    );
  
    warnings.push(
      ...evidenceGaps,
      ...documentGaps,
    );
  
    const totalCount =
      machines.length;
  
    const verifiedCount =
      machines.filter(
        (machine) =>
          machine.verificationStatus ===
          "verified",
      ).length;
  
    const evidenceCount =
      machines.filter(
        (machine) =>
          hasMachineEvidence(
            machine,
            evidence,
          ),
      ).length;
  
    const missingEvidenceCount =
      totalCount - evidenceCount;
  
    let completion = 0;
  
    if (totalCount > 0) {
      const machineCompletion =
        calculateMachineryCompletion(
          machines,
          evidence,
          verificationRecords,
        );
  
      completion =
        machineCompletion;
    }
  
    const ready =
      totalCount > 0 &&
      completion >= 80 &&
      verifiedCount === totalCount &&
      missingEvidenceCount === 0 &&
      verificationGaps.length === 0;
  
    return {
      completion,
  
      ready,
  
      verifiedCount,
  
      totalCount,
  
      evidenceCount,
  
      missingEvidenceCount,
  
      issues,
  
      warnings,
    };
  }
  
  
  /* ============================================================
     READINESS SCORE
  ============================================================ */
  
  export function calculateMachineryReadiness(
    machines: MachineryRecord[],
    evidence: MachineryEvidence[],
    verificationRecords: MachineryVerificationRecord[],
  ): number {
    if (machines.length === 0) {
      return 0;
    }
  
    const summary =
      buildMachinerySummary(
        machines,
        evidence,
        verificationRecords,
      );
  
    /*
     * Physical presence
     */
    const physicalScore =
      machines.filter(
        (machine) =>
          machine.physicallyAvailable,
      ).length /
      machines.length *
      100;
  
    /*
     * Identity
     */
    const identityScore =
      machines.filter(
        (machine) =>
          hasText(machine.machineName) &&
          hasText(machine.manufacturer) &&
          hasText(machine.model) &&
          hasText(machine.serialNumber),
      ).length /
      machines.length *
      100;
  
    /*
     * Ownership
     */
    const ownershipScore =
      machines.filter(
        (machine) =>
          machine.ownershipVerificationStatus ===
          "verified",
      ).length /
      machines.length *
      100;
  
    /*
     * Capacity
     */
    const capacityScore =
      machines.filter(
        (machine) =>
          hasText(machine.ratedCapacity) &&
          machine.capacityVerificationStatus ===
            "verified",
      ).length /
      machines.length *
      100;
  
    /*
     * Operational condition
     */
    const operationScore =
      machines.filter(
        (machine) =>
          machine.operationalStatus ===
            "operational" ||
          machine.operationalStatus ===
            "partially_operational",
      ).length /
      machines.length *
      100;
  
    /*
     * Evidence
     */
    const evidenceScore =
      summary.evidenceBackedMachines /
      Math.max(
        1,
        summary.totalQuantity,
      ) *
      100;
  
    /*
     * Verification
     */
    const verificationScore =
      summary.verifiedMachines /
      Math.max(
        1,
        summary.totalQuantity,
      ) *
      100;
  
    const weighted =
      physicalScore *
        MACHINERY_ASSESSMENT_DIMENSIONS
          .physicalPresence /
        100 +
  
      identityScore *
        MACHINERY_ASSESSMENT_DIMENSIONS
          .machineIdentity /
        100 +
  
      ownershipScore *
        MACHINERY_ASSESSMENT_DIMENSIONS
          .ownershipVerification /
        100 +
  
      operationScore *
        MACHINERY_ASSESSMENT_DIMENSIONS
          .operationalCondition /
        100 +
  
      capacityScore *
        MACHINERY_ASSESSMENT_DIMENSIONS
          .capacityVerification /
        100 +
  
      evidenceScore *
        MACHINERY_ASSESSMENT_DIMENSIONS
          .evidence /
        100 +
  
      verificationScore *
        MACHINERY_ASSESSMENT_DIMENSIONS
          .physicalPresence /
        100;
  
    const normalized =
      MACHINERY_TOTAL_WEIGHT > 0
        ? weighted /
          MACHINERY_TOTAL_WEIGHT *
          100
        : 0;
  
    return Math.max(
      0,
      Math.min(
        100,
        Math.round(normalized),
      ),
    );
  }
  
  
  /* ============================================================
     RISK LEVEL
  ============================================================ */
  
  export function calculateMachineryRisk(
    readinessScore: number,
    issues: string[],
    machines: MachineryRecord[],
  ): MachineryRiskLevel {
    if (machines.length === 0) {
      return "not_assessed";
    }
  
    const criticalVerificationIssue =
      machines.some(
        (machine) =>
          machine.verificationStatus ===
            "disputed" ||
          machine.verificationStatus ===
            "unable_to_verify",
      );
  
    if (
      criticalVerificationIssue
    ) {
      return "critical";
    }
  
    if (
      readinessScore < 40 ||
      issues.length >= 10
    ) {
      return "critical";
    }
  
    if (
      readinessScore < 60 ||
      issues.length >= 6
    ) {
      return "high";
    }
  
    if (
      readinessScore < 80 ||
      issues.length >= 3
    ) {
      return "moderate";
    }
  
    return "low";
  }
  
  
  /* ============================================================
     RECOMMENDATIONS
  ============================================================ */
  
  export function generateMachineryRecommendations(
    machines: MachineryRecord[],
    evidence: MachineryEvidence[],
    verificationRecords: MachineryVerificationRecord[],
  ): string[] {
    const recommendations: string[] = [];
  
    const summary =
      buildMachinerySummary(
        machines,
        evidence,
        verificationRecords,
      );
  
    if (machines.length === 0) {
      recommendations.push(
        "Create and maintain a machine-wise Machinery Register before claiming manufacturing capability.",
      );
  
      return recommendations;
    }
  
    if (
      summary.verifiedMachines <
      summary.totalQuantity
    ) {
      recommendations.push(
        "Complete physical verification of all machinery and record machine-wise verification status.",
      );
    }
  
    if (
      summary.evidenceBackedMachines <
      summary.totalQuantity
    ) {
      recommendations.push(
        "Attach documentary and photographic evidence for each material machinery asset.",
      );
    }
  
    const missingSerialNumbers =
      machines.filter(
        (machine) =>
          !hasText(
            machine.serialNumber,
          ),
      );
  
    if (
      missingSerialNumbers.length > 0
    ) {
      recommendations.push(
        "Record serial number/nameplate details for each identifiable machine wherever available.",
      );
    }
  
    const missingCapacity =
      machines.filter(
        (machine) =>
          !hasText(
            machine.ratedCapacity,
          ),
      );
  
    if (
      missingCapacity.length > 0
    ) {
      recommendations.push(
        "Record rated machine capacity and supporting capacity evidence.",
      );
    }
  
    const missingOwnership =
      machines.filter(
        (machine) =>
          machine.ownershipVerificationStatus !==
          "verified",
      );
  
    if (
      missingOwnership.length > 0
    ) {
      recommendations.push(
        "Maintain ownership/lease/rental evidence corresponding to machinery records.",
      );
    }
  
    const maintenanceGaps =
      machines.filter(
        (machine) =>
          !machine.maintenanceAvailable,
      );
  
    if (
      maintenanceGaps.length > 0
    ) {
      recommendations.push(
        "Maintain preventive maintenance records and service history for production-critical machinery.",
      );
    }
  
    const calibrationGaps =
      machines.filter(
        (machine) =>
          machine.calibrationApplicable &&
          !machine.calibrationAvailable,
      );
  
    if (
      calibrationGaps.length > 0
    ) {
      recommendations.push(
        "Obtain valid calibration records for applicable measuring/testing equipment.",
      );
    }
  
    const nonOperational =
      machines.filter(
        (machine) =>
          machine.operationalStatus ===
            "not_operational" ||
          machine.operationalStatus ===
            "decommissioned",
      );
  
    if (
      nonOperational.length > 0
    ) {
      recommendations.push(
        "Review non-operational machinery and clearly distinguish installed productive machinery from idle or decommissioned assets.",
      );
    }
  
    return recommendations;
  }
  
  
  /* ============================================================
     ASSESSMENT STATUS
  ============================================================ */
  
  export function determineMachineryStatus(
    machines: MachineryRecord[],
    sectionStatus: MachinerySectionStatus,
  ): MachineryAssessmentStatus {
    if (machines.length === 0) {
      return "draft";
    }
  
    if (
      sectionStatus.ready
    ) {
      return "ready_for_review";
    }
  
    if (
      sectionStatus.completion > 0
    ) {
      return "in_progress";
    }
  
    return "draft";
  }
  
  
  /* ============================================================
     MAIN ENGINE
  ============================================================ */
  
  export function assessMachinery(
    input: MachineryAssessmentInput,
  ): MachineryAssessmentResult {
    const machines =
      Array.isArray(
        input.machineryDetails,
      )
        ? input.machineryDetails
        : [];
  
    const evidence =
      Array.isArray(input.evidence)
        ? input.evidence
        : [];
  
    const verificationRecords =
      Array.isArray(
        input.verificationRecords,
      )
        ? input.verificationRecords
        : [];
  
    /*
     * Machine validation
     */
    const machineIssues =
      machines.flatMap(
        (machine) =>
          validateMachineryRecord(
            machine,
          ),
      );
  
    /*
     * Evidence validation
     */
    const evidenceIssues =
      evidence.flatMap(
        (item) =>
          validateMachineryEvidence(
            item,
          ),
      );
  
    /*
     * Evidence gaps
     */
    const evidenceGaps =
      findEvidenceGaps(
        machines,
        evidence,
      );
  
    /*
     * Verification gaps
     */
    const verificationGaps =
      findVerificationGaps(
        machines,
        verificationRecords,
      );
  
    /*
     * Document gaps
     */
    const documentGaps =
      findDocumentGaps(
        machines,
        evidence,
      );
  
    /*
     * Combined issues
     */
    const issues = Array.from(
      new Set([
        ...machineIssues,
        ...evidenceIssues,
        ...verificationGaps,
      ]),
    );
  
    const warnings = Array.from(
      new Set([
        ...evidenceGaps,
        ...documentGaps,
      ]),
    );
  
    /*
     * Summary
     */
    const summary =
      buildMachinerySummary(
        machines,
        evidence,
        verificationRecords,
      );
  
    /*
     * Completion
     */
    const completionPercent =
      calculateMachineryCompletion(
        machines,
        evidence,
        verificationRecords,
      );
  
    /*
     * Readiness
     */
    const readinessScore =
      calculateMachineryReadiness(
        machines,
        evidence,
        verificationRecords,
      );
  
    /*
     * Risk
     */
    const riskLevel =
      calculateMachineryRisk(
        readinessScore,
        issues,
        machines,
      );
  
    /*
     * Section status
     */
    const sectionStatus =
      calculateMachinerySectionStatus(
        machines,
        evidence,
        verificationRecords,
      );
  
    /*
     * Status
     */
    const status =
      determineMachineryStatus(
        machines,
        sectionStatus,
      );
  
    /*
     * Recommendations
     */
    const recommendations =
      generateMachineryRecommendations(
        machines,
        evidence,
        verificationRecords,
      );
  
    return {
      assessmentId:
        input.assessmentId,
  
      completionPercent,
  
      readinessScore,
  
      riskLevel,
  
      status,
  
      summary,
  
      sectionStatus,
  
      issues,
  
      warnings,
  
      recommendations,
    };
  }
  
  
  /* ============================================================
     QUICK HELPERS FOR SERVER ACTIONS / UI
  ============================================================ */
  
  export function calculateMachineCompletion(
    machine: MachineryRecord,
    evidence: MachineryEvidence[],
    verificationRecords: MachineryVerificationRecord[],
  ): number {
    const result =
      assessMachinery({
        assessmentId: "",
        machineryDetails: [machine],
        evidence,
        verificationRecords,
        notes: "",
      });
  
    return result.completionPercent;
  }
  
  
  export function isMachineryAssessmentReady(
    result: MachineryAssessmentResult,
  ): boolean {
    return (
      result.status ===
        "ready_for_review" &&
      result.completionPercent >= 80 &&
      result.readinessScore >= 80 &&
      result.issues.length === 0
    );
  }
  
  
  export function getMachineryBlockingIssues(
    result: MachineryAssessmentResult,
  ): string[] {
    return result.issues;
  }
  
  
  /* ============================================================
     END OF MACHINERY ENGINE
  ============================================================ */