import { notFound, redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import CompanyWorkspace from "./CompanyWorkspace";

type CompanyPageProps = {
  searchParams: Promise<{
    assessmentId?: string;
  }>;
};

export default async function CompanyPage({
  searchParams,
}: CompanyPageProps) {
  const { assessmentId } = await searchParams;

  if (!assessmentId) {
    redirect("/assessment");
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/assessment/company?assessmentId=${assessmentId}`,
      )}`,
    );
  }

  const { data: assessment, error } = await supabase
    .from("assessment_snapshots")
    .select(
      "id, organization_id, created_by, assessment_type, status",
    )
    .eq("id", assessmentId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `ASSESSMENT_ACCESS_CHECK_FAILED:${error.message}`,
    );
  }

  if (!assessment) {
    notFound();
  }

  if (
    assessment.assessment_type !== "oem" &&
    assessment.created_by !== user.id
  ) {
    notFound();
  }

  return (
    <CompanyWorkspace
      assessmentId={assessment.id}
    />
  );
}
