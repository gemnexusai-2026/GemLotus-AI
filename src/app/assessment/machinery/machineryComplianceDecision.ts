export type MachineryComplianceDecision =
  | "PASS"
  | "CONDITIONAL"
  | "BLOCKED";

export type MachineryComplianceInput = {
  overallScore: number;
  criticalFindings: number;
  openFindings: number;
  blockers: string[];
  decision: string;
};

export type MachineryComplianceResult = {
  decision: MachineryComplianceDecision;
  canProceed: boolean;
  blockers: string[];
  warnings: string[];
  summary: string;
};

export function evaluateMachineryCompliance(
  input: MachineryComplianceInput,
): MachineryComplianceResult {
  const blockers = [...input.blockers];
  const warnings: string[] = [];

  if (input.criticalFindings > 0) {
    blockers.push(
      input.criticalFindings +
        " critical finding(s) remain open.",
    );
  }

  if (input.openFindings > 0 && blockers.length === 0) {
    warnings.push(
      input.openFindings +
        " open finding(s) remain for corrective action.",
    );
  }

  if (blockers.length > 0) {
    return {
      decision: "BLOCKED",
      canProceed: false,
      blockers,
      warnings,
      summary:
        "Machinery assessment is blocked until identified findings and assessment blockers are resolved.",
    };
  }

  if (
    input.decision === "conditional" ||
    input.openFindings > 0 ||
    input.overallScore < 70
  ) {
    return {
      decision: "CONDITIONAL",
      canProceed: true,
      blockers,
      warnings,
      summary:
        "Machinery assessment may proceed conditionally, subject to closure of outstanding corrective actions.",
    };
  }

  return {
    decision: "PASS",
    canProceed: true,
    blockers,
    warnings,
    summary:
      "Machinery assessment satisfies the current module-level decision gates.",
  };
}
