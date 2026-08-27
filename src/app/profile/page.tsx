import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import ProfileForm from "./ProfileForm";

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
    .select(
      "id, full_name, avatar_url, phone, created_at, updated_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `PROFILE_LOAD_FAILED:${error.message}`,
    );
  }

  const createdAt = new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
    },
  ).format(new Date(user.created_at));

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

        <ProfileForm
          initialFullName={profile?.full_name ?? ""}
          initialPhone={profile?.phone ?? ""}
          email={user.email ?? ""}
          userId={user.id}
          createdAt={createdAt}
          emailVerified={Boolean(user.email_confirmed_at)}
        />
      </div>
    </main>
  );
}
