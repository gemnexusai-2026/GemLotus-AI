"use client";

import { useTransition } from "react";

import { startAssessment } from "@/app/assessment/actions";

interface StartAssessmentButtonProps {
  entityTypeCode: string;
}

export function StartAssessmentButton({
  entityTypeCode,
}: StartAssessmentButtonProps) {
  const [isPending, startTransition] =
    useTransition();

  function handleStart() {
    startTransition(() => {
      startAssessment(entityTypeCode);
    });
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={isPending}
      aria-busy={isPending}
      className="mt-6 flex w-full items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-4 py-3 text-sm font-medium text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-400/[0.12] disabled:cursor-wait disabled:opacity-60"
    >
      <span>
        {isPending
          ? "Starting Assessment..."
          : "Start Assessment"}
      </span>

      <span
        aria-hidden="true"
        className="text-lg"
      >
        {isPending ? "…" : "→"}
      </span>
    </button>
  );
}