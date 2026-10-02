"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Pick your interests",
    body: "Choose up to three things you actually care about — from history and philosophy to psychology and the arts.",
  },
  {
    number: "02",
    title: "We match real courses",
    body: "We check your picks against real TMU Table A course descriptions, not a generic catalogue.",
  },
  {
    number: "03",
    title: "Find your Liberal",
    body: "See your top match plus a few backups, with restrictions and course pages one click away.",
  },
];

export default function LiberalsLandingPage() {
  return (
    <main className="bg-paper">
      <section className="relative overflow-hidden px-6">
        <div className="absolute inset-0 blueprint-grid opacity-70 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-line" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto text-center py-24 md:py-32"
        >
          <p className="eyebrow text-xs text-blueprint mb-6">
            First-Year Engineering Office
          </p>

          <h1 className="font-display text-6xl md:text-7xl font-black text-ink leading-[1.03] mb-7 tracking-tight">
            Find Your <span className="text-blueprint">Liberal.</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-ink-soft leading-relaxed max-w-xl mx-auto mb-10">
            A tool built for TMU Engineering students to find a Table A
            Liberal Studies course they&apos;ll actually enjoy.
            Recommendations are based on real course descriptions instead of
            treating the course as just a requirement to check off.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/liberals/quiz"
              className="group inline-flex items-center gap-3 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-8 py-4 text-base"
            >
              Find My Liberal
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <Link
              href="/liberals/courses"
              className="inline-flex items-center gap-2 font-display font-bold text-ink hover:text-blueprint border-2 border-ink hover:border-blueprint transition-colors duration-200 rounded px-7 py-4 text-base"
            >
              Browse All Courses
            </Link>
          </div>

          <p className="eyebrow text-[0.65rem] text-ink-soft/70">
            Pick up to 3 interests · Get matched in seconds
          </p>
        </motion.div>
      </section>

      <section
        id="how-it-works"
        className="relative border-t border-line px-6 py-20 md:py-28"
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="eyebrow text-xs text-blueprint mb-3">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-ink tracking-tight">
              Three steps to your course.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
                className="rounded border border-line bg-white p-6"
              >
                <p className="font-mono-tag text-xs text-blueprint mb-4">
                  {step.number}
                </p>
                <h3 className="font-display text-lg font-bold text-ink mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
