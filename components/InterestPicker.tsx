"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InterestButton from "@/components/InterestButton";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Interest } from "@/lib/types";

interface InterestPickerProps {
  interests: Interest[];
  maxInterests: number;
  stepLabel: string;
  heading: string;
  description: string;
  continueLabel: string;
  onContinue: (selectedIds: string[]) => void;
}

/**
 * The "pick your interests" screen shared by every recommendation path.
 * Dataset-specific behavior (which interests, how many, what happens on
 * continue) is all passed in as props, so adding a new path is a new
 * taxonomy + a thin page wrapper, not a new picker.
 */
export default function InterestPicker({
  interests,
  maxInterests,
  stepLabel,
  heading,
  description,
  continueLabel,
  onContinue,
}: InterestPickerProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const grouped = useMemo(() => {
    const map = new Map<string, Interest[]>();
    for (const interest of interests) {
      const list = map.get(interest.category) ?? [];
      list.push(interest);
      map.set(interest.category, list);
    }
    return Array.from(map.entries());
  }, [interests]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= maxInterests) return prev;
      return [...prev, id];
    });
  }

  const atMax = selected.length >= maxInterests;

  return (
    <main className="min-h-screen bg-paper relative pb-36">
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

      <header className="sticky top-0 z-10 bg-paper/90 backdrop-blur-sm border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
          <div>
            <p className="eyebrow text-[0.65rem] text-blueprint mb-1">
              {stepLabel}
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-black text-ink tracking-tight">
              {heading}
            </h1>
          </div>
          <ProgressIndicator current={selected.length} max={maxInterests} />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">
        <p className="font-body text-base text-ink-soft mb-10 max-w-lg">
          {description}
        </p>

        <div className="space-y-10">
          {grouped.map(([category, categoryInterests]) => (
            <section key={category}>
              <h2 className="eyebrow text-xs text-ink-soft mb-3.5">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categoryInterests.map((interest) => (
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
                {selected.length} / {maxInterests} selected
              </p>
              <button
                onClick={() => onContinue(selected)}
                className="ml-auto inline-flex items-center gap-2 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-8 py-4 text-sm"
              >
                {continueLabel}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
