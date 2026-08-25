"use client";

import {
  useMemo,
  useState,
} from "react";

import AssessmentSidebar from "@/components/assessment/AssessmentSidebar";

import ProductHeader from "./components/ProductHeader";
import ProductToolbar from "./components/ProductToolbar";
import ProductSummaryCards from "./components/ProductSummaryCards";
import ProductRegister from "./components/ProductRegister";
import ProductForm from "./components/ProductForm";
import ProductDetails from "./components/ProductDetails";
import ProductSpecifications from "./components/ProductSpecifications";
import ProductEvidence from "./components/ProductEvidence";
import ProductVerification from "./components/ProductVerification";
import ProductQualityTesting from "./components/ProductQualityTesting";
import ProductFindings from "./components/ProductFindings";
import ProductDecisionPanel from "./components/ProductDecisionPanel";

import {
  evaluateProductCompliance,
} from "./productComplianceDecision";

import {
  createInitialProduct,
} from "./product.factory";

import {
  calculateProductReadiness,
} from "./product.readiness";

import type {
  ProductCategory,
  ProductRecord,
  ProductStatus,
} from "./product.types";

type ProductWorkspaceProps = {
  assessmentId: string;
  initialProducts?: ProductRecord[];
};

export default function ProductWorkspace({
  assessmentId,
  initialProducts = [],
}: ProductWorkspaceProps) {
  const [products, setProducts] =
    useState<ProductRecord[]>(
      initialProducts,
    );

  const [selectedProductId, setSelectedProductId] =
    useState<string | null>(
      initialProducts[0]?.id ?? null,
    );

  const [showForm, setShowForm] =
    useState(false);

  const [formMode, setFormMode] =
    useState<"create" | "edit">(
      "create",
    );

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<ProductCategory | "all">(
      "all",
    );

  const [statusFilter, setStatusFilter] =
    useState<ProductStatus | "all">(
      "all",
    );

  const selectedProduct =
    products.find(
      (product) =>
        product.id ===
        selectedProductId,
    ) ?? null;

  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !query ||
            [
              product.productCode,
              product.productName,
              product.brandName,
              product.modelNumber,
              product.sku,
            ]
              .join(" ")
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            categoryFilter === "all" ||
            product.productCategory ===
              categoryFilter;

          const matchesStatus =
            statusFilter === "all" ||
            product.productStatus ===
              statusFilter;

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          );
        },
      );
    }, [
      products,
      search,
      categoryFilter,
      statusFilter,
    ]);

  const summary = useMemo(() => {
    const verified =
      products.filter(
        (product) =>
          product.verification
            .verificationStatus ===
          "verified",
      ).length;

    const evidenceComplete =
      products.filter(
        (product) =>
          product.evidence.length > 0 &&
          product.evidence.every(
            (item) =>
              item.status ===
              "verified",
          ),
      ).length;

    const specificationVerified =
      products.filter(
        (product) =>
          product.specifications.length > 0 &&
          product.specifications.every(
            (item) =>
              item.verificationStatus ===
              "verified",
          ),
      ).length;

    const openFindings =
      products.reduce(
        (total, product) =>
          total +
          product.findings.filter(
            (finding) =>
              finding.correctiveActionStatus !==
              "closed",
          ).length,
        0,
      );

    return {
      totalProducts: products.length,

      activeProducts:
        products.filter(
          (product) =>
            product.productStatus ===
            "active",
        ).length,

      verifiedProducts: verified,

      evidenceComplete,

      specificationVerified,

      openFindings,
    };
  }, [products]);

  const readiness = useMemo(() => {
    if (!selectedProduct) {
      return {
        score: 0,
        level: "not_ready" as const,
        strengths: [],
        gaps: [],
        blockers: [],
        recommendation:
          "Select a product to begin the assessment.",
      };
    }

    return calculateProductReadiness(
      selectedProduct,
    );
  }, [selectedProduct]);

  const compliance = useMemo(() => {
    if (!selectedProduct) {
      return {
        decision: "hold" as const,
        canProceed: false,
        reasons: [
          "No product selected.",
        ],
        blockers: [
          "Select or create a product.",
        ],
        requiredActions: [
          "Complete product assessment.",
        ],
      };
    }

    return evaluateProductCompliance(
      selectedProduct,
    );
  }, [selectedProduct]);

  const completion =
    products.length === 0
      ? 0
      : Math.round(
          (products.filter(
            (product) =>
              product.productName &&
              product.productCode,
          ).length /
            products.length) *
            100,
        );

  const risk =
    selectedProduct
      ? compliance.decision ===
        "rejected"
        ? "High"
        : compliance.decision ===
            "hold"
          ? "Medium"
          : "Low"
      : "Unknown";

  function openCreateForm() {
    setFormMode("create");
    setShowForm(true);
  }

  function openEditForm() {
    if (!selectedProduct) {
      return;
    }

    setFormMode("edit");
    setShowForm(true);
  }

  function handleSaveProduct() {
    if (formMode === "create") {
      const product =
        createInitialProduct();

      setProducts((current) => [
        ...current,
        product,
      ]);

      setSelectedProductId(
        product.id,
      );

      setShowForm(false);

      return;
    }

    setShowForm(false);
  }

  function updateSelectedProduct(
    patch: Partial<ProductRecord>,
  ) {
    if (!selectedProductId) {
      return;
    }

    setProducts((current) =>
      current.map((product) =>
        product.id ===
        selectedProductId
          ? {
              ...product,
              ...patch,
              updatedAt:
                new Date().toISOString(),
            }
          : product,
      ),
    );
  }

  function deleteProduct(
    productId: string,
  ) {
    setProducts((current) =>
      current.filter(
        (product) =>
          product.id !== productId,
      ),
    );

    if (
      selectedProductId ===
      productId
    ) {
      setSelectedProductId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#030914] text-white">
      <div className="flex min-h-screen">
        <AssessmentSidebar
          assessmentId={assessmentId}
        />

        <div className="min-w-0 flex-1">
          <ProductHeader
            productCount={
              summary.totalProducts
            }
            completion={completion}
            readiness={readiness.score}
            risk={risk}
          />

          <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <ProductToolbar
              search={search}
              categoryFilter={
                categoryFilter
              }
              statusFilter={
                statusFilter
              }
              onSearchChange={setSearch}
              onCategoryChange={
                setCategoryFilter
              }
              onStatusChange={
                setStatusFilter
              }
              onAddProduct={
                openCreateForm
              }
            />

            <ProductSummaryCards
              totalProducts={
                summary.totalProducts
              }
              activeProducts={
                summary.activeProducts
              }
              verifiedProducts={
                summary.verifiedProducts
              }
              evidenceComplete={
                summary.evidenceComplete
              }
              specificationVerified={
                summary.specificationVerified
              }
              openFindings={
                summary.openFindings
              }
            />

            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
              <ProductRegister
                products={
                  filteredProducts
                }
                selectedProductId={
                  selectedProductId
                }
                onSelectProduct={
                  setSelectedProductId
                }
                onDeleteProduct={
                  deleteProduct
                }
                onAddProduct={
                  openCreateForm
                }
              />

              <div className="min-w-0">
                {selectedProduct ? (
                  <div className="space-y-6">
                    <ProductDetails
                      product={
                        selectedProduct
                      }
                    />

                    <ProductVerification
                      product={
                        selectedProduct
                      }
                      onChange={(
                        verification,
                      ) =>
                        updateSelectedProduct({
                          verification,
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center">
                    <div className="text-sm font-semibold text-white/45">
                      No Product Selected
                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-white/25">
                      Select a product from the
                      register or create a new
                      product assessment.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedProduct && (
              <div className="mt-6 space-y-6">
                <ProductSpecifications
                  product={
                    selectedProduct
                  }
                  onChange={(
                    specifications,
                  ) =>
                    updateSelectedProduct({
                      specifications,
                    })
                  }
                />

                <ProductEvidence
                  productId={
                    selectedProduct.id
                  }
                  evidence={
                    selectedProduct.evidence
                  }
                  onChange={(evidence) =>
                    updateSelectedProduct({
                      evidence,
                    })
                  }
                />

                <ProductQualityTesting
                  product={
                    selectedProduct
                  }
                  onChange={(
                    qualityTesting,
                  ) =>
                    updateSelectedProduct({
                      qualityTesting,
                    })
                  }
                />

                <ProductFindings
                  product={
                    selectedProduct
                  }
                  onChange={(findings) =>
                    updateSelectedProduct({
                      findings,
                    })
                  }
                />

                <ProductDecisionPanel
                  readiness={readiness}
                  compliance={compliance}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      openEditForm
                    }
                    className="rounded-xl border border-white/[0.08] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white/45 transition hover:bg-white/[0.04] hover:text-white/70"
                  >
                    Edit Product
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      })
                    }
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#031020] transition hover:brightness-110"
                  >
                    Back To Top
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-md sm:px-6 lg:px-10">
          <div className="mx-auto flex min-h-full w-full max-w-[1500px] items-start justify-center py-6 lg:py-10">
            <div className="w-full">
              <ProductForm
                product={
                  formMode === "edit" &&
                  selectedProduct
                    ? selectedProduct
                    : createInitialProduct()
                }
                mode={formMode}
                onChange={(
                  patch,
                ) => {
                  if (
                    formMode === "edit"
                  ) {
                    updateSelectedProduct(
                      patch,
                    );
                  }
                }}
                onSave={
                  handleSaveProduct
                }
                onCancel={() =>
                  setShowForm(false)
                }
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


