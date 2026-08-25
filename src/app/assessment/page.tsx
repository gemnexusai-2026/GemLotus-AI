import Link from "next/link";
import { redirect } from "next/navigation";

import { createAssessmentRepository } from "@/repositories/assessmentRepository";
import { StartAssessmentButton } from "@/components/assessment/StartAssessmentButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AssessmentSidebar from "@/components/assessment/AssessmentSidebar";

const assessmentPaths = [
  {
    code: "01",
    shortCode: "OEM",
    title: "OEM / Manufacturer",
    framework: "GeM + RITES",
    category: "Manufacturing & Product",
    description:
      "For manufacturers, OEMs and own-brand production organizations requiring company, factory, machinery, product and evidence verification.",
    coverage: [
      "Company & Legal",
      "Factory & Infrastructure",
      "Machinery & Production",
      "Products & Specifications",
      "Quality & Testing",
      "Evidence & Readiness",
    ],
    status: "LIVE",
    active: true,
    accent: "cyan",
  },
  {
    code: "02",
    shortCode: "SELL",
    title: "Authorized Seller / Distributor",
    framework: "GeM",
    category: "Seller & Channel",
    description:
      "For authorized sellers, distributors, dealers, resellers and channel partners representing OEM products.",
    coverage: [
      "Authorization",
      "OEM Relationship",
      "Product Portfolio",
      "Seller Evidence",
      "Commercial Compliance",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "blue",
  },
  {
    code: "03",
    shortCode: "SERV",
    title: "Service Provider",
    framework: "GeM + RITES",
    category: "Professional & Technical Services",
    description:
      "For technical, professional, operational and specialized service organizations requiring capability and experience assessment.",
    coverage: [
      "Organization Capability",
      "Personnel",
      "Experience",
      "Technical Resources",
      "Past Performance",
      "Evidence",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "violet",
  },
  {
    code: "04",
    shortCode: "WORK",
    title: "Works / Contractor",
    framework: "RITES",
    category: "Works & Execution",
    description:
      "For works contractors, EPC organizations and project execution agencies involved in infrastructure and engineering delivery.",
    coverage: [
      "Projects",
      "Execution Capability",
      "Manpower",
      "Plant & Equipment",
      "Financial Capability",
      "Compliance",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "amber",
  },
  {
    code: "05",
    shortCode: "PMC",
    title: "Consultancy / PMC",
    framework: "RITES",
    category: "Consultancy",
    description:
      "For engineering consultants, project management consultants and specialist professional firms.",
    coverage: [
      "Technical Expertise",
      "Professional Team",
      "Project Experience",
      "Methodology",
      "Deliverables",
      "Credentials",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "emerald",
  },
  {
    code: "06",
    shortCode: "ARCH",
    title: "Architecture / Planning / Design",
    framework: "RITES",
    category: "Design & Planning",
    description:
      "For architectural, planning, urban design and related professional organizations delivering specialized design services.",
    coverage: [
      "Professional Credentials",
      "Design Team",
      "Project Portfolio",
      "Technical Capability",
      "Deliverables",
      "Experience",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "pink",
  },
  {
    code: "07",
    shortCode: "GEO",
    title: "Survey / Geospatial",
    framework: "RITES",
    category: "Survey & Geospatial",
    description:
      "For topographic, hydrographic, traffic, travel and specialist survey organizations.",
    coverage: [
      "Survey Equipment",
      "Technical Personnel",
      "Projects",
      "GIS / Geospatial Capability",
      "Field Capability",
      "Technical Evidence",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "cyan",
  },
  {
    code: "08",
    shortCode: "GEOT",
    title: "Geotechnical / Investigation",
    framework: "RITES",
    category: "Investigation",
    description:
      "For geotechnical investigation, soil investigation and specialist technical investigation agencies.",
    coverage: [
      "Investigation Equipment",
      "Laboratory Capability",
      "Technical Experts",
      "Field Operations",
      "Reports",
      "Technical Evidence",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "orange",
  },
  {
    code: "09",
    shortCode: "QAQC",
    title: "Inspection / Testing / Quality",
    framework: "RITES",
    category: "Quality & Testing",
    description:
      "For inspection bodies, testing laboratories, QA/QC organizations and specialist technical quality providers.",
    coverage: [
      "Accreditation",
      "Testing Equipment",
      "Personnel",
      "Procedures",
      "Laboratory Capability",
      "Quality Records",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "green",
  },
  {
    code: "10",
    shortCode: "LOG",
    title: "Logistics / Freight",
    framework: "RITES",
    category: "Logistics & Transportation",
    description:
      "For freight forwarding, transportation, logistics and specialized operational agencies.",
    coverage: [
      "Fleet",
      "Operations",
      "Licenses",
      "Personnel",
      "Safety",
      "Past Experience",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "blue",
  },
  {
    code: "11",
    shortCode: "SPEC",
    title: "Specialized Expertise",
    framework: "RITES / OTHER",
    category: "Specialized Vendor",
    description:
      "For specialized vendor and professional domains requiring a dedicated assessment framework and domain-specific evidence model.",
    coverage: [
      "Domain Expertise",
      "Credentials",
      "Specialized Resources",
      "Experience",
      "Technical Evidence",
      "Capability",
    ],
    status: "FRAMEWORK READY",
    active: false,
    accent: "violet",
  },
] as const;

const navigation = [
  ["01", "Command Center", "/assessment"],
  ["02", "Company", "/assessment/company"],
  ["03", "Factory", "/assessment/factory"],
  ["04", "Products", "/assessment/products"],
  ["05", "Evidence", "/assessment/evidence"],
  ["06", "Checklist", "/assessment/checklist"],
  ["07", "Readiness", "/assessment/readiness"],
];

export default async function AssessmentPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent("/assessment")}`,
    );
  }

  const repository = createAssessmentRepository();
  const entityTypes = await repository.getEntityTypes();

  const initial =
    user.email?.charAt(0).toUpperCase() || "G";

  const liveEntity =
    entityTypes.find((entity) =>
      entity.code.toLowerCase().includes("oem"),
    ) ?? entityTypes[0];

  const liveCount = assessmentPaths.filter(
    (item) => item.active,
  ).length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#06142f] text-white">
      {/* =====================================================
          GLOBAL ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-72 -top-72 h-[720px] w-[720px] rounded-full bg-blue-600/[0.16] blur-[150px]" />

        <div className="absolute right-[-240px] top-[8%] h-[650px] w-[650px] rounded-full bg-cyan-400/[0.10] blur-[150px]" />

        <div className="absolute bottom-[-300px] left-[28%] h-[700px] w-[700px] rounded-full bg-indigo-500/[0.08] blur-[160px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(59,130,246,0.12),transparent_42%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      </div>

      <div className="relative flex min-h-screen">
        {/* =====================================================
            SIDEBAR
        ====================================================== */}

<AssessmentSidebar assessmentId="" />

        {/* =====================================================
            MAIN
        ====================================================== */}

        <div className="min-w-0 flex-1">
          {/* TOP BAR */}

          <header className="sticky top-0 z-40 flex h-[74px] items-center justify-between border-b border-white/[0.08] bg-[#071a3b]/75 px-5 backdrop-blur-2xl sm:px-7 lg:px-10">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-300/55">
                GemLotus Intelligence
              </div>

              <div className="mt-1 text-sm font-semibold text-white/85">
                Assessment Command Center
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.04] px-3 py-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />

                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-200/70">
                  Secure Session
                </span>
              </div>

              <div className="hidden text-right md:block">
                <div className="text-[10px] text-white/50">
                  {user.email}
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] text-xs font-bold text-cyan-200">
                {initial}
              </div>

              <Link
                href="/logout"
                className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35 transition hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-200"
              >
                Logout
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-[1680px] px-5 py-7 sm:px-7 lg:px-10 lg:py-10">
            {/* ==================================================
                HERO
            =================================================== */}

            <section className="relative overflow-hidden rounded-[32px] border border-blue-300/10 bg-gradient-to-br from-[#102f6d]/80 via-[#0a214b]/75 to-[#061631]/90 p-7 shadow-[0_30px_120px_rgba(0,0,0,0.28)] sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-44 -top-44 h-[560px] w-[560px] rounded-full bg-blue-500/[0.18] blur-[120px]" />

              <div className="pointer-events-none absolute right-[20%] bottom-[-240px] h-[480px] w-[480px] rounded-full bg-cyan-400/[0.07] blur-[120px]" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-200">
                    Assessment Intelligence
                  </span>

                  <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-cyan-200/60">
                    GeM + RITES
                  </span>
                </div>

                <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[64px]">
                  Start with the right
                  <span className="block bg-gradient-to-r from-cyan-200 via-blue-200 to-white bg-clip-text text-transparent">
                    assessment pathway.
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-blue-100/55 lg:text-[15px]">
                  GemLotus AI classifies your organization against the
                  applicable procurement and capability framework, then
                  resolves the assessment definition, evidence model,
                  checklist and readiness journey.
                </p>

                <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["01", "Classify", "Choose business pathway"],
                    ["02", "Resolve", "Apply assessment definition"],
                    ["03", "Evidence", "Build verifiable evidence"],
                    ["04", "Readiness", "Measure assessment readiness"],
                  ].map(([number, title, text]) => (
                    <div
                      key={number}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                    >
                      <div className="text-[8px] font-bold tracking-[0.18em] text-cyan-300/60">
                        {number}
                      </div>

                      <div className="mt-2 text-sm font-semibold text-white/75">
                        {title}
                      </div>

                      <div className="mt-1 text-[9px] leading-4 text-white/25">
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ==================================================
                SYSTEM METRICS
            =================================================== */}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Assessment Pathways"
                value="11"
                sub="Defined ecosystem pathways"
              />

              <MetricCard
                label="Live Pathways"
                value={String(liveCount).padStart(2, "0")}
                sub="Currently connected to engine"
              />

              <MetricCard
                label="Definition Engine"
                value={String(entityTypes.length).padStart(2, "0")}
                sub="Database-backed definitions"
              />

              <MetricCard
                label="Evidence Model"
                value="READY"
                sub="Evidence-first architecture"
              />
            </section>

            {/* ==================================================
                PATH SELECTOR
            =================================================== */}

            <section className="mt-12">
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-300">
                    Step 01
                  </span>

                  <span className="h-px w-8 bg-cyan-300/20" />

                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                    Organization Classification
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Select your assessment pathway
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/30">
                  Choose the pathway that most accurately represents the
                  organization, service model or technical capability being
                  assessed.
                </p>
              </div>

              {/* GeM */}

              <FrameworkHeader
                title="GeM"
                subtitle="Government e-Marketplace ecosystem"
                description="Vendor, OEM, seller and service-oriented assessment pathways."
              />

              <div className="mt-5 grid gap-5 xl:grid-cols-3">
                {assessmentPaths
                  .filter(
                    (path) =>
                      path.framework === "GeM" ||
                      path.framework === "GeM + RITES",
                  )
                  .map((path) => (
                    <AssessmentPathCard
                      key={path.code}
                      path={path}
                      entityTypes={entityTypes}
                      liveEntity={liveEntity}
                    />
                  ))}
              </div>

              {/* RITES */}

              <div className="mt-12">
                <FrameworkHeader
                  title="RITES"
                  subtitle="Procurement & professional capability ecosystem"
                  description="Works, consultancy, engineering, survey, investigation, quality and specialized capability pathways."
                />

                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {assessmentPaths
                    .filter(
                      (path) =>
                        path.framework !== "GeM" &&
                        path.framework !== "GeM + RITES",
                    )
                    .map((path) => (
                      <AssessmentPathCard
                        key={path.code}
                        path={path}
                        entityTypes={entityTypes}
                        liveEntity={liveEntity}
                      />
                    ))}
                </div>
              </div>
            </section>

            {/* ==================================================
                ENGINE STATUS
            =================================================== */}

            <section className="mt-12 grid gap-5 lg:grid-cols-3">
              <EngineCard
                number="01"
                title="Definition Resolution"
                description="The selected pathway is resolved against the canonical assessment definition layer."
                status="CONNECTED"
              />

              <EngineCard
                number="02"
                title="Evidence Intelligence"
                description="Assessment evidence remains structured, traceable and aligned with the applicable pathway."
                status="READY"
              />

              <EngineCard
                number="03"
                title="Readiness Intelligence"
                description="The assessment journey is designed to convert evidence into measurable readiness."
                status="READY"
              />
            </section>

            {/* ==================================================
                FOUNDATION
            =================================================== */}

            <section className="mt-12 overflow-hidden rounded-[24px] border border-cyan-300/10 bg-gradient-to-r from-cyan-400/[0.045] via-blue-500/[0.025] to-transparent">
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05]">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white/75">
                      Canonical Assessment Definition Foundation
                    </div>

                    <div className="mt-1 max-w-3xl text-[10px] leading-5 text-white/25">
                      Pathways, assessment definitions, rules, checklist
                      structures, evidence requirements and readiness logic
                      remain database-driven and version controlled.
                    </div>
                  </div>
                </div>

                <div className="shrink-0 rounded-full border border-emerald-300/10 bg-emerald-300/[0.035] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-200/60">
                  ● Definition Engine Connected
                </div>
              </div>
            </section>

            <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] py-6 text-[8px] uppercase tracking-[0.2em] text-white/15 sm:flex-row sm:items-center sm:justify-between">
              <span>
                GemLotus AI • Assessment Intelligence Platform
              </span>

              <span>
                Foundation v1 • Secure Assessment Workspace
              </span>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ================================================================
   METRIC CARD
================================================================ */

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition hover:border-cyan-300/15 hover:bg-white/[0.035]">
      <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/25">
        {label}
      </div>

      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>

      <div className="mt-1 text-[9px] text-white/25">
        {sub}
      </div>
    </div>
  );
}

/* ================================================================
   FRAMEWORK HEADER
================================================================ */

function FrameworkHeader({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-200/70">
          {title}
        </div>

        <div className="mt-1 text-xs font-medium text-white/55">
          {subtitle}
        </div>
      </div>

      <div className="hidden h-px flex-1 bg-gradient-to-r from-cyan-300/15 via-blue-300/10 to-transparent sm:block" />

      <div className="hidden max-w-md text-right text-[9px] leading-4 text-white/20 lg:block">
        {description}
      </div>
    </div>
  );
}

/* ================================================================
   ASSESSMENT PATH CARD
================================================================ */

function AssessmentPathCard({
  path,
  entityTypes,
  liveEntity,
}: {
  path: (typeof assessmentPaths)[number];
  entityTypes: Awaited<
    ReturnType<
      ReturnType<
        typeof createAssessmentRepository
      >["getEntityTypes"]
    >
  >;
  liveEntity:
    | Awaited<
        ReturnType<
          ReturnType<
            typeof createAssessmentRepository
          >["getEntityTypes"]
        >
      >[number]
    | undefined;
}) {
  const matchingEntity =
    path.code === "01"
      ? entityTypes.find((entity) =>
          entity.code
            .toLowerCase()
            .includes("oem"),
        ) ?? liveEntity
      : null;

  const isLive = path.active && Boolean(matchingEntity);

  return (
    <div
      className={`group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-300 ${
        isLive
          ? "border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.07] via-blue-500/[0.035] to-white/[0.015] shadow-[0_25px_80px_rgba(0,100,255,0.10)] hover:-translate-y-1 hover:border-cyan-300/35"
          : "border-white/[0.075] bg-white/[0.018] hover:-translate-y-0.5 hover:border-blue-300/15 hover:bg-white/[0.025]"
      }`}
    >
      {/* Glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.055] blur-3xl transition group-hover:bg-cyan-400/[0.09]" />

      <div className="relative">
        {/* Top */}

        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] text-[10px] font-bold text-cyan-200">
            {path.shortCode}
          </div>

          <div className="text-right">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.16em] ${
                isLive
                  ? "border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200"
                  : "border-white/[0.08] bg-white/[0.025] text-white/25"
              }`}
            >
              {path.status}
            </span>

            <div className="mt-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/20">
              {path.code}
            </div>
          </div>
        </div>

        {/* Classification */}

        <div className="mt-6 flex items-center gap-2">
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-cyan-300/55">
            {path.category}
          </span>

          <span className="h-1 w-1 rounded-full bg-white/15" />

          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/20">
            {path.framework}
          </span>
        </div>

        {/* Title */}

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
          {path.title}
        </h3>

        {/* Description */}

        <p className="mt-3 min-h-[84px] text-[12px] leading-6 text-white/30">
          {path.description}
        </p>

        {/* Coverage */}

        <div className="mt-5 rounded-2xl border border-white/[0.055] bg-black/[0.12] p-4">
          <div className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/20">
            Assessment Coverage
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {path.coverage.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/[0.055] bg-white/[0.025] px-2 py-1.5 text-[8px] text-white/35"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/20">
              Assessment Route
            </div>

            <div className="mt-1 text-[9px] text-white/35">
              {isLive
                ? "Connected to definition engine"
                : "Architecture prepared"}
            </div>
          </div>

          {isLive && matchingEntity ? (
            <StartAssessmentButton
              entityTypeCode={matchingEntity.code}
            />
          ) : (
            <span className="shrink-0 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/25">
              Coming Online
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   ENGINE CARD
================================================================ */

function EngineCard({
  number,
  title,
  description,
  status,
}: {
  number: string;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-cyan-300/15">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04] text-[8px] font-bold text-cyan-200/60">
          {number}
        </div>

        <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-emerald-300/60">
          ● {status}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-semibold text-white/70">
        {title}
      </h3>

      <p className="mt-2 text-[10px] leading-5 text-white/25">
        {description}
      </p>
    </div>
  );
}