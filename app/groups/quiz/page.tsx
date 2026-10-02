"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InterestPicker from "@/components/InterestPicker";
import {
  GROUP_INTERESTS,
  MAX_GROUP_INTERESTS,
  PROGRAM_OPTIONS,
  ProgramId,
} from "@/data/groupInterests";

export default function GroupsQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<"program" | "interests">("program");
  const [program, setProgram] = useState<ProgramId | null>(null);

  function chooseProgram(id: ProgramId) {
    setProgram(id);
    setStep("interests");
  }

  function skipProgram() {
    setProgram(null);
    setStep("interests");
  }

  function handleContinue(selected: string[]) {
    const params = new URLSearchParams({ interests: selected.join(",") });
    if (program) params.set("program", program);
    router.push(`/groups/results?${params.toString()}`);
  }

  if (step === "program") {
    return (
      <main className="min-h-screen bg-paper relative">
        <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

        <header className="border-b border-line bg-paper/90 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-6 py-5">
            <p className="eyebrow text-[0.65rem] text-blueprint mb-1">
              Step 1 of 3 · Optional
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-black text-ink tracking-tight">
              What&apos;s your program?
            </h1>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 max-w-2xl mx-auto px-6 pt-10 pb-20"
        >
          <p className="font-body text-base text-ink-soft mb-8 max-w-lg">
            We&apos;ll use this to boost groups in your discipline and point
            out your course union, if you have one. Totally optional.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {PROGRAM_OPTIONS.filter((p) => p.id !== "undeclared").map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => chooseProgram(p.id)}
                className="rounded border-2 border-blueprint-light bg-blueprint-light text-ink font-display text-sm font-bold px-4 py-4 text-center hover:border-blueprint transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={skipProgram}
            className="font-body text-sm text-blueprint hover:text-ink underline underline-offset-4"
          >
            Undeclared / not sure — skip this
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <InterestPicker
      interests={GROUP_INTERESTS}
      maxInterests={MAX_GROUP_INTERESTS}
      stepLabel="Step 2 of 3"
      heading="What are you into?"
      description={`Pick up to ${MAX_GROUP_INTERESTS} interests and we'll match them against real FEAS design teams, student groups and student government — not a generic keyword list.`}
      continueLabel="See My Matches"
      onContinue={handleContinue}
    />
  );
}
