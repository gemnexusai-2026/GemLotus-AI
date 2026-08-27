import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, phone, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`PROFILE_LOAD_FAILED:${error.message}`);
  }

  return (
    <main className="min-h-screen bg-[#07152f] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            GemLotus AI
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-blue-100/55">
            Manage your identity information and account details.
          </p>
        </div>

        <section className="rounded-2xl border border-blue-200/15 bg-[#102754]/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
                Full Name
              </p>
              <p className="mt-2 text-sm text-white">
                {profile?.full_name || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
                Email
              </p>
              <p className="mt-2 break-all text-sm text-white">
                {user.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
                Phone
              </p>
              <p className="mt-2 text-sm text-white">
                {profile?.phone || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
                User ID
              </p>
              <p className="mt-2 break-all font-mono text-xs text-blue-100/60">
                {user.id}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
