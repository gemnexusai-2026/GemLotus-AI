"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AssessmentSidebarProps = {
  assessmentId?: string;
};

type NavItem = {
  number: string;
  label: string;
  description: string;
  href: string;
  icon: keyof typeof ICONS;
};

const NAVIGATION: NavItem[] = [
  {
    number: "01",
    label: "Command Center",
    description: "Assessment overview",
    href: "/assessment",
    icon: "dashboard",
  },
  {
    number: "02",
    label: "Company",
    description: "Legal & organization",
    href: "/assessment/company",
    icon: "building",
  },
  {
    number: "03",
    label: "Factory",
    description: "Infrastructure verification",
    href: "/assessment/factory",
    icon: "factory",
  },
  {
    number: "04",
    label: "Machinery",
    description: "Production capability",
    href: "/assessment/machinery",
    icon: "machine",
  },
  {
    number: "05",
    label: "Products",
    description: "Product verification",
    href: "/assessment/products",
    icon: "box",
  },
  {
    number: "06",
    label: "Evidence",
    description: "Document intelligence",
    href: "/assessment/evidence",
    icon: "document",
  },
  {
    number: "07",
    label: "Checklist",
    description: "Assessment requirements",
    href: "/assessment/checklist",
    icon: "checklist",
  },
  {
    number: "08",
    label: "Scoring",
    description: "Readiness intelligence",
    href: "/assessment/scoring",
    icon: "chart",
  },
  {
    number: "09",
    label: "Report",
    description: "Final assessment report",
    href: "/assessment/report",
    icon: "report",
  },
];

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),

  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M16 9h2a2 2 0 0 1 2 2v10" />
      <path d="M8 7h4M8 11h4M8 15h4M8 19h4" />
      <path d="M3 21h18" />
    </svg>
  ),

  factory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 21V9l6 4V9l6 4V5h6v16" />
      <path d="M3 21h18" />
      <path d="M7 17h2M12 17h2M17 17h2" />
    </svg>
  ),

  machine: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L7.3 8.6 9 7l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19 8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),

  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </svg>
  ),

  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5M8 12h8M8 16h6" />
    </svg>
  ),

  checklist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M9 5h10M9 12h10M9 19h10" />
      <path d="m4 5 1.5 1.5L8 4M4 12l1.5 1.5L8 11M4 19l1.5 1.5L8 18" />
    </svg>
  ),

  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),

  report: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5M8 13h8M8 17h5" />
    </svg>
  ),
};

function isActive(pathname: string, href: string) {
  if (href === "/assessment") {
    return pathname === "/assessment";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AssessmentSidebar({
  assessmentId,
}: AssessmentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-[310px] lg:shrink-0">
      <div className="fixed left-0 top-0 flex h-screen w-[310px] flex-col overflow-hidden border-r border-white/[0.08] bg-[#040b18]/95 backdrop-blur-2xl">

        {/* =====================================================
            BRAND
        ====================================================== */}

        <div className="relative border-b border-white/[0.08] px-6 pb-6 pt-7">

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/[0.08] blur-[70px]" />

          <div className="relative flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.12] to-blue-500/[0.08] shadow-[0_0_35px_rgba(34,211,238,0.12)]">

              <div className="absolute inset-2 rounded-lg bg-cyan-300/[0.05]" />

              <span className="relative h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,1)]" />

            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">
                GemLotus AI
              </div>

              <div className="mt-1 text-[15px] font-semibold tracking-tight text-white">
                Assessment OS
              </div>
            </div>

          </div>

          {/* Intelligence status */}

          <div className="mt-6 rounded-2xl border border-cyan-300/[0.12] bg-gradient-to-br from-cyan-300/[0.07] to-blue-500/[0.025] p-4">

            <div className="flex items-center justify-between">

              <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/30">
                Assessment Intelligence
              </span>

              <span className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,.9)]" />
                Live
              </span>

            </div>

            <div className="mt-3 text-[11px] font-medium text-white/65">
              Evidence-first assessment engine
            </div>

            <div className="mt-2 text-[8px] leading-4 text-white/25">
              Definition, evidence, rules and readiness intelligence
              connected.
            </div>

          </div>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <div className="mb-3 px-3 text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
            Assessment Workspace
          </div>

          <nav className="space-y-1.5">

            {NAVIGATION.map((item) => {

              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={
                    assessmentId && item.href !== "/assessment"
                      ? `${item.href}?assessmentId=${assessmentId}`
                      : item.href
                  }
                  className={`group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                    active
                      ? "border-cyan-300/[0.18] bg-gradient-to-r from-cyan-300/[0.10] via-blue-500/[0.05] to-transparent text-white shadow-[inset_3px_0_0_rgba(103,232,249,.9)]"
                      : "border-transparent text-white/40 hover:border-white/[0.07] hover:bg-white/[0.035] hover:text-white/75"
                  }`}
                >

                  {/* Active glow */}

                  {active && (
                    <div className="pointer-events-none absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-cyan-300/[0.10] blur-xl" />
                  )}

                  {/* Number */}

                  <span
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[8px] font-bold ${
                      active
                        ? "border border-cyan-300/[0.15] bg-cyan-300/[0.09] text-cyan-200"
                        : "bg-white/[0.035] text-white/25 group-hover:text-cyan-200/70"
                    }`}
                  >
                    {item.number}
                  </span>

                  {/* Icon */}

                  <span
                    className={`flex h-4 w-4 shrink-0 ${
                      active
                        ? "text-cyan-200"
                        : "text-white/25 group-hover:text-white/60"
                    }`}
                  >
                    <span className="[&>svg]:h-full [&>svg]:w-full [&>svg]:stroke-[1.6]">
                      {ICONS[item.icon]}
                    </span>
                  </span>

                  {/* Text */}

                  <div className="min-w-0 flex-1">

                    <div
                      className={`text-[11px] font-semibold ${
                        active
                          ? "text-white"
                          : "text-white/50 group-hover:text-white/80"
                      }`}
                    >
                      {item.label}
                    </div>

                    <div
                      className={`mt-0.5 truncate text-[7px] ${
                        active
                          ? "text-cyan-100/40"
                          : "text-white/20"
                      }`}
                    >
                      {item.description}
                    </div>

                  </div>

                  {/* Active indicator */}

                  {active && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_9px_rgba(103,232,249,.9)]" />
                  )}

                </Link>
              );
            })}

          </nav>

          {/* ===================================================
              FRAMEWORK
          ==================================================== */}

          <div className="mt-7 border-t border-white/[0.07] pt-6">

            <div className="mb-3 px-3 text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
              Assessment Framework
            </div>

            <div className="space-y-2">

              <div className="rounded-xl border border-blue-400/[0.12] bg-blue-400/[0.035] p-3.5">

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/[0.08] text-blue-200">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <circle cx="9" cy="20" r="1" />
                      <circle cx="20" cy="20" r="1" />
                      <path d="M3 4h2l2.5 11h11L21 8H6" />
                    </svg>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-white/65">
                      GeM
                    </div>
                    <div className="mt-0.5 text-[7px] text-white/25">
                      Government e-Marketplace
                    </div>
                  </div>

                </div>

              </div>

              <div className="rounded-xl border border-emerald-400/[0.12] bg-emerald-400/[0.035] p-3.5">

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-200">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M4 20V6l7 4V6l7 4V4h3v16" />
                      <path d="M3 20h19" />
                    </svg>

                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-white/65">
                      RITES
                    </div>
                    <div className="mt-0.5 text-[7px] text-white/25">
                      Procurement & capability
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* ===================================================
              SYSTEM STATUS
          ==================================================== */}

          <div className="mt-7 border-t border-white/[0.07] pt-6">

            <div className="mb-3 px-3 text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
              System Status
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

              {[
                ["Definition Engine", "CONNECTED"],
                ["Evidence Engine", "READY"],
                ["Rule Engine", "ACTIVE"],
                ["Database", "ONLINE"],
              ].map(([label, status]) => (

                <div
                  key={label}
                  className="flex items-center justify-between py-2"
                >

                  <span className="text-[8px] text-white/35">
                    {label}
                  </span>

                  <span className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-300/75">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_7px_rgba(52,211,153,.8)]" />

                    {status}

                  </span>

                </div>

              ))}

            </div>
          </div>

        </div>

        {/* =====================================================
            BOTTOM USER / ASSESSMENT
        ====================================================== */}

        <div className="border-t border-white/[0.08] bg-[#030914]/80 p-4">

          {assessmentId && (
            <div className="mb-3 rounded-xl border border-cyan-300/[0.08] bg-cyan-300/[0.025] px-3 py-2.5">

              <div className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/25">
                Active Assessment
              </div>

              <div className="mt-1 truncate font-mono text-[9px] text-cyan-200/60">
                {assessmentId}
              </div>

            </div>
          )}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.12] to-blue-500/[0.08] text-[10px] font-bold text-cyan-200">
              AI
            </div>

            <div className="min-w-0 flex-1">

              <div className="truncate text-[10px] font-semibold text-white/60">
                Assessment Operator
              </div>

              <div className="mt-0.5 text-[7px] uppercase tracking-[0.16em] text-white/20">
                Authorized Workspace
              </div>

            </div>

            <span
              title="Secure session"
              className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_9px_rgba(52,211,153,.9)]"
            />

          </div>

        </div>

      </div>
    </aside>
  );
}