"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function clean(value: string) {
  return value.trim();
}

function makeSlug(value: string) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createOrganization(
  formData: FormData,
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/organization");
  }

  const name = clean(
    String(formData.get("name") ?? ""),
  );

  if (name.length < 2) {
    return {
      success: false,
      error: "ORGANIZATION_NAME_INVALID",
    };
  }

  if (name.length > 120) {
    return {
      success: false,
      error: "ORGANIZATION_NAME_TOO_LONG",
    };
  }

  const baseSlug = makeSlug(name);

  if (!baseSlug) {
    return {
      success: false,
      error: "ORGANIZATION_SLUG_INVALID",
    };
  }

  let slug = baseSlug;

  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
  }

  const { data, error } = await supabase.rpc(
    "create_organization_with_owner",
    {
      organization_name: name,
      organization_slug: slug,
    },
  );

  if (error || !data) {
    return {
      success: false,
      error: `ORGANIZATION_CREATE_FAILED:${error?.message ?? "Unknown error"}`,
    };
  }

  redirect(`/organization/${data.id}`);
}
