"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import EvidenceWorkspace from "./EvidenceWorkspace";

function EvidencePageContent() {
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

export default function EvidencePage() {
  return (
    <Suspense fallback={null}>
      <EvidencePageContent />
    </Suspense>
  );
}
