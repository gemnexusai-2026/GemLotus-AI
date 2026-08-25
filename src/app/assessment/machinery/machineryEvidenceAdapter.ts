import type {
  EvidenceRecord,
  MachineryRecord,
  MachineryTrace13Evidence,
} from "./machineryAssessmentTypes";

export function adaptMachineryEvidence(
  evidence: EvidenceRecord[],
  machines: MachineryRecord[],
): MachineryTrace13Evidence[] {
  return evidence.map((item) => {
    const machineryIndex = machines.findIndex(
      (machine) => machine.id === item.machineId,
    );

    return {
      id: item.id,

      machineryIndex:
        machineryIndex >= 0
          ? machineryIndex
          : 0,

      title: item.name,

      type:
        item.type === "photo"
          ? "photo"
          : item.type === "certificate"
            ? "certificate"
            : item.type === "video"
              ? "video"
              : item.type === "document"
                ? "document"
                : "other",

      reference: item.id,

      status:
        item.status === "verified"
          ? "verified"
          : item.status === "rejected"
            ? "rejected"
            : item.status === "uploaded"
              ? "submitted"
              : "pending",

      uploadedBy: "Machinery Workspace",

      uploadedAt: "",

      verifiedBy:
        item.status === "verified"
          ? "Machinery Workspace"
          : "",

      verifiedAt: "",

      verificationType:
        item.status === "verified"
          ? "documentary"
          : "documentary",

      observation: item.remarks,

      findingReference: "",
    };
  });
}
