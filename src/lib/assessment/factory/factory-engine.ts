import {
    FACTORY_SECTIONS,
    FACTORY_WEIGHTS,
  } from "./factory-constants";
  
  import type {
    FactoryAssessmentResult,
    FactoryProfileInput,
    FactoryRiskLevel,
    FactorySectionCode,
    FactorySectionStatus,
  } from "@/types/assessment/factory";
  
  function filled(value: unknown): boolean {
    if (typeof value === "boolean") {
      return true;
    }
  
    if (Array.isArray(value)) {
      return value.length > 0;
    }
  
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim().length > 0
    );
  }
  
  function sectionStatus(
    code: FactorySectionCode,
    form: FactoryProfileInput,
  ): FactorySectionStatus {
    const issues: string[] = [];
  
    switch (code) {
      case "identity":
        if (!filled(form.factoryName)) {
          issues.push("Factory name required");
        }
  
        if (!filled(form.ownershipType)) {
          issues.push("Ownership type required");
        }
  
        break;
  
      case "location":
        if (!filled(form.addressLine1)) {
          issues.push("Factory address required");
        }
  
        if (!filled(form.city)) {
          issues.push("City required");
        }
  
        if (!filled(form.state)) {
          issues.push("State required");
        }
  
        if (!filled(form.pincode)) {
          issues.push("Pincode required");
        }
  
        break;
  
      case "infrastructure":
        if (!filled(form.premisesArea)) {
          issues.push("Premises area required");
        }
  
        if (!form.powerConnectionAvailable) {
          issues.push("Power connection not confirmed");
        }
  
        break;
  
      case "machinery":
        if (
          Number(form.machineryCount || 0) <= 0
        ) {
          issues.push("Machinery inventory required");
        }
  
        if (
          form.machineryDetails.length === 0
        ) {
          issues.push(
            "At least one machinery record required",
          );
        }
  
        break;
  
      case "process":
        if (
          !form.manufacturingProcessAvailable
        ) {
          issues.push(
            "Manufacturing process not confirmed",
          );
        }
  
        if (!filled(form.processDescription)) {
          issues.push(
            "Process description required",
          );
        }
  
        break;
  
      case "capacity":
        if (!filled(form.productionCapacity)) {
          issues.push(
            "Production capacity required",
          );
        }
  
        if (!filled(form.productionCapacityUnit)) {
          issues.push(
            "Capacity unit required",
          );
        }
  
        break;
  
      case "manpower":
        if (
          Number(form.totalWorkers || 0) <= 0
        ) {
          issues.push("Total manpower required");
        }
  
        if (
          Number(form.technicalWorkers || 0) <= 0
        ) {
          issues.push(
            "Technical manpower required",
          );
        }
  
        break;
  
      case "quality":
        if (!form.qualityControlAvailable) {
          issues.push(
            "Quality control not confirmed",
          );
        }
  
        if (!form.finalInspectionAvailable) {
          issues.push(
            "Final inspection not confirmed",
          );
        }
  
        break;
  
      case "testing":
        if (
          !form.testingFacilityAvailable &&
          !form.externalTestingUsed
        ) {
          issues.push(
            "Testing capability not established",
          );
        }
  
        break;
  
      case "storage":
        if (
          !form.rawMaterialStorageAvailable
        ) {
          issues.push(
            "Raw material storage not confirmed",
          );
        }
  
        if (
          !form.finishedGoodsStorageAvailable
        ) {
          issues.push(
            "Finished goods storage not confirmed",
          );
        }
  
        break;
  
      case "safety":
        if (!form.fireSafetyAvailable) {
          issues.push(
            "Fire safety not confirmed",
          );
        }
  
        if (!form.electricalSafetyAvailable) {
          issues.push(
            "Electrical safety not confirmed",
          );
        }
  
        break;
  
      case "evidence":
        // Evidence is completed through evidence records.
        // Initial profile does not artificially mark it complete.
        issues.push("Evidence verification pending");
        break;
    }
  
    const completion =
      issues.length === 0 ? 100 : 0;
  
    return {
      completion,
      ready: issues.length === 0,
      issues,
    };
  }
  
  function riskFromScore(
    score: number,
    issues: string[],
  ): FactoryRiskLevel {
    if (score === 0) {
      return "not_assessed";
    }
  
    if (score >= 85 && issues.length <= 2) {
      return "low";
    }
  
    if (score >= 70) {
      return "moderate";
    }
  
    if (score >= 50) {
      return "high";
    }
  
    return "critical";
  }
  
  export function calculateFactoryAssessment(
    form: FactoryProfileInput,
  ): FactoryAssessmentResult {
    const sectionStatusMap =
      {} as Record<
        FactorySectionCode,
        FactorySectionStatus
      >;
  
    let weightedScore = 0;
    let totalWeight = 0;
    const issues: string[] = [];
  
    for (const section of FACTORY_SECTIONS) {
      const result = sectionStatus(
        section.code,
        form,
      );
  
      sectionStatusMap[section.code] = result;
  
      const weight =
        FACTORY_WEIGHTS[section.code];
  
      weightedScore +=
        (result.completion / 100) * weight;
  
      totalWeight += weight;
  
      for (const issue of result.issues) {
        issues.push(
          `${section.title}: ${issue}`,
        );
      }
    }
  
    const completionPercent =
      Math.round(
        (Object.values(sectionStatusMap)
          .filter((item) => item.ready)
          .length /
          FACTORY_SECTIONS.length) *
          100,
      );
  
    const readinessScore =
      totalWeight === 0
        ? 0
        : Math.round(
            (weightedScore / totalWeight) * 100,
          );
  
    const riskLevel =
      riskFromScore(
        readinessScore,
        issues,
      );
  
    const status =
      completionPercent >= 100
        ? "ready_for_review"
        : completionPercent > 0
          ? "in_progress"
          : "draft";
  
    return {
      completionPercent,
      readinessScore,
      riskLevel,
      status,
      sectionStatus: sectionStatusMap,
      issues,
    };
  }