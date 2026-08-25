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
  
  export default async function FactoryPage({
    searchParams,
  }: PageProps) {
    const params =
      await searchParams;
  
    const assessmentId =
      params.assessmentId;
  
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
  
    const initialData =
      await getFactoryProfile(
        assessmentId,
      );
  
    return (
      <FactoryWorkspace
        assessmentId={assessmentId}
        initialData={initialData as FactoryProfile | undefined}
      />
    );
  }




  


