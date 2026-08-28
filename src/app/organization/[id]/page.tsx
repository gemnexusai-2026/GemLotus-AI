import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type OrganizationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrganizationDashboard({
  params,
}: OrganizationPageProps) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`/organization/${id}`)}`,
    );
  }

  const { data: membership, error: membershipError } =
    await supabase
      .from("organization_members")
      .select(
        `
          organization_id,
          role,
          organizations (
            id,
            name,
            slug,
            created_at
          )
        `,
      )
      .eq("organization_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

  if (membershipError) {
    throw new Error(
      `ORGANIZATION_MEMBERSHIP_LOAD_FAILED:${membershipError.message}`,
    );
  }

  if (!membership) {
    notFound();
  }

  const organization = Array.isArray(membership.organizations)
    ? membership.organizations[0]
    : membership.organizations;

  if (!organization) {
    notFound();
  }

  const { count: memberCount, error: memberCountError } =
    await supabase
      .from("organization_members")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("organization_id", id);

  if (memberCountError) {
    throw new Error(
      `ORGANIZATION_MEMBER_COUNT_FAILED:${memberCountError.message}`,
    );
  }

  const {
    data: assessments,
    error: assessmentsError,
  } = await supabase
    .from("assessment_snapshots")
    .select(
      "id, assessment_type, status, payment_status, created_at, created_by",
    )
    .eq("organization_id", id)
    .order("created_at", {
      ascending: false,
    });

  if (assessmentsError) {
    throw new Error(
      `ORGANIZATION_ASSESSMENTS_LOAD_FAILED:${assessmentsError.message}`,
    );
  }

  const assessmentCount = assessments?.length ?? 0;

  const { data: members, error: membersError } =
    await supabase
      .from("organization_members")
      .select(
        `
          id,
          user_id,
          role,
          created_at
        
        `)
      .eq("organization_id", id)
      .order("created_at", {
        ascending: true,
      });

  if (membersError) {
    throw new Error(
      `ORGANIZATION_MEMBERS_LOAD_FAILED:${membersError.message}`,
    );
  }

  return (
    <main className="min-h-screen bg-[#07152f] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/organization"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 hover:text-cyan-200"
            >
              ← Organizations
            </Link>

            <h1 className="mt-3 text-3xl font-semibold">
              {organization.name}
            </h1>

            <p className="mt-2 text-sm text-blue-100/50">
              @{organization.slug}
            </p>
          </div>

          <span className="w-fit rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-200">
            {membership.role}
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100/40">
              Members
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {memberCount ?? 0}
            </p>
          </section>

          <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100/40">
              Assessments
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {assessmentCount}
            </p>
          </section>

          <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100/40">
              Workspace
            </p>
            <p className="mt-3 text-lg font-semibold">
              OEM Assessment OS
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Assessment Workspace
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                OEM Assessment
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/55">
                Start or continue your OEM assessment from the central
                Assessment OS.
              </p>
            </div>

            <Link
              href={`/assessment?organizationId=${id}`}
              className="inline-flex shrink-0 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Open Assessment OS
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Assessments
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Organization Assessments
              </h2>
            </div>

            <span className="text-xs text-blue-100/35">
              {assessmentCount} total
            </span>
          </div>

          {assessmentCount === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-blue-200/10 bg-black/10 p-8 text-center">
              <p className="text-sm text-blue-100/45">
                No assessments have been created for this organization yet.
              </p>

              <Link
                href={`/assessment?organizationId=${id}`}
                className="mt-4 inline-flex rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-300/15"
              >
                Start First Assessment
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {assessments?.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/assessment/company?assessmentId=${assessment.id}`}
                  className="block rounded-xl border border-blue-200/10 bg-[#071a3a] p-4 transition hover:border-cyan-300/25 hover:bg-[#0a2047]"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {assessment.assessment_type === "oem"
                          ? "OEM Assessment"
                          : "Vendor Assessment"}
                      </p>

                      <p className="mt-1 text-xs text-blue-100/35">
                        {new Date(assessment.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                        {assessment.status.replaceAll("_", " ")}
                      </span>

                      <span className="rounded-full border border-amber-300/15 bg-amber-300/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                        {assessment.payment_status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Team
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Organization Members
          </h2>

          <div className="mt-5 space-y-3">
            {members?.map((member) => {
                  return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-blue-200/10 bg-[#071a3a] p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.user_id === user.id ? "You" : "Organization Member"}
                    </p>

                    <p className="mt-1 text-xs text-blue-100/30">
                      {member.user_id === user.id
                        ? "You"
                        : "Team member"}
                    </p>
                  </div>

                  <span className="rounded-full border border-amber-300/15 bg-amber-300/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider capitalize text-amber-200">
                    {member.role}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}






