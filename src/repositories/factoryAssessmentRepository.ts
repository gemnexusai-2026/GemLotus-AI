import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import type {
  FactoryProfileInput,
} from "@/types/assessment/factory";

import type {
  FactoryProfile,
  FactoryUtility,
  FactoryDocument,
} from "@/app/assessment/factory/factory.types";

export interface FactoryAssessmentRepository {
  getProfile(
    assessmentId: string,
  ): Promise<FactoryProfile | null>;

  saveProfile(
    assessmentId: string,
    userId: string,
    input: FactoryProfileInput,
  ): Promise<void>;

  getEvidence(
    assessmentId: string,
  ): Promise<FactoryDocument[]>;

  createEvidence(
    assessmentId: string,
    factoryProfileId: string,
    userId: string,
    document: FactoryDocument,
  ): Promise<FactoryDocument>;

  updateEvidence(
    evidenceId: string,
    patch: Partial<FactoryDocument>,
  ): Promise<void>;
}

function numberOrNull(
  value: string,
): number | null {
  const n = Number(value);

  return Number.isFinite(n)
    ? n
    : null;
}

function stringValue(
  value: unknown,
): string {
  return value == null
    ? ""
    : String(value);
}

function booleanValue(
  value: unknown,
): boolean {
  return value === true;
}

function createUtility(
  factoryId: string,
  utilityName: string,
  status: FactoryUtility["status"],
  capacity = "",
): FactoryUtility {
  return {
    id: `${factoryId}-utility-${utilityName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`,

    factoryId,

    utilityName,

    status,

    capacity,

    source: "",

    verified: false,

    evidenceReference: "",

    remarks: "",
  };
}

function normalizeFactoryProfile(
  data: Record<string, unknown>,
  assessmentId: string,
): FactoryProfile {
  const now =
    new Date().toISOString();

  const factoryId =
    stringValue(
      data.id,
    ) ||
    `factory-${assessmentId}`;

  const electricityAvailable =
    booleanValue(
      data.power_connection_available,
    );

  const waterAvailable =
    booleanValue(
      data.water_available,
    );

  const loadingAvailable =
    booleanValue(
      data.loading_unloading_available,
    );

  return {
    id: factoryId,

    assessmentId,

    factoryName:
      stringValue(
        data.factory_name,
      ),

    ownershipType:
      stringValue(
        data.ownership_type,
      ) as FactoryProfile["ownershipType"],

    premisesStatus:
      stringValue(
        data.premises_type,
      ) as FactoryProfile["premisesStatus"],

    registeredAddress:
      [
        data.address_line1,
        data.address_line2,
      ]
        .filter(Boolean)
        .map(String)
        .join(", "),

    factoryAddress:
      [
        data.address_line1,
        data.address_line2,
        data.city,
        data.district,
        data.state,
        data.pincode,
      ]
        .filter(Boolean)
        .map(String)
        .join(", "),

    state:
      stringValue(
        data.state,
      ),

    district:
      stringValue(
        data.district,
      ),

    pincode:
      stringValue(
        data.pincode,
      ),

    areaUnit:
      data.premises_area_unit ===
      "sqm"
        ? "sqm"
        : "sqft",

    totalArea:
      data.premises_area == null
        ? ""
        : String(
            data.premises_area,
          ),

    manufacturingArea:
      data.production_area == null
        ? ""
        : String(
            data.production_area,
          ),

    operationalSince:
      stringValue(
        data.operational_since,
      ),

    infrastructure: {
      id: `${factoryId}-infra`,

      factoryId,

      productionArea:
        stringValue(
          data.production_area,
        ),

      storageArea:
        stringValue(
          data.storage_area,
        ),

      officeArea:
        stringValue(
          data.office_area,
        ),

      totalBuiltUpArea:
        stringValue(
          data.built_up_area,
        ),

      floorCount:
        stringValue(
          data.floor_count,
        ),

      rawMaterialStorage:
        booleanValue(
          data.raw_material_storage_available,
        ),

      finishedGoodsStorage:
        booleanValue(
          data.finished_goods_storage_available,
        ),

      qualityInspectionArea:
        booleanValue(
          data.quality_control_available,
        ),

      maintenanceArea: false,

      loadingUnloadingArea:
        loadingAvailable,

      workerFacilitiesAvailable:
        booleanValue(
          data.worker_safety_system_available,
        ),

      layoutAvailable:
        booleanValue(
          data.layout_available,
        ),

      layoutVerified: false,

      utilities: [
        createUtility(
          factoryId,
          "Electricity",
          electricityAvailable
            ? "available"
            : "not_available",
          stringValue(
            data.power_capacity,
          ),
        ),

        createUtility(
          factoryId,
          "Water",
          waterAvailable
            ? "available"
            : "not_available",
        ),

        createUtility(
          factoryId,
          "Compressed Air",
          "not_available",
        ),

        createUtility(
          factoryId,
          "Internet / Communication",
          "not_available",
        ),

        createUtility(
          factoryId,
          "Waste Management",
          "not_available",
        ),
      ],

      remarks: "",
    },

    documents: [],

    findings: [],

    verificationStatus:
      "pending",

    riskLevel:
      "medium",

    createdAt:
      stringValue(
        data.created_at,
      ) || now,

    updatedAt:
      stringValue(
        data.updated_at,
      ) || now,

    remarks:
      stringValue(
        data.assessment_notes,
      ),
  };
}

function normalizeFactoryDocument(
  data: Record<string, unknown>,
  factoryId: string,
): FactoryDocument {
  return {
    id: String(data.id ?? ""),
    factoryId,
    documentType: String(data.section_code ?? "other") as FactoryDocument["documentType"],
    documentName: String(data.title ?? ""),
    documentNumber: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    validityStatus: "unknown",
    verificationStatus: String(data.verification_status ?? "pending") as FactoryDocument["verificationStatus"],
    fileName: String(data.file_name ?? ""),
    fileReference: String(data.file_path ?? ""),
    isMandatory: false,
    isCurrent: true,
    verifiedBy: String(data.verified_by ?? ""),
    verificationDate: data.verified_at ? String(data.verified_at) : "",
    remarks: String(data.remarks ?? ""),
  };
}
export function createFactoryAssessmentRepository():
  FactoryAssessmentRepository {
  return {
    async getProfile(
      assessmentId,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } =
        await supabase
          .from(
            "assessment_factory_profiles" as any,
          )
          .select("*")
          .eq(
            "assessment_id",
            assessmentId,
          )
          .maybeSingle();

      if (error) {
        throw new Error(
          `FACTORY_PROFILE_LOAD_FAILED:${error.message}`,
        );
      }

      if (!data) {
        return null;
      }

      const documents =
        await this.getEvidence(
          assessmentId,
        );

      const profile =
        normalizeFactoryProfile(
          data as Record<
            string,
            unknown
          >,
          assessmentId,
        );

      return {
        ...profile,
        documents,
      };
    },

    async getEvidence(
      assessmentId,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } =
        await supabase
          .from(
            "assessment_factory_evidence" as any,
          )
          .select("*")
          .eq(
            "assessment_id",
            assessmentId,
          )
          .order(
            "created_at",
            { ascending: true },
          );

      if (error) {
        throw new Error(
          `FACTORY_EVIDENCE_LOAD_FAILED:${error.message}`,
        );
      }

      return (data ?? []).map(
        (row) =>
          normalizeFactoryDocument(
            row as Record<string, unknown>,
            String(
              row.factory_profile_id ??
              `factory-${assessmentId}`,
            ),
          ),
      );
    },
    async createEvidence(
      assessmentId,
      factoryProfileId,
      userId,
      document,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { data, error } =
        await supabase
          .from(
            "assessment_factory_evidence" as any,
          )
          .insert({
            assessment_id:
              assessmentId,

            factory_profile_id:
              factoryProfileId,

            section_code:
              document.documentType,

            evidence_type:
              "document",

            title:
              document.documentName ||
              document.documentType,

            description:
              null,

            file_path:
              document.fileReference ||
              null,

            file_name:
              document.fileName ||
              null,

            mime_type:
              null,

            verification_status:
              document.verificationStatus,

            verified_by:
              document.verifiedBy || null,

            verified_at:
              document.verificationDate ||
              null,

            remarks:
              document.remarks || null,

            created_by:
              userId,
          })
          .select("*")
          .single();

      if (error) {
        throw new Error(
          `FACTORY_EVIDENCE_CREATE_FAILED:${error.message}`,
        );
      }

      return normalizeFactoryDocument(
        data as Record<string, unknown>,
        factoryProfileId,
      );
    },

    async updateEvidence(
      evidenceId,
      patch,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const update: Record<
        string,
        unknown
      > = {};

      if (
        patch.documentName !==
        undefined
      ) {
        update.title =
          patch.documentName;
      }

      if (
        patch.fileReference !==
        undefined
      ) {
        update.file_path =
          patch.fileReference ||
          null;
      }

      if (
        patch.fileName !==
        undefined
      ) {
        update.file_name =
          patch.fileName ||
          null;
      }

      if (
        patch.verificationStatus !==
        undefined
      ) {
        update.verification_status =
          patch.verificationStatus;
      }

      if (
        patch.verifiedBy !==
        undefined
      ) {
        update.verified_by =
          patch.verifiedBy ||
          null;
      }

      if (
        patch.verificationDate !==
        undefined
      ) {
        update.verified_at =
          patch.verificationDate ||
          null;
      }

      if (
        patch.remarks !==
        undefined
      ) {
        update.remarks =
          patch.remarks ||
          null;
      }

      update.updated_at =
        new Date().toISOString();

      const { error } =
        await supabase
          .from(
            "assessment_factory_evidence" as any,
          )
          .update(update)
          .eq(
            "id",
            evidenceId,
          );

      if (error) {
        throw new Error(
          `FACTORY_EVIDENCE_UPDATE_FAILED:${error.message}`,
        );
      }
    },
    async saveProfile(
      assessmentId,
      userId,
      input,
    ) {
      const supabase =
        await createSupabaseServerClient();

      const { error } =
        await supabase
          .from(
            "assessment_factory_profiles" as any,
          )
          .upsert(
            {
              assessment_id:
                assessmentId,

              created_by:
                userId,

              factory_name:
                input.factoryName.trim(),

              ownership_type:
                input.ownershipType.trim(),

              ownership_name:
                input.ownershipName.trim(),

              factory_registration_number:
                input.factoryRegistrationNumber.trim(),

              factory_license_number:
                input.factoryLicenseNumber.trim(),

              address_line1:
                input.addressLine1.trim(),

              address_line2:
                input.addressLine2.trim(),

              city:
                input.city.trim(),

              district:
                input.district.trim(),

              state:
                input.state.trim(),

              pincode:
                input.pincode.trim(),

              latitude:
                numberOrNull(
                  input.latitude,
                ),

              longitude:
                numberOrNull(
                  input.longitude,
                ),

              premises_type:
                input.premisesType.trim(),

              premises_area:
                numberOrNull(
                  input.premisesArea,
                ),

              premises_area_unit:
                input.premisesAreaUnit,

              built_up_area:
                numberOrNull(
                  input.builtUpArea,
                ),

              production_area:
                numberOrNull(
                  input.productionArea,
                ),

              storage_area:
                numberOrNull(
                  input.storageArea,
                ),

              office_area:
                numberOrNull(
                  input.officeArea,
                ),

              power_connection_available:
                input.powerConnectionAvailable,

              power_capacity:
                numberOrNull(
                  input.powerCapacity,
                ),

              power_capacity_unit:
                input.powerCapacityUnit,

              water_available:
                input.waterAvailable,

              drainage_available:
                input.drainageAvailable,

              loading_unloading_available:
                input.loadingUnloadingAvailable,

              internal_transport_available:
                input.internalTransportAvailable,

              machinery_count:
                numberOrNull(
                  input.machineryCount,
                ),

              owned_machinery_count:
                numberOrNull(
                  input.ownedMachineryCount,
                ),

              leased_machinery_count:
                numberOrNull(
                  input.leasedMachineryCount,
                ),

              machinery_details:
                input.machineryDetails,

              manufacturing_process_available:
                input.manufacturingProcessAvailable,

              process_description:
                input.processDescription.trim(),

              process_flow_document_available:
                input.processFlowDocumentAvailable,

              production_capacity:
                numberOrNull(
                  input.productionCapacity,
                ),

              production_capacity_unit:
                input.productionCapacityUnit,

              current_utilization_percent:
                numberOrNull(
                  input.currentUtilizationPercent,
                ),

              shifts_per_day:
                numberOrNull(
                  input.shiftsPerDay,
                ),

              working_days_per_month:
                numberOrNull(
                  input.workingDaysPerMonth,
                ),

              monthly_production_capacity:
                numberOrNull(
                  input.monthlyProductionCapacity,
                ),

              total_workers:
                numberOrNull(
                  input.totalWorkers,
                ),

              technical_workers:
                numberOrNull(
                  input.technicalWorkers,
                ),

              supervisory_workers:
                numberOrNull(
                  input.supervisoryWorkers,
                ),

              quality_workers:
                numberOrNull(
                  input.qualityWorkers,
                ),

              manpower_details:
                input.manpowerDetails,

              quality_control_available:
                input.qualityControlAvailable,

              quality_department_available:
                input.qualityDepartmentAvailable,

              inspection_process_available:
                input.inspectionProcessAvailable,

              incoming_inspection_available:
                input.incomingInspectionAvailable,

              in_process_inspection_available:
                input.inProcessInspectionAvailable,

              final_inspection_available:
                input.finalInspectionAvailable,

              quality_system_description:
                input.qualitySystemDescription.trim(),

              testing_facility_available:
                input.testingFacilityAvailable,

              testing_equipment_details:
                input.testingEquipmentDetails,

              external_testing_used:
                input.externalTestingUsed,

              external_testing_details:
                input.externalTestingDetails.trim(),

              raw_material_storage_available:
                input.rawMaterialStorageAvailable,

              finished_goods_storage_available:
                input.finishedGoodsStorageAvailable,

              inventory_control_available:
                input.inventoryControlAvailable,

              storage_details:
                input.storageDetails.trim(),

              fire_safety_available:
                input.fireSafetyAvailable,

              fire_noc_available:
                input.fireNocAvailable,

              electrical_safety_available:
                input.electricalSafetyAvailable,

              worker_safety_system_available:
                input.workerSafetySystemAvailable,

              safety_training_available:
                input.safetyTrainingAvailable,

              safety_details:
                input.safetyDetails.trim(),

              assessment_notes:
                input.assessmentNotes.trim(),

              updated_at:
                new Date().toISOString(),
            },
            {
              onConflict:
                "assessment_id",
            },
          );

      if (error) {
        throw new Error(
          `FACTORY_PROFILE_SAVE_FAILED:${error.message}`,
        );
      }
    },
  };
}






