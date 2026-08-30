import {
  getFactoryProfile,
} from "./actions";

import type {
  FactoryProfile,
} from "./factory.types";

import FactoryWorkspace from "./FactoryWorkspace";

type PageProps = {
  searchParams: Promise<{
    assessmentId?: string;
  }>;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function FactoryPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const assessmentId =
    params.assessmentId?.trim();

  if (!assessmentId) {
    return (
      <main className="min-h-screen bg-[#030914] px-6 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-8">
          <h1 className="text-xl font-semibold">
            Assessment ID missing
          </h1>

          <p className="mt-3 text-sm text-white/45">
            Open Factory Assessment from
            the Company Assessment workflow.
          </p>
        </div>
      </main>
    );
  }

  if (!UUID_REGEX.test(assessmentId)) {
    return (
      <main className="min-h-screen bg-[#030914] px-6 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-8">
          <h1 className="text-xl font-semibold">
            Invalid Assessment ID
          </h1>

          <p className="mt-3 text-sm text-white/45">
            Factory Assessment requires a valid
            assessment UUID. Please open Factory
            Assessment from an active assessment.
          </p>

          <p className="mt-4 break-all font-mono text-xs text-white/25">
            Received: {assessmentId}
          </p>
        </div>
      </main>
    );
  }

  const initialData =
    await getFactoryProfile(
      assessmentId,
    );

  return (
    <FactoryWorkspace
      assessmentId={assessmentId}
      initialData={
        initialData as
          | FactoryProfile
          | undefined
      }
    />
  );
}
