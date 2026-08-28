"use client";

import { useRef, useState, useTransition } from "react";

import { createOrganization } from "./actions";

export default function CreateOrganizationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createOrganization(formData);

      if (!result.success) {
        setError(
          result.error ?? "Unable to create organization.",
        );
        return;
      }

      formRef.current?.reset();
    });
  }

  return (
    <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
        New Workspace
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        Create Organization
      </h2>

      <p className="mt-2 text-sm text-blue-100/55">
        Create your organization workspace. You will automatically
        become its owner.
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        <div>
          <label
            htmlFor="organization-name"
            className="mb-2 block text-sm font-medium text-blue-100/75"
          >
            Organization Name
          </label>

          <input
            id="organization-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="organization"
            placeholder="Purohit Traders"
            className="w-full rounded-xl border border-blue-200/15 bg-[#071a3a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-blue-100/30 focus:border-cyan-300/50"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            Unable to create organization. Please try again.
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending
            ? "Creating Organization..."
            : "Create Organization"}
        </button>
      </form>
    </section>
  );
}
