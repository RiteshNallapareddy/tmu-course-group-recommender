"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Tell us your program",
    body: "Optional — helps us boost groups in your discipline and point out your course union, if you have one.",
  },
  {
    number: "02",
    title: "Pick your interests",
    body: "Choose up to three things you actually care about — from building rockets to advocacy and outreach.",
  },
  {
    number: "03",
    title: "Find your team",
    body: "See your top match plus a few backups, with contact info and how to get involved.",
  },
];

export default function GroupsLandingPage() {
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
            Find Your <span className="text-blueprint">Team.</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-ink-soft leading-relaxed max-w-xl mx-auto mb-10">
            A tool built for TMU Engineering and Architecture students to find
            a design team, student group or student government role
            they&apos;ll actually enjoy — matched from FEAS&apos;s real
            Student Involvement page, not a generic list.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/groups/quiz"
              className="group inline-flex items-center gap-3 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-8 py-4 text-base"
            >
              Find My Team
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <p className="eyebrow text-[0.65rem] text-ink-soft/70">
            Pick up to 3 interests · Get matched in seconds
          </p>
        </motion.div>
      </section>

      <section className="relative border-t border-line px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="eyebrow text-xs text-blueprint mb-3">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-ink tracking-tight">
              Three steps to your team.
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
