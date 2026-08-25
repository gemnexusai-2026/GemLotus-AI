"use server";

import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  createFactoryAssessmentRepository,
} from "@/repositories/factoryAssessmentRepository";

import {
  calculateFactoryAssessment,
} from "@/lib/assessment/factory/factory-engine";

import type {
  FactoryProfileInput,
} from "@/types/assessment/factory";

import type {
  FactoryDocument,
} from "../factory/factory.types";

export async function
ensureFactoryProfile(
  assessmentId: string,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "AUTHENTICATION_REQUIRED",
    );
  }

  if (!assessmentId) {
    throw new Error(
      "ASSESSMENT_ID_REQUIRED",
    );
  }

  const { data: assessment, error: assessmentError } =
    await supabase
      .from("assessment_snapshots")
      .select("id")
      .eq("id", assessmentId)
      .maybeSingle();

  if (assessmentError) {
    throw new Error(
      `ASSESSMENT_LOAD_FAILED:${assessmentError.message}`,
    );
  }

  if (!assessment) {
    throw new Error(
      "ASSESSMENT_NOT_FOUND",
    );
  }

  const { data: existing, error: existingError } =
    await supabase
      .from(
        "assessment_factory_profiles" as any,
      )
      .select("id")
      .eq(
        "assessment_id",
        assessmentId,
      )
      .maybeSingle();

  if (existingError) {
    throw new Error(
      `FACTORY_PROFILE_LOAD_FAILED:${existingError.message}`,
    );
  }

  if (existing?.id) {
    return String(existing.id);
  }

  const { data: created, error: createError } =
    await supabase
      .from(
        "assessment_factory_profiles" as any,
      )
      .insert({
        assessment_id:
          assessmentId,

        created_by:
          user.id,
      })
      .select("id")
      .single();

  if (createError) {
    throw new Error(
      `FACTORY_PROFILE_CREATE_FAILED:${createError.message}`,
    );
  }

  return String(created.id);
}
export async function
getFactoryProfile(
  assessmentId: string,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/assessment/factory?assessmentId=${assessmentId}`,
      )}`,
    );
  }

  const repository =
    createFactoryAssessmentRepository();

  return repository.getProfile(
    assessmentId,
  );
}

export async function
saveFactoryProfile(
  assessmentId: string,
  input: FactoryProfileInput,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "AUTHENTICATION_REQUIRED",
    );
  }

  if (!assessmentId) {
    throw new Error(
      "ASSESSMENT_ID_REQUIRED",
    );
  }

  const result =
    calculateFactoryAssessment(input);

  const repository =
    createFactoryAssessmentRepository();

  await repository.saveProfile(
    assessmentId,
    user.id,
    input,
  );

  return {
    success: true,
    ...result,
  };
}
export async function
createFactoryEvidence(
  assessmentId: string,
  factoryProfileId: string,
  document: FactoryDocument,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "AUTHENTICATION_REQUIRED",
    );
  }

  if (!assessmentId) {
    throw new Error(
      "ASSESSMENT_ID_REQUIRED",
    );
  }

  let realFactoryProfileId = "";

  const { data: existingProfile, error: profileLoadError } =
    await supabase
      .from(
        "assessment_factory_profiles" as any,
      )
      .select("id")
      .eq(
        "assessment_id",
        assessmentId,
      )
      .maybeSingle();

  if (profileLoadError) {
    throw new Error(
      `FACTORY_PROFILE_LOAD_FAILED:${profileLoadError.message}`,
    );
  }

  if (existingProfile?.id) {
    realFactoryProfileId =
      String(existingProfile.id);
  } else {
    const { data: createdProfile, error: profileCreateError } =
      await supabase
        .from(
          "assessment_factory_profiles" as any,
        )
        .insert({
          assessment_id:
            assessmentId,

          created_by:
            user.id,
        })
        .select("id")
        .single();

    if (profileCreateError) {
      throw new Error(
        `FACTORY_PROFILE_CREATE_FAILED:${profileCreateError.message}`,
      );
    }

    realFactoryProfileId =
      String(createdProfile.id);
  }

  if (!realFactoryProfileId) {
    throw new Error(
      "FACTORY_PROFILE_ID_REQUIRED",
    );
  }

  const repository =
    createFactoryAssessmentRepository();

  return repository.createEvidence(
    assessmentId,
    realFactoryProfileId,
    user.id,
    document,
  );
}
export async function
updateFactoryEvidence(
  evidenceId: string,
  patch: Partial<FactoryDocument>,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "AUTHENTICATION_REQUIRED",
    );
  }

  if (!evidenceId) {
    throw new Error(
      "EVIDENCE_ID_REQUIRED",
    );
  }

  const repository =
    createFactoryAssessmentRepository();

  await repository.updateEvidence(
    evidenceId,
    patch,
  );

  return {
    success: true,
  };
}




