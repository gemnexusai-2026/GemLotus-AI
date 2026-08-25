"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getSafeNextPath(): string {
  const next = new URLSearchParams(window.location.search).get("next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/assessment";
  }

  return next;
}

export default function SignupPage() {
  const supabase = createSupabaseBrowserClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSignup(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Password and confirm password do not match.",
      );
      return;
    }

    setLoading(true);

    const redirectTo =
      `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        getSafeNextPath(),
      )}`;

    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName.trim(),
          },
        },
      });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message);
      return;
    }

    if (data.user && !data.session) {
      setLoading(false);

      setSuccessMessage(
        "Account created. Please check your email and verify your account before signing in.",
      );

      return;
    }

    setSuccessMessage(
      "Account created successfully. Opening Assessment OS...",
    );

    window.location.assign(getSafeNextPath());
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const redirectTo =
      `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        getSafeNextPath(),
      )}`;

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

    if (error) {
      setGoogleLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07152f] text-white">
      <div className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

        {/* =====================================================
            AMBIENT LANDING-PAGE BACKGROUND
            ===================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-[-15%] top-[-20%] h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-[120px]" />

          <div className="absolute right-[-12%] top-[5%] h-[460px] w-[460px] rounded-full bg-cyan-400/10 blur-[120px]" />

          <div className="absolute bottom-[-25%] left-[25%] h-[520px] w-[520px] rounded-full bg-blue-600/15 blur-[140px]" />

          <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#07152f] to-transparent" />

          {/* subtle grid */}
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
            MAIN AUTH PANEL
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
                <span className="ml-1 text-cyan-300">AI</span>
              </span>

            </div>

            <h1 className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your account
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-blue-100/55">
              Turn your business evidence into intelligence
              and build your assessment workspace.
            </p>

          </div>

          {/* =====================================================
              CARD
              ===================================================== */}

          <div className="relative overflow-hidden rounded-[28px] border border-blue-300/20 bg-[#102754]/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">

            {/* Card glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

            <div className="relative">

              {/* FORM */}

              <form
                onSubmit={handleSignup}
                className="space-y-5"
              >

                {/* FULL NAME */}

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/55"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-blue-200/15 bg-[#071a3a]/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-blue-100/25 hover:border-blue-200/25 focus:border-cyan-300/60 focus:bg-[#092047] focus:ring-2 focus:ring-cyan-300/10"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/55"
                  >
                    Email Address
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

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/55"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-blue-200/15 bg-[#071a3a]/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-blue-100/25 hover:border-blue-200/25 focus:border-cyan-300/60 focus:bg-[#092047] focus:ring-2 focus:ring-cyan-300/10"
                  />
                </div>

                {/* CONFIRM PASSWORD */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/55"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Re-enter your password"
                    className="w-full rounded-xl border border-blue-200/15 bg-[#071a3a]/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-blue-100/25 hover:border-blue-200/25 focus:border-cyan-300/60 focus:bg-[#092047] focus:ring-2 focus:ring-cyan-300/10"
                  />
                </div>

                {/* ERROR */}

                {errorMessage && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200">
                    {errorMessage}
                  </div>
                )}

                {/* SUCCESS */}

                {successMessage && (
                  <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm leading-6 text-cyan-100">
                    {successMessage}
                  </div>
                )}

                {/* CREATE ACCOUNT */}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-orange-200/30 bg-[#ffbd78] px-4 py-3.5 text-sm font-semibold text-[#142342] shadow-[0_10px_30px_rgba(255,189,120,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ffc98f] hover:shadow-[0_14px_35px_rgba(255,189,120,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {loading
                      ? "Creating account..."
                      : "Create Account"}
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                </button>

              </form>

              {/* DIVIDER */}

              <div className="my-6 flex items-center gap-4">

                <div className="h-px flex-1 bg-blue-200/10" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-blue-100/30">
                  Or continue with
                </span>

                <div className="h-px flex-1 bg-blue-200/10" />

              </div>

              {/* GOOGLE */}

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-blue-200/15 bg-blue-300/[0.06] px-4 py-3.5 text-sm font-medium text-blue-50/80 transition hover:border-blue-200/30 hover:bg-blue-300/[0.10] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#4285F4]">
                  G
                </span>

                {googleLoading
                  ? "Connecting..."
                  : "Continue with Google"}

              </button>

              {/* LOGIN */}

              <div className="mt-7 text-center text-sm text-blue-100/45">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Sign in
                </Link>

              </div>

            </div>
          </div>

          {/* =====================================================
              SECURITY
              ===================================================== */}

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-blue-100/35">

            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />

            Secure account creation powered by Supabase

          </div>

          {/* FOOTER */}

          <div className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-blue-100/20">
            GemLotus Intelligence Platform
          </div>

        </section>
      </div>
    </main>
  );
}