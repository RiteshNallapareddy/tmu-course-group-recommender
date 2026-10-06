"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import WorkshopSuggestions from "@/components/WorkshopSuggestions";
import { recommendCourses, groupTopMatches } from "@/lib/recommendation";
import { interestsById } from "@/lib/tagging";
import { INTERESTS } from "@/data/interests";
import { getMinorCreditForCourse } from "@/lib/minors";

export default function ResultsClient() {
  const searchParams = useSearchParams();
  const interestIds = useMemo(() => {
    const raw = searchParams.get("interests") ?? "";
    return raw.split(",").filter(Boolean);
  }, [searchParams]);

  const selectedInterests = useMemo(
    () => interestsById(interestIds, INTERESTS),
    [interestIds]
  );
  const results = useMemo(() => recommendCourses(interestIds, 5), [interestIds]);
  const { topMatches, alsoLike } = useMemo(
    () => groupTopMatches(results),
    [results]
  );

  const hasAnyMinorCredit = useMemo(
    () => results.some((r) => getMinorCreditForCourse(r.course.courseCode).length > 0),
    [results]
  );

  if (interestIds.length === 0) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl font-bold text-ink mb-3">
            No interests selected
          </h1>
          <p className="font-body text-ink-soft mb-8">
            Head back and pick up to 3 things you&apos;re into so we can find
            your matches.
          </p>
          <Link
            href="/liberals/quiz"
            className="inline-flex font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors rounded px-6 py-3 text-sm"
          >
            Choose Interests
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper relative pb-24">
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

      <header className="relative z-10 border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="eyebrow text-[0.65rem] text-blueprint mb-1">
            Step 2 of 2 · Your Results
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-black text-ink tracking-tight">
              Your matches
            </h1>
            <Link
              href="/liberals/quiz"
              className="font-body text-sm text-blueprint hover:text-ink underline underline-offset-4"
            >
              Change interests
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedInterests.map((interest) => (
              <span
                key={interest.id}
                className="font-mono-tag text-[0.65rem] tracking-wide uppercase bg-blueprint-light text-ink border border-blueprint/30 px-2.5 py-1 rounded"
              >
                {interest.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12">
        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-display text-xl font-bold text-ink mb-2">
              No confirmed matches yet
            </p>
            <p className="font-body text-ink-soft max-w-sm mx-auto">
              This combination doesn&apos;t hit any verified courses in the
              dataset yet — research on the remaining courses is still in
              progress. Try a different combination.
            </p>
            <Link
              href="/liberals/quiz"
              className="inline-flex mt-6 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors rounded px-6 py-3 text-sm"
            >
              Try Again
            </Link>
          </motion.div>
        ) : (
          <>
            {topMatches.length > 0 && (
              <section>
                <h2 className="eyebrow text-xs text-white bg-blueprint inline-block px-3 py-1.5 rounded mb-4">
                  Your Top Matches
                </h2>
                <div className="flex flex-col gap-6">
                  {topMatches.map((result, i) => (
                    <CourseCard
                      key={result.course.courseCode}
                      result={result}
                      variant="primary"
                      index={i}
                    />
                  ))}
                </div>
              </section>
            )}

            {alsoLike.length > 0 && (
              <section className="mt-14">
                <h2 className="eyebrow text-xs text-ink-soft mb-4">
                  You Might Also Like
                </h2>
                <div className="flex flex-col gap-3">
                  {alsoLike.map((result, i) => (
                    <CourseCard
                      key={result.course.courseCode}
                      result={result}
                      variant="secondary"
                      index={i + 1}
                    />
                  ))}
                </div>
              </section>
            )}

            {hasAnyMinorCredit && (
              <p className="font-body text-xs text-ink-soft/70 mt-12 max-w-md">
                A course can count toward only one Minor, and a course used
                for a Minor can&apos;t also count toward a Concentration —
                course substitutions aren&apos;t permitted either. Completing
                a Minor may mean extra courses and extra fees, and students
                on Probationary standing can&apos;t take extra courses for
                one. You apply for the Minor separately in MyServiceHub when
                you apply to graduate.
              </p>
            )}
          </>
        )}

        <WorkshopSuggestions />
      </div>
    </main>
  );
}
