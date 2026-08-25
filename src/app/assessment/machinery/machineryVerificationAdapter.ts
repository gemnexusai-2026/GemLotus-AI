import type {
  MachineryRecord,
  MachineryTrace13Verification,
} from "./machineryAssessmentTypes";

export function adaptMachineryVerifications(
  machines: MachineryRecord[],
): MachineryTrace13Verification[] {
  return machines
    .map((machine, index): MachineryTrace13Verification | null => {
      const status =
        machine.verificationStatus === "verified"
          ? "verified"
          : machine.verificationStatus === "rejected"
            ? "rejected"
            : machine.verificationStatus === "needs_review"
              ? "pending"
              : "pending";

      if (
        !machine.physicallyVerified &&
        machine.verificationStatus === "pending"
      ) {
        return null;
      }

      return {
        id: `M19-V-${machine.id || index}`,
        machineryIndex: index,
        type: machine.physicallyVerified
          ? "physical"
          : "documentary",
        status,
        verifiedBy:
          machine.physicallyVerified &&
          machine.verificationStatus === "verified"
            ? "Machinery Workspace"
            : "",
        verifiedAt: "",
        observation: machine.remarks || "",
        evidenceIds: [],
      };
    })
    .filter(
      (item): item is MachineryTrace13Verification =>
        item !== null,
    );
}
