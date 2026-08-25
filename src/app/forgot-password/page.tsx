"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const redirectTo =
  `${window.location.origin}/reset-password`;

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        },
      );

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(
      "If an account exists for this email, a secure password reset link has been sent. Please check your inbox.",
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07152f] text-white">
      <div className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

        {/* =====================================================
            ENTERPRISE AMBIENT BACKGROUND
            ===================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-[-15%] top-[-20%] h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-[120px]" />

          <div className="absolute right-[-12%] top-[5%] h-[460px] w-[460px] rounded-full bg-cyan-400/10 blur-[120px]" />

          <div className="absolute bottom-[-25%] left-[25%] h-[520px] w-[520px] rounded-full bg-blue-600/15 blur-[140px]" />

          <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#07152f] to-transparent" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

        </div>

        {/* =====================================================
            PASSWORD RECOVERY EXPERIENCE
            ===================================================== */}

        <section className="relative z-10 w-full max-w-[470px]">

          {/* BRAND */}

          <div className="mb-7 text-center">

            <div className="inline-flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/15 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.9)]" />
              </div>

              <span className="text-sm font-semibold tracking-[0.16em] text-white">
                GEMLOTUS
                <span className="ml-1 text-cyan-300">
                  AI
                </span>
              </span>

            </div>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
              Secure Account Recovery
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Reset your password
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-blue-100/55">
              Enter your registered email address and we&apos;ll
              send you a secure password reset link.
            </p>

          </div>

          {/* =====================================================
              ENTERPRISE GLASS CARD
              ===================================================== */}

          <div className="relative overflow-hidden rounded-[28px] border border-blue-300/20 bg-[#102754]/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

            <div className="relative">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/55"
                  >
                    Registered Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-blue-200/15 bg-[#071a3a]/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-blue-100/25 hover:border-blue-200/25 focus:border-cyan-300/60 focus:bg-[#092047] focus:ring-2 focus:ring-cyan-300/10"
                  />
                </div>

                {/* ERROR */}

                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* SUCCESS */}

                {successMessage && (
                  <div
                    role="status"
                    className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm leading-6 text-cyan-100"
                  >
                    {successMessage}
                  </div>
                )}

                {/* SEND RESET LINK */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-orange-200/30 bg-[#ffbd78] px-4 py-3.5 text-sm font-semibold text-[#142342] shadow-[0_10px_30px_rgba(255,189,120,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ffc98f] hover:shadow-[0_14px_35px_rgba(255,189,120,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {loading
                      ? "Sending reset link..."
                      : "Send Reset Link"}
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                </button>

              </form>

              {/* TRUST MESSAGE */}

              <div className="mt-6 rounded-xl border border-blue-200/10 bg-blue-300/[0.04] px-4 py-3">
                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08]">
                    <span className="text-xs text-cyan-300">
                      ✓
                    </span>
                  </div>

                  <p className="text-xs leading-5 text-blue-100/40">
                    For your security, we do not reveal whether
                    an email address is registered with GemLotus AI.
                  </p>

                </div>
              </div>

              {/* BACK TO LOGIN */}

              <div className="mt-7 text-center text-sm text-blue-100/45">

                Remember your password?{" "}

                <Link
                  href="/login"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Sign in
                </Link>

              </div>

              {/* CREATE ACCOUNT */}

              <div className="mt-3 text-center text-sm text-blue-100/30">

                Don&apos;t have an account?{" "}

                <Link
                  href="/signup"
                  className="font-semibold text-blue-100/65 transition hover:text-white"
                >
                  Create account
                </Link>

              </div>

            </div>
          </div>

          {/* SECURITY */}

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-blue-100/35">

            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />

            Secure password recovery powered by Supabase

          </div>

          <div className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-blue-100/20">
            GemLotus Intelligence Platform
          </div>

        </section>
      </div>
    </main>
  );
}