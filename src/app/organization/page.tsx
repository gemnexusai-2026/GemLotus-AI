import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import CreateOrganizationForm from "./CreateOrganizationForm";

export default async function OrganizationPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/organization");
  }

  const { data: memberships, error } = await supabase
    .from("organization_members")
    .select(
      `
        organization_id,
        role,
        organizations (
          id,
          name,
          slug
        )
      `,
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `ORGANIZATION_LOAD_FAILED:${error.message}`,
    );
  }

  const organizations = (memberships ?? [])
    .map((membership) => {
      const organization = Array.isArray(
        membership.organizations,
      )
        ? membership.organizations[0]
        : membership.organizations;

      if (!organization) {
        return null;
      }

      return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        role: membership.role,
      };
    })
    .filter(
      (
        organization,
      ): organization is {
        id: string;
        name: string;
        slug: string;
        role: string;
      } => organization !== null,
    );

  return (
    <main className="min-h-screen bg-[#07152f] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            GemLotus AI
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Organizations
          </h1>

          <p className="mt-2 text-sm text-blue-100/55">
            Manage your organization workspace and team access.
          </p>
        </div>

        {organizations.length === 0 ? (
          <CreateOrganizationForm />
        ) : (
          <div className="space-y-6">
            <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Your Workspaces
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Organization Access
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {organizations.map((organization) => (
                  <Link
                    key={organization.id}
                    href={`/organization/${organization.id}`}
                    className="rounded-xl border border-blue-200/10 bg-[#071a3a] p-5 transition hover:border-cyan-300/30 hover:bg-[#0a2047]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">
                          {organization.name}
                        </h3>

                        <p className="mt-1 text-xs text-blue-100/40">
                          {organization.slug}
                        </p>
                      </div>

                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold capitalize text-amber-200">
                        {organization.role}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <CreateOrganizationForm />
          </div>
        )}
      </div>
    </main>
  );
}
