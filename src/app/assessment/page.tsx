import { createAssessmentRepository } from "@/repositories/assessmentRepository";

export default async function AssessmentPage() {
  const repository = createAssessmentRepository();

  const entityTypes = await repository.getEntityTypes();

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0a0a0a] lg:flex lg:flex-col">

          <div className="border-b border-white/10 px-6 py-6">
            <div className="text-xs uppercase tracking-[0.28em] text-amber-400">
              GemLotus AI
            </div>

            <div className="mt-2 text-lg font-semibold">
              Assessment OS
            </div>

            <div className="mt-1 text-xs text-white/40">
              Intelligence Workspace
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">

            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Workspace
            </div>

            <div className="space-y-1">
              {[
                "Assessment Overview",
                "Company",
                "Factory",
                "Products",
                "Evidence",
                "Checklist",
                "Readiness",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-xl px-3 py-2.5 text-sm transition ${
                    index === 0
                      ? "border border-amber-400/20 bg-amber-400/10 text-amber-300"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">

              <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                System
              </div>

              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-300">
                    Definition Engine Online
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-white/35">
                  Database-driven assessment definitions are connected.
                </p>
              </div>

            </div>
          </nav>

          <div className="border-t border-white/10 px-6 py-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              GemLotus Intelligence
            </div>

            <div className="mt-1 text-xs text-white/50">
              Assessment Definition Foundation
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="min-w-0 flex-1">

          {/* TOP BAR */}
          <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#090909]/90 px-6 backdrop-blur-xl lg:px-8">

            <div>
              <div className="text-xs text-white/35">
                Assessment OS
              </div>

              <div className="mt-0.5 text-sm font-medium text-white/80">
                Intelligence Workspace
              </div>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] text-emerald-300 sm:block">
                SYSTEM ONLINE
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/[0.06] text-xs font-semibold text-amber-300">
                GL
              </div>

            </div>
          </header>

          {/* CONTENT */}
          <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10 lg:py-10">

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.025] to-transparent p-7 lg:p-10">

              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/[0.06] blur-3xl" />

              <div className="relative">

                <div className="mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400">
                    Assessment Intelligence
                  </span>
                </div>

                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Build an assessment from
                  <span className="text-amber-300">
                    {" "}evidence, rules and intelligence.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 lg:text-base">
                  Select the assessment entity to begin. GemLotus AI resolves
                  the applicable OEM subtype, checklist, rules and fee
                  definition from the canonical Assessment Definition
                  Foundation.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                    Database Driven
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                    Versioned Definitions
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                    Evidence Based
                  </div>
                </div>

              </div>
            </section>

            {/* SYSTEM STATUS */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Definition Engine
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">
                    Connected
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Entity Types
                </div>

                <div className="mt-2 text-2xl font-semibold">
                  {entityTypes.length}
                </div>

                <div className="mt-1 text-xs text-white/35">
                  Active definitions
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Resolution
                </div>

                <div className="mt-2 text-sm font-medium text-amber-300">
                  Rule Driven
                </div>

                <div className="mt-1 text-xs text-white/35">
                  Canonical domain engine
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Architecture
                </div>

                <div className="mt-2 text-sm font-medium">
                  Foundation v1
                </div>

                <div className="mt-1 text-xs text-white/35">
                  Immutable definition flow
                </div>
              </div>

            </section>

            {/* ENTITY SELECTION */}
            <section className="mt-10">

              <div className="mb-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400">
                  Step 01
                </div>

                <h2 className="mt-2 text-2xl font-semibold">
                  Select Assessment Entity
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Choose the organization type for which the assessment will
                  be created.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {entityTypes.map((entity) => (
                  <div
                    key={entity.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.04]"
                  >

                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/[0.04] blur-2xl transition group-hover:bg-amber-400/[0.08]" />

                    <div className="relative">

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.06] text-sm font-semibold text-amber-300">
                          GL
                        </div>

                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
                          Active
                        </span>

                      </div>

                      <div className="mt-6 text-[10px] uppercase tracking-[0.18em] text-amber-400/80">
                        {entity.code}
                      </div>

                      <h3 className="mt-2 text-xl font-semibold">
                        {entity.name}
                      </h3>

                      {entity.description && (
                        <p className="mt-3 min-h-[60px] text-sm leading-6 text-white/40">
                          {entity.description}
                        </p>
                      )}

                      <button
                        type="button"
                        className="mt-6 flex w-full items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-4 py-3 text-sm font-medium text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-400/[0.12]"
                      >
                        <span>Start Assessment</span>
                        <span className="text-lg">→</span>
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            </section>

            {/* FOUNDATION FOOTER */}
            <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <div className="text-sm font-medium">
                    Assessment Definition Foundation
                  </div>

                  <div className="mt-1 text-xs text-white/35">
                    Entity types are being resolved from the connected
                    assessment definition database.
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Database Connected
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}