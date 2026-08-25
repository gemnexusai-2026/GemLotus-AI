"use client";

import type { ProductRecord } from "../product.types";

type ProductDetailsProps = {
  product: ProductRecord;
};

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/[0.12] p-4">
      <div className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/25">
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-medium text-white/70">
        {value || "Not specified"}
      </div>
    </div>
  );
}

function BooleanStatus({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/[0.12] px-4 py-3">
      <span className="text-[9px] text-white/45">
        {label}
      </span>

      <span
        className={`text-[8px] font-bold uppercase tracking-[0.12em] ${
          value
            ? "text-emerald-300"
            : "text-red-300/70"
        }`}
      >
        {value ? "Available" : "Missing"}
      </span>
    </div>
  );
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Product Intelligence
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Product Details
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Review the declared identity,
          manufacturing context and supporting
          product documentation.
        </p>
      </div>

      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Info
            label="Product Code"
            value={product.productCode}
          />

          <Info
            label="Product Name"
            value={product.productName}
          />

          <Info
            label="Category"
            value={product.productCategory}
          />

          <Info
            label="Brand"
            value={product.brandName}
          />

          <Info
            label="Model Number"
            value={product.modelNumber}
          />

          <Info
            label="SKU"
            value={product.sku}
          />

          <Info
            label="Production Mode"
            value={product.ownershipType}
          />

          <Info
            label="Manufacturing Location"
            value={
              product.manufacturingLocation
            }
          />

          <Info
            label="Manufacturing Process"
            value={
              product.manufacturingProcess
            }
          />
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
          <div className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/25">
            Product Description
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/55">
            {product.description ||
              "No product description has been recorded."}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <BooleanStatus
            label="Product Photograph"
            value={
              product.productPhotoAvailable
            }
          />

          <BooleanStatus
            label="Product Catalog"
            value={
              product.catalogAvailable
            }
          />

          <BooleanStatus
            label="Technical Documents"
            value={
              product.technicalDocumentsAvailable
            }
          />
        </div>

        <div className="mt-5">
          <div className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/25">
            Remarks
          </div>

          <p className="mt-2 text-[10px] leading-5 text-white/35">
            {product.remarks ||
              "No additional remarks recorded."}
          </p>
        </div>
      </div>
    </section>
  );
}
