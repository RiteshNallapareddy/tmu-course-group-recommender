"use client";

import { useRouter } from "next/navigation";
import InterestPicker from "@/components/InterestPicker";
import { INTERESTS, MAX_INTERESTS } from "@/data/interests";

export default function LiberalsQuizPage() {
  const router = useRouter();

  function handleContinue(selected: string[]) {
    const params = new URLSearchParams({ interests: selected.join(",") });
    router.push(`/liberals/results?${params.toString()}`);
  }

  return (
    <InterestPicker
      interests={INTERESTS}
      maxInterests={MAX_INTERESTS}
      stepLabel="Step 1 of 2"
      heading="What are you into?"
      description={`Pick up to ${MAX_INTERESTS} interests and we'll match them against real TMU Table A course descriptions — not a generic keyword list.`}
      continueLabel="See My Matches"
      onContinue={handleContinue}
    />
  );
}
