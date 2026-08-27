"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import ProductWorkspace from "./ProductWorkspace";

function ProductsPageContent() {
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

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
