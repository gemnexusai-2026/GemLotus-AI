"use client";

import {
  FACTORY_OWNERSHIP_TYPES,
  FACTORY_PREMISES_STATUSES,
} from "../factory.constants";

import type {
  FactoryOwnershipType,
  FactoryPremisesStatus,
  FactoryProfile,
} from "../factory.types";

type FactoryDetailsProps = {
  factory: FactoryProfile;

  onChange: (
    patch: Partial<FactoryProfile>,
  ) => void;
};

export default function FactoryDetails({
  factory,
  onChange,
}: FactoryDetailsProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Factory Identity
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Factory & Premises Details
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Capture the legal, physical and
          operational identity of the manufacturing
          premises.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field
          label="Factory Name"
          value={factory.factoryName}
          onChange={(value) =>
            onChange({
              factoryName: value,
            })
          }
          placeholder="Factory / manufacturing unit name"
        />

        <Select
          label="Ownership Type"
          value={
            factory.ownershipType
          }
          onChange={(value) =>
            onChange({
              ownershipType:
                value as FactoryOwnershipType,
            })
          }
          options={
            FACTORY_OWNERSHIP_TYPES
          }
        />

        <Select
          label="Premises Status"
          value={
            factory.premisesStatus
          }
          onChange={(value) =>
            onChange({
              premisesStatus:
                value as FactoryPremisesStatus,
            })
          }
          options={
            FACTORY_PREMISES_STATUSES
          }
        />

        <Field
          label="Operational Since"
          value={
            factory.operationalSince
          }
          onChange={(value) =>
            onChange({
              operationalSince:
                value,
            })
          }
          placeholder="YYYY"
        />

        <Field
          label="State"
          value={factory.state}
          onChange={(value) =>
            onChange({
              state: value,
            })
          }
          placeholder="State"
        />

        <Field
          label="District"
          value={factory.district}
          onChange={(value) =>
            onChange({
              district: value,
            })
          }
          placeholder="District"
        />

        <Field
          label="Pincode"
          value={factory.pincode}
          onChange={(value) =>
            onChange({
              pincode: value,
            })
          }
          placeholder="Pincode"
        />

        <div className="grid min-w-0 grid-cols-[1fr_1.5fr] gap-3">
          <Select
            label="Area Unit"
            value={factory.areaUnit}
            onChange={(value) =>
              onChange({
                areaUnit:
                  value as
                    | "sqft"
                    | "sqm",
              })
            }
            options={[
              {
                value: "sqft",
                label: "Sq. Ft.",
              },
              {
                value: "sqm",
                label: "Sq. M.",
              },
            ]}
          />

          <Field
            label="Total Area"
            value={
              factory.totalArea
            }
            onChange={(value) =>
              onChange({
                totalArea: value,
              })
            }
            placeholder="Total premises area"
          />
        </div>

        <Field
          label="Manufacturing Area"
          value={
            factory.manufacturingArea
          }
          onChange={(value) =>
            onChange({
              manufacturingArea:
                value,
            })
          }
          placeholder="Production / manufacturing area"
        />

        <div className="sm:col-span-2">
          <TextArea
            label="Registered Address"
            value={
              factory.registeredAddress
            }
            onChange={(value) =>
              onChange({
                registeredAddress:
                  value,
              })
            }
            placeholder="Registered company address"
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Factory Address"
            value={
              factory.factoryAddress
            }
            onChange={(value) =>
              onChange({
                factoryAddress:
                  value,
              })
            }
            placeholder="Complete manufacturing premises address"
          />
        </div>

        <div className="sm:col-span-2">
          <InfrastructureFields
            factory={factory}
            onChange={onChange}
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Assessment Remarks"
            value={factory.remarks}
            onChange={(value) =>
              onChange({
                remarks: value,
              })
            }
            placeholder="General factory and premises assessment remarks..."
          />
        </div>
      </div>
    </section>
  );
}

function InfrastructureFields({
  factory,
  onChange,
}: {
  factory: FactoryProfile;
  onChange: (
    patch: Partial<FactoryProfile>,
  ) => void;
}) {
  const infrastructure =
    factory.infrastructure;

  function updateInfrastructure(
    patch: Partial<
      FactoryProfile["infrastructure"]
    >,
  ) {
    onChange({
      infrastructure: {
        ...infrastructure,
        ...patch,
      },
    });
  }

  const checks = [
    {
      key: "rawMaterialStorage",
      label: "Raw Material Storage",
    },
    {
      key: "finishedGoodsStorage",
      label: "Finished Goods Storage",
    },
    {
      key: "qualityInspectionArea",
      label: "Quality Inspection Area",
    },
    {
      key: "maintenanceArea",
      label: "Maintenance Area",
    },
    {
      key: "loadingUnloadingArea",
      label: "Loading / Unloading Area",
    },
    {
      key: "workerFacilitiesAvailable",
      label: "Worker Facilities",
    },
    {
      key: "layoutAvailable",
      label: "Layout Available",
    },
    {
      key: "layoutVerified",
      label: "Layout Verified",
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
      <div className="mb-4">
        <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
          Infrastructure Profile
        </div>

        <p className="mt-2 text-[9px] leading-5 text-white/20">
          Record physical areas and core
          infrastructure available at the factory.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label="Production Area"
          value={
            infrastructure.productionArea
          }
          onChange={(value) =>
            updateInfrastructure({
              productionArea:
                value,
            })
          }
          placeholder="Area"
        />

        <Field
          label="Storage Area"
          value={
            infrastructure.storageArea
          }
          onChange={(value) =>
            updateInfrastructure({
              storageArea: value,
            })
          }
          placeholder="Area"
        />

        <Field
          label="Office Area"
          value={
            infrastructure.officeArea
          }
          onChange={(value) =>
            updateInfrastructure({
              officeArea: value,
            })
          }
          placeholder="Area"
        />

        <Field
          label="Total Built-up Area"
          value={
            infrastructure.totalBuiltUpArea
          }
          onChange={(value) =>
            updateInfrastructure({
              totalBuiltUpArea:
                value,
            })
          }
          placeholder="Area"
        />

        <Field
          label="Floor Count"
          value={
            infrastructure.floorCount
          }
          onChange={(value) =>
            updateInfrastructure({
              floorCount: value,
            })
          }
          placeholder="Number of floors"
        />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {checks.map((check) => {
          const checked =
            infrastructure[
              check.key
            ];

          return (
            <button
              key={check.key}
              type="button"
              onClick={() =>
                updateInfrastructure({
                  [check.key]:
                    !checked,
                })
              }
              className={`flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                checked
                  ? "border-emerald-300/15 bg-emerald-300/[0.04]"
                  : "border-white/[0.06] bg-white/[0.015]"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[9px] font-bold ${
                  checked
                    ? "border-emerald-300/25 text-emerald-300"
                    : "border-white/[0.10] text-white/20"
                }`}
              >
                {checked
                  ? "✓"
                  : ""}
              </span>

              <span className="min-w-0 truncate text-[9px] text-white/40">
                {check.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <TextArea
          label="Infrastructure Remarks"
          value={
            infrastructure.remarks
          }
          onChange={(value) =>
            updateInfrastructure({
              remarks: value,
            })
          }
          placeholder="Infrastructure observations..."
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        className="w-full min-w-0 rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#071426] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        rows={3}
        className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}
