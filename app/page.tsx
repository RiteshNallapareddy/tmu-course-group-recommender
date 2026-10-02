"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const PATHS = [
  {
    href: "/liberals",
    eyebrow: "Table A · Liberal Studies",
    title: "Find a Liberal.",
    body: "Pick what you're into and we'll match you against real TMU Table A course descriptions — not a generic catalogue.",
    cta: "Find My Liberal",
  },
  {
    href: "/groups",
    eyebrow: "Design Teams · Student Groups",
    title: "Find a Team.",
    body: "Pick what you're into and we'll match you against FEAS design teams, student groups and student government.",
    cta: "Find My Team",
  },
];

export default function HomePage() {
  return (
    <main className="bg-paper min-h-screen relative overflow-hidden px-6">
      <div className="absolute inset-0 blueprint-grid opacity-70 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-line" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-3xl mx-auto text-center pt-24 md:pt-32 pb-16"
      >
        <p className="eyebrow text-xs text-blueprint mb-6">
          First-Year Engineering Office
        </p>

        <h1 className="font-display text-5xl md:text-6xl font-black text-ink leading-[1.03] mb-7 tracking-tight">
          What are you looking for?
        </h1>

        <p className="font-body text-lg text-ink-soft leading-relaxed max-w-xl mx-auto">
          Two ways to find something at TMU Engineering you&apos;ll actually
          enjoy, both matched from what you&apos;re into — not a quiz.
        </p>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 pb-24">
        {PATHS.map((path, i) => (
          <motion.div
            key={path.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: "easeOut" }}
            className="rounded border-2 border-ink bg-white p-8 flex flex-col"
          >
            <p className="eyebrow text-[0.65rem] text-blueprint mb-4">
              {path.eyebrow}
            </p>
            <h2 className="font-display text-3xl font-black text-ink tracking-tight mb-4">
              {path.title}
            </h2>
            <p className="font-body text-sm text-ink-soft leading-relaxed mb-8 flex-1">
              {path.body}
            </p>
            <Link
              href={path.href}
              className="group inline-flex items-center justify-center gap-3 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-6 py-4 text-base"
            >
              {path.cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
