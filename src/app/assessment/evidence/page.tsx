"use client";

import { useSearchParams } from "next/navigation";

import EvidenceWorkspace from "./EvidenceWorkspace";

export default function EvidencePage() {
  const searchParams = useSearchParams();

  const assessmentId =
    searchParams.get("assessmentId") ??
    "local-assessment";

  return (
    <EvidenceWorkspace
      assessmentId={assessmentId}
    />
  );
}
