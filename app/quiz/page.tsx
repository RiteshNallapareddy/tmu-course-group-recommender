"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InterestButton from "@/components/InterestButton";
import ProgressIndicator from "@/components/ProgressIndicator";
import { INTERESTS, MAX_INTERESTS } from "@/data/interests";

export default function QuizPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof INTERESTS>();
    for (const interest of INTERESTS) {
      const list = map.get(interest.category) ?? [];
      list.push(interest);
      map.set(interest.category, list);
    }
    return Array.from(map.entries());
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, id];
    });
  }

  function handleContinue() {
    const params = new URLSearchParams({ interests: selected.join(",") });
    router.push(`/results?${params.toString()}`);
  }

  const atMax = selected.length >= MAX_INTERESTS;

  return (
    <main className="min-h-screen bg-paper relative pb-36">
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

      <header className="sticky top-0 z-10 bg-paper/90 backdrop-blur-sm border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
          <div>
            <p className="eyebrow text-[0.65rem] text-blueprint mb-1">
              Step 1 of 2
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-black text-ink tracking-tight">
              What are you into?
            </h1>
          </div>
          <ProgressIndicator current={selected.length} max={MAX_INTERESTS} />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">
        <p className="font-body text-base text-ink-soft mb-10 max-w-lg">
          Pick up to {MAX_INTERESTS} interests and we&apos;ll match them
          against real TMU Table A course descriptions — not a generic
          keyword list.
        </p>

        <div className="space-y-10">
          {grouped.map(([category, interests]) => (
            <section key={category}>
              <h2 className="eyebrow text-xs text-ink-soft mb-3.5">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interests.map((interest) => (
                  <InterestButton
                    key={interest.id}
                    interest={interest}
                    selected={selected.includes(interest.id)}
                    disabled={atMax}
                    onToggle={toggle}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 z-20 border-t border-line bg-paper-raised/95 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
              <p className="font-mono-tag text-xs text-ink-soft hidden sm:block">
                {selected.length} / {MAX_INTERESTS} selected
              </p>
              <button
                onClick={handleContinue}
                className="ml-auto inline-flex items-center gap-2 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-8 py-4 text-sm"
              >
                See My Matches
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
