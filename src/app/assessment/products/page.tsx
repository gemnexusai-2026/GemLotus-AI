"use client";

import { useSearchParams } from "next/navigation";

import ProductWorkspace from "./ProductWorkspace";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const assessmentId =
    searchParams.get("assessmentId") ??
    "local-assessment";

  return (
    <ProductWorkspace
      assessmentId={assessmentId}
    />
  );
}
