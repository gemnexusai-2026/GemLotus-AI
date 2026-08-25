"use client";

import type {
  ProductCategory,
  ProductRecord,
  OwnershipType,
} from "../product.types";

import {
  PRODUCT_CATEGORIES,
} from "../product.constants";

type ProductFormProps = {
  product: ProductRecord;
  mode: "create" | "edit";

  onChange: (
    patch: Partial<ProductRecord>,
  ) => void;

  onSave: () => void;
  onCancel: () => void;
};

const OWNERSHIP_OPTIONS: {
  value: OwnershipType;
  label: string;
}[] = [
  {
    value: "manufactured",
    label: "Manufactured",
  },
  {
    value: "assembled",
    label: "Assembled",
  },
  {
    value: "outsourced",
    label: "Outsourced",
  },
  {
    value: "traded",
    label: "Traded",
  },
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
        {required && (
          <span className="ml-1 text-cyan-300">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}

export default function ProductForm({
  product,
  mode,
  onChange,
  onSave,
  onCancel,
}: ProductFormProps) {
  return (
    <section className="rounded-[24px] border border-cyan-300/[0.10] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Product Definition
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          {mode === "create"
            ? "Add Product"
            : "Edit Product"}
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Define the product identity and declared
          manufacturing information before moving
          into technical verification.
        </p>
      </div>

      <div className="p-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field
            label="Product Code"
            value={product.productCode}
            onChange={(value) =>
              onChange({
                productCode: value,
              })
            }
            placeholder="e.g. PT-001"
            required
          />

          <Field
            label="Product Name"
            value={product.productName}
            onChange={(value) =>
              onChange({
                productName: value,
              })
            }
            placeholder="Product name"
            required
          />

          <label className="block">
            <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Product Category
              <span className="ml-1 text-cyan-300">
                *
              </span>
            </span>

            <select
              value={product.productCategory}
              onChange={(event) =>
                onChange({
                  productCategory:
                    event.target
                      .value as ProductCategory,
                })
              }
              className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
            >
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
          </label>

          <Field
            label="Brand Name"
            value={product.brandName}
            onChange={(value) =>
              onChange({
                brandName: value,
              })
            }
            placeholder="Brand"
          />

          <Field
            label="Model Number"
            value={product.modelNumber}
            onChange={(value) =>
              onChange({
                modelNumber: value,
              })
            }
            placeholder="Model / variant"
          />

          <Field
            label="SKU"
            value={product.sku}
            onChange={(value) =>
              onChange({
                sku: value,
              })
            }
            placeholder="SKU / internal code"
          />

          <label className="block">
            <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Ownership / Production Mode
            </span>

            <select
              value={product.ownershipType}
              onChange={(event) =>
                onChange({
                  ownershipType:
                    event.target
                      .value as OwnershipType,
                })
              }
              className="w-full rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
            >
              {OWNERSHIP_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <Field
            label="Manufacturing Location"
            value={
              product.manufacturingLocation
            }
            onChange={(value) =>
              onChange({
                manufacturingLocation:
                  value,
              })
            }
            placeholder="Factory / production location"
            required
          />

          <Field
            label="Manufacturing Process"
            value={
              product.manufacturingProcess
            }
            onChange={(value) =>
              onChange({
                manufacturingProcess:
                  value,
              })
            }
            placeholder="Primary manufacturing process"
          />
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Product Description
              <span className="ml-1 text-cyan-300">
                *
              </span>
            </span>

            <textarea
              value={product.description}
              onChange={(event) =>
                onChange({
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe the product, intended use and major characteristics..."
              rows={4}
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.07] bg-black/[0.12] p-4">
            <input
              type="checkbox"
              checked={
                product.productPhotoAvailable
              }
              onChange={(event) =>
                onChange({
                  productPhotoAvailable:
                    event.target.checked,
                })
              }
              className="h-4 w-4 accent-cyan-300"
            />

            <span className="text-[9px] font-semibold text-white/60">
              Product Photograph Available
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.07] bg-black/[0.12] p-4">
            <input
              type="checkbox"
              checked={
                product.catalogAvailable
              }
              onChange={(event) =>
                onChange({
                  catalogAvailable:
                    event.target.checked,
                })
              }
              className="h-4 w-4 accent-cyan-300"
            />

            <span className="text-[9px] font-semibold text-white/60">
              Product Catalog Available
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.07] bg-black/[0.12] p-4">
            <input
              type="checkbox"
              checked={
                product.technicalDocumentsAvailable
              }
              onChange={(event) =>
                onChange({
                  technicalDocumentsAvailable:
                    event.target.checked,
                })
              }
              className="h-4 w-4 accent-cyan-300"
            />

            <span className="text-[9px] font-semibold text-white/60">
              Technical Documents Available
            </span>
          </label>
        </div>

        <div className="mt-5">
          <Field
            label="Remarks"
            value={product.remarks}
            onChange={(value) =>
              onChange({
                remarks: value,
              })
            }
            placeholder="Additional product remarks"
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/[0.08] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white/45 transition hover:bg-white/[0.04] hover:text-white/70"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#031020] transition hover:brightness-110"
          >
            {mode === "create"
              ? "Create Product"
              : "Save Product"}
          </button>
        </div>
      </div>
    </section>
  );
}
