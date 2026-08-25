"use client";

import {
  COMPANY_ENTITY_TYPES,
  COMPANY_LEGAL_STATUSES,
} from "../company.constants";

import type {
  CompanyLegalProfile,
  CompanyEntityType,
  CompanyLegalStatus,
} from "../company.types";

type CompanyDetailsProps = {
  company: CompanyLegalProfile;

  onChange: (
    patch: Partial<CompanyLegalProfile>,
  ) => void;
};

export default function CompanyDetails({
  company,
  onChange,
}: CompanyDetailsProps) {
  return (
    <section className="min-w-0 rounded-[24px] border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] p-5">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
          Legal Identity
        </div>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Company Details
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          Capture the core legal identity,
          registration details and operating
          addresses of the assessed organization.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field
          label="Legal Company Name"
          value={company.legalName}
          onChange={(value) =>
            onChange({
              legalName: value,
            })
          }
          placeholder="Registered legal name"
        />

        <Field
          label="Trade Name"
          value={company.tradeName}
          onChange={(value) =>
            onChange({
              tradeName: value,
            })
          }
          placeholder="Brand / trade name"
        />

        <Select
          label="Entity Type"
          value={company.entityType}
          onChange={(value) =>
            onChange({
              entityType:
                value as CompanyEntityType,
            })
          }
          options={COMPANY_ENTITY_TYPES}
        />

        <Select
          label="Legal Status"
          value={company.legalStatus}
          onChange={(value) =>
            onChange({
              legalStatus:
                value as CompanyLegalStatus,
            })
          }
          options={COMPANY_LEGAL_STATUSES}
        />

        <Field
          label="PAN Number"
          value={company.panNumber}
          onChange={(value) =>
            onChange({
              panNumber: value,
            })
          }
          placeholder="PAN"
        />

        <Field
          label="GST Number"
          value={company.gstNumber}
          onChange={(value) =>
            onChange({
              gstNumber: value,
            })
          }
          placeholder="GSTIN"
        />

        <Field
          label="Udyam Number"
          value={company.udyamNumber}
          onChange={(value) =>
            onChange({
              udyamNumber: value,
            })
          }
          placeholder="Udyam registration number"
        />

        <Field
          label="Incorporation / Registration Number"
          value={
            company.incorporationNumber
          }
          onChange={(value) =>
            onChange({
              incorporationNumber:
                value,
            })
          }
          placeholder="Registration number"
        />

        <Field
          label="Year of Establishment"
          value={
            company.yearOfEstablishment
          }
          onChange={(value) =>
            onChange({
              yearOfEstablishment:
                value,
            })
          }
          placeholder="YYYY"
        />

        <Field
          label="State"
          value={company.state}
          onChange={(value) =>
            onChange({
              state: value,
            })
          }
          placeholder="State"
        />

        <Field
          label="District"
          value={company.district}
          onChange={(value) =>
            onChange({
              district: value,
            })
          }
          placeholder="District"
        />

        <Field
          label="Pincode"
          value={company.pincode}
          onChange={(value) =>
            onChange({
              pincode: value,
            })
          }
          placeholder="Pincode"
        />

        <div className="sm:col-span-2">
          <TextArea
            label="Registered Address"
            value={
              company.registeredAddress
            }
            onChange={(value) =>
              onChange({
                registeredAddress:
                  value,
              })
            }
            placeholder="Registered office address"
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Factory / Manufacturing Address"
            value={
              company.factoryAddress
            }
            onChange={(value) =>
              onChange({
                factoryAddress:
                  value,
              })
            }
            placeholder="Manufacturing / factory address"
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Assessment Remarks"
            value={company.remarks}
            onChange={(value) =>
              onChange({
                remarks: value,
              })
            }
            placeholder="General company/legal assessment remarks"
          />
        </div>
      </div>
    </section>
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
    <label className="block">
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
