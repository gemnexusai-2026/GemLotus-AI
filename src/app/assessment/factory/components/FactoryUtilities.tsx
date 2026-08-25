"use client";

import type {
  FactoryProfile,
  FactoryUtility,
  FactoryUtilityStatus,
} from "../factory.types";

type FactoryUtilitiesProps = {
  factory: FactoryProfile;

  onChange: (
    patch: Partial<FactoryProfile>,
  ) => void;
};

export default function FactoryUtilities({
  factory,
  onChange,
}: FactoryUtilitiesProps) {
  const utilities =
    factory.infrastructure.utilities;

  function updateUtility(
    id: string,
    patch: Partial<FactoryUtility>,
  ) {
    onChange({
      infrastructure: {
        ...factory.infrastructure,

        utilities:
          utilities.map(
            (utility) =>
              utility.id === id
                ? {
                    ...utility,
                    ...patch,
                  }
                : utility,
          ),
      },
    });
  }

  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Factory Utilities
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Utilities & Service Infrastructure
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Verify availability, capacity, source and
          evidence for essential factory utilities.
        </p>
      </div>

      <div className="space-y-4 p-5">
        {utilities.map(
          (utility, index) => (
            <UtilityCard
              key={utility.id}
              utility={utility}
              index={index}
              onChange={(patch) =>
                updateUtility(
                  utility.id,
                  patch,
                )
              }
            />
          ),
        )}

        {utilities.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.12] p-8 text-center">
            <div className="text-sm font-semibold text-white/40">
              No Utilities Registered
            </div>

            <p className="mt-2 text-[10px] text-white/20">
              Add utility records from the factory
              data model.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function UtilityCard({
  utility,
  index,
  onChange,
}: {
  utility: FactoryUtility;
  index: number;

  onChange: (
    patch: Partial<FactoryUtility>,
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
            Utility {String(index + 1).padStart(2, "0")}
          </div>

          <h3 className="mt-1 text-sm font-semibold text-white/70">
            {utility.utilityName}
          </h3>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              verified:
                !utility.verified,
            })
          }
          className={`rounded-full border px-4 py-2 text-[8px] font-bold uppercase tracking-[0.12em] transition ${
            utility.verified
              ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-300"
              : "border-white/[0.08] bg-white/[0.02] text-white/35"
          }`}
        >
          {utility.verified
            ? "Verified"
            : "Not Verified"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Select
          label="Availability"
          value={utility.status}
          onChange={(value) =>
            onChange({
              status:
                value as FactoryUtilityStatus,
            })
          }
          options={[
            {
              value: "available",
              label: "Available",
            },
            {
              value:
                "partially_available",
              label: "Partially Available",
            },
            {
              value: "not_available",
              label: "Not Available",
            },
            {
              value: "not_applicable",
              label: "Not Applicable",
            },
          ]}
        />

        <Field
          label="Capacity"
          value={utility.capacity}
          onChange={(value) =>
            onChange({
              capacity: value,
            })
          }
          placeholder="e.g. 100 KVA"
        />

        <Field
          label="Source"
          value={utility.source}
          onChange={(value) =>
            onChange({
              source: value,
            })
          }
          placeholder="Source / provider"
        />
      </div>

      <div className="mt-4">
        <Field
          label="Evidence Reference"
          value={
            utility.evidenceReference
          }
          onChange={(value) =>
            onChange({
              evidenceReference:
                value,
            })
          }
          placeholder="Bill / certificate / inspection evidence"
        />
      </div>

      <div className="mt-4">
        <TextArea
          label="Remarks"
          value={utility.remarks}
          onChange={(value) =>
            onChange({
              remarks: value,
            })
          }
          placeholder="Utility assessment observations..."
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
        {options.map(
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
        rows={2}
        className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
      />
    </label>
  );
}
