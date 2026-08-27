"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import CompanyWorkspace from "./CompanyWorkspace";

function CompanyPageContent() {
  const searchParams = useSearchParams();

  const assessmentId =
    searchParams.get("assessmentId") ??
    "local-assessment";

  return (
    <CompanyWorkspace
      assessmentId={assessmentId}
    />
  );
}

export default function CompanyPage() {
  return (
    <Suspense fallback={null}>
      <CompanyPageContent />
    </Suspense>
  );
}
