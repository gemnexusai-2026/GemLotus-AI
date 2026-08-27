"use client";

import { useState, useTransition } from "react";

import {
  updateProfile,
  type UpdateProfileInput,
} from "./actions";

interface ProfileFormProps {
  initialFullName: string;
  initialPhone: string;
  email: string;
  userId: string;
  createdAt: string;
  emailVerified: boolean;
}

export default function ProfileForm({
  initialFullName,
  initialPhone,
  email,
  userId,
  createdAt,
  emailVerified,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(null);
    setError(null);

    const input: UpdateProfileInput = {
      fullName,
      phone,
    };

    startTransition(async () => {
      const result = await updateProfile(input);

      if (!result.success) {
        setError(result.error ?? "PROFILE_UPDATE_FAILED");
        return;
      }

      setMessage("Profile updated successfully.");
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Personal Information
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Profile Details
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-blue-100/75"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              maxLength={120}
              required
              autoComplete="name"
              className="w-full rounded-xl border border-blue-200/15 bg-[#071a3a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-blue-100/30 focus:border-cyan-300/50"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-blue-100/75"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-blue-200/10 bg-[#071a3a]/60 px-4 py-3 text-sm text-blue-100/50"
            />

            <p className="mt-2 text-xs text-blue-100/40">
              Email changes are managed through account security.
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-blue-100/75"
            >
              Mobile Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              maxLength={30}
              autoComplete="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-xl border border-blue-200/15 bg-[#071a3a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-blue-100/30 focus:border-cyan-300/50"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
            >
              Unable to update profile. Please try again.
            </div>
          )}

          {message && (
            <div
              role="status"
              className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Account Information
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
              Verification
            </p>
            <p className="mt-2 text-sm text-white">
              {emailVerified ? "Email Verified" : "Email Not Verified"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
              Account Created
            </p>
            <p className="mt-2 text-sm text-white">
              {createdAt}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
              User ID
            </p>
            <p className="mt-2 break-all font-mono text-xs text-blue-100/50">
              {userId}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
