import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const BUCKET = "assessment-evidence";

export async function uploadFactoryEvidence(
  file: File,
  assessmentId: string,
  factoryProfileId: string,
  documentId: string,
) {
  const supabase =
    createSupabaseBrowserClient();

  const safeName =
    file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );

  const filePath =
    `${assessmentId}/${factoryProfileId}/${documentId}/${safeName}`;

  const { error } =
    await supabase.storage
      .from(BUCKET)
      .upload(
        filePath,
        file,
        {
          upsert: true,
          contentType:
            file.type ||
            "application/octet-stream",
        },
      );

  if (error) {
    throw new Error(
      `FACTORY_EVIDENCE_UPLOAD_FAILED:${error.message}`,
    );
  }

  return {
    bucket: BUCKET,
    path: filePath,
    fileName: file.name,
    mimeType:
      file.type ||
      "application/octet-stream",
  };
}
