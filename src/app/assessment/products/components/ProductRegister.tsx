"use client";

import type { ProductRecord } from "../product.types";

type ProductRegisterProps = {
  products: ProductRecord[];
  selectedProductId: string | null;
  onSelectProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
};

function StatusBadge({
  status,
}: {
  status: ProductRecord["productStatus"];
}) {
  const label = status.replaceAll("_", " ");

  return (
    <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/45">
      {label}
    </span>
  );
}

export default function ProductRegister({
  products,
  selectedProductId,
  onSelectProduct,
  onDeleteProduct,
  onAddProduct,
}: ProductRegisterProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
              Product Asset Register
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Product Register
            </h2>
          </div>

          <div className="text-[9px] text-white/30">
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}
          </div>
        </div>
      </div>

      <div className="p-4">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.12] p-8 text-center sm:p-10">
            <div className="text-sm font-semibold text-white/45">
              No product records
            </div>

            <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-white/25">
              Add each major product manufactured,
              assembled or otherwise declared by the
              assessed organization.
            </p>

            <button
              type="button"
              onClick={onAddProduct}
              className="mt-5 rounded-xl border border-cyan-300/15 px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-300/[0.05]"
            >
              + Add Product
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const selected =
                product.id ===
                selectedProductId;

              return (
                <div
                  key={product.id}
                  className={`rounded-2xl border p-4 transition ${
                    selected
                      ? "border-cyan-300/20 bg-cyan-300/[0.05]"
                      : "border-white/[0.06] bg-black/[0.12] hover:border-white/[0.10]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onSelectProduct(product.id)
                    }
                    className="w-full text-left"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-cyan-300/50">
                            {product.productCode ||
                              "NO CODE"}
                          </span>

                          <StatusBadge
                            status={
                              product.productStatus
                            }
                          />
                        </div>

                        <div className="mt-2 truncate text-sm font-semibold text-white">
                          {product.productName ||
                            "Unnamed Product"}
                        </div>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-white/30">
                          <span>
                            {product.brandName ||
                              "Brand not specified"}
                          </span>

                          <span>
                            {product.modelNumber ||
                              "Model not specified"}
                          </span>

                          <span>
                            {product.specifications
                              .length}{" "}
                            specifications
                          </span>

                          <span>
                            {product.evidence.length}{" "}
                            evidence
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[360px]">
                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
                            Specs
                          </div>

                          <div className="mt-1 text-xs font-semibold text-white/65">
                            {
                              product
                                .specifications
                                .filter(
                                  (item) =>
                                    item.verificationStatus ===
                                    "verified",
                                ).length
                            }
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
                            Evidence
                          </div>

                          <div className="mt-1 text-xs font-semibold text-white/65">
                            {
                              product.evidence
                                .filter(
                                  (item) =>
                                    item.status ===
                                    "verified",
                                ).length
                            }
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
                            Findings
                          </div>

                          <div className="mt-1 text-xs font-semibold text-white/65">
                            {
                              product.findings
                                .filter(
                                  (item) =>
                                    item.correctiveActionStatus !==
                                    "closed",
                                ).length
                            }
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                          <div className="text-[7px] uppercase tracking-[0.12em] text-white/25">
                            Verification
                          </div>

                          <div className="mt-1 text-xs font-semibold text-white/65">
                            {
                              product
                                .verification
                                .verificationStatus
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  <div className="mt-3 flex justify-end border-t border-white/[0.05] pt-3">
                    <button
                      type="button"
                      onClick={() =>
                        onDeleteProduct(
                          product.id,
                        )
                      }
                      className="text-[8px] font-bold uppercase tracking-[0.12em] text-red-300/60 transition hover:text-red-300"
                    >
                      Remove Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
