export type MachineryAssessmentClosure21Input = {
  overallScore: number;
  decision: string;
  criticalFindings: number;
  majorFindings: number;
  openFindings: number;
  closedFindings: number;
  blockers: string[];
};

export type MachineryAssessmentClosure21Result = {
  status:
    | "READY_FOR_CLOSURE"
    | "CONDITIONAL_CLOSURE"
    | "NOT_READY";

  overallScore: number;
  decision: string;

  criticalFindings: number;
  majorFindings: number;
  openFindings: number;
  closedFindings: number;

  blockers: string[];
  closurePercentage: number;
  summary: string;
};

export function buildMachineryAssessmentClosure21(
  input: MachineryAssessmentClosure21Input,
): MachineryAssessmentClosure21Result {
  const totalFindings =
    input.openFindings + input.closedFindings;

  const closurePercentage =
    totalFindings === 0
      ? 100
      : Math.round(
          (input.closedFindings / totalFindings) * 100,
        );

  if (
    input.criticalFindings > 0 ||
    input.blockers.length > 0
  ) {
    return {
      status: "NOT_READY",
      ...input,
      closurePercentage,
      summary:
        "Assessment is not ready for closure because critical findings or blockers remain.",
    };
  }

  if (
    input.openFindings > 0 ||
    input.decision === "CONDITIONAL"
  ) {
    return {
      status: "CONDITIONAL_CLOSURE",
      ...input,
      closurePercentage,
      summary:
        "Assessment may proceed to conditional closure subject to outstanding corrective actions.",
    };
  }

  return {
    status: "READY_FOR_CLOSURE",
    ...input,
    closurePercentage,
    summary:
      "Machinery assessment is ready for final closure and audit snapshot.",
  };
}
