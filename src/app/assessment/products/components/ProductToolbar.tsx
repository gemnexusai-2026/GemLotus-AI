"use client";

import {
  PRODUCT_CATEGORIES,
} from "../product.constants";

import type {
  ProductCategory,
  ProductStatus,
} from "../product.types";

type ProductToolbarProps = {
  search: string;
  categoryFilter: ProductCategory | "all";
  statusFilter: ProductStatus | "all";

  onSearchChange: (value: string) => void;
  onCategoryChange: (
    value: ProductCategory | "all",
  ) => void;
  onStatusChange: (
    value: ProductStatus | "all",
  ) => void;

  onAddProduct: () => void;
};

export default function ProductToolbar({
  search,
  categoryFilter,
  statusFilter,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onAddProduct,
}: ProductToolbarProps) {
  return (
    <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search product, code, model or brand..."
            className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
          />

          <select
            value={categoryFilter}
            onChange={(event) =>
              onCategoryChange(
                event.target.value as ProductCategory | "all",
              )
            }
            className="rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all">
              All Categories
            </option>

            {PRODUCT_CATEGORIES.map(
              (category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ),
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(
                event.target.value as ProductStatus | "all",
              )
            }
            className="rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all">
              All Status
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="active">
              Active
            </option>

            <option value="under_review">
              Under Review
            </option>

            <option value="verified">
              Verified
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={onAddProduct}
          className="w-full shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#031020] transition hover:brightness-110 xl:w-auto"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
}
