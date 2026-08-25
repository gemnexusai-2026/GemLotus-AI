"use client";

import { useSearchParams } from "next/navigation";

import CompanyWorkspace from "./CompanyWorkspace";

export default function CompanyPage() {
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
