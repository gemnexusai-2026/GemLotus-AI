"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface UpdateProfileInput {
  fullName: string;
  phone: string;
}

function clean(value: string) {
  return value.trim();
}

export async function updateProfile(
  input: UpdateProfileInput,
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "AUTHENTICATION_REQUIRED",
    };
  }

  const fullName = clean(input.fullName);
  const phone = clean(input.phone);

  if (!fullName) {
    return {
      success: false,
      error: "FULL_NAME_REQUIRED",
    };
  }

  if (fullName.length > 120) {
    return {
      success: false,
      error: "FULL_NAME_TOO_LONG",
    };
  }

  if (phone && phone.length > 30) {
    return {
      success: false,
      error: "PHONE_TOO_LONG",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    );

  if (error) {
    return {
      success: false,
      error: `PROFILE_UPDATE_FAILED:${error.message}`,
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
  };
}
