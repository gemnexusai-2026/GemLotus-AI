import MachineryWorkspace from "./MachineryWorkspace";

type MachineryPageProps = {
  searchParams: Promise<{
    assessmentId?: string;
  }>;
};

export default async function MachineryPage({
  searchParams,
}: MachineryPageProps) {
  const params = await searchParams;

  const assessmentId = params.assessmentId;

  if (!assessmentId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030914] px-6 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-xl font-semibold">
            Assessment ID Required
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Please open Machinery Assessment
            from an active assessment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <MachineryWorkspace
      assessmentId={assessmentId}
    />
  );
}