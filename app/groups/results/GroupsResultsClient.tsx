"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import GroupCard from "@/components/GroupCard";
import {
  recommendGroups,
  getStartYourOwnLinks,
  getCourseUnionForProgram,
} from "@/lib/groups";
import { interestsById } from "@/lib/tagging";
import { GROUP_INTERESTS, PROGRAM_OPTIONS, ProgramId } from "@/data/groupInterests";

function parseProgram(raw: string | null): ProgramId | null {
  if (!raw) return null;
  const match = PROGRAM_OPTIONS.find((p) => p.id === raw);
  return match ? (match.id as ProgramId) : null;
}

export default function GroupsResultsClient() {
  const searchParams = useSearchParams();
  const interestIds = useMemo(() => {
    const raw = searchParams.get("interests") ?? "";
    return raw.split(",").filter(Boolean);
  }, [searchParams]);
  const program = useMemo(
    () => parseProgram(searchParams.get("program")),
    [searchParams]
  );

  const selectedInterests = useMemo(
    () => interestsById(interestIds, GROUP_INTERESTS),
    [interestIds]
  );
  const results = useMemo(
    () => recommendGroups(interestIds, program, 5),
    [interestIds, program]
  );
  const courseUnion = useMemo(
    () => getCourseUnionForProgram(program),
    [program]
  );

  const [topMatch, ...rest] = results;
  const startYourOwn = getStartYourOwnLinks();

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
            href="/groups/quiz"
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
            Step 3 of 3 · Your Results
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-black text-ink tracking-tight">
              Your matches
            </h1>
            <Link
              href="/groups/quiz"
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
              Nothing matched closely enough
            </p>
            <p className="font-body text-ink-soft max-w-sm mx-auto mb-8">
              Rather than guess at a weak match, here&apos;s how to start
              your own team instead.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={startYourOwn.engineering}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors rounded px-5 py-3 text-sm"
              >
                Start an Engineering Team
              </a>
              <a
                href={startYourOwn.architecture}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors rounded px-5 py-3 text-sm"
              >
                Start an Architecture Team
              </a>
              <a
                href={startYourOwn.techBased}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors rounded px-5 py-3 text-sm"
              >
                Start a Tech-Based Team
              </a>
            </div>
          </motion.div>
        ) : (
          <>
            {topMatch && (
              <section>
                <h2 className="eyebrow text-xs text-white bg-blueprint inline-block px-3 py-1.5 rounded mb-4">
                  Your Top Match
                </h2>
                <GroupCard result={topMatch} variant="primary" />
              </section>
            )}

            {rest.length > 0 && (
              <section className="mt-14">
                <h2 className="eyebrow text-xs text-ink-soft mb-4">
                  You Might Also Like
                </h2>
                <div className="flex flex-col gap-3">
                  {rest.map((result, i) => (
                    <GroupCard
                      key={result.item.id}
                      result={result}
                      variant="secondary"
                      index={i + 1}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {courseUnion && (
          <section className="mt-14">
            <h2 className="eyebrow text-xs text-ink-soft mb-4">
              Your Course Union
            </h2>
            <GroupCard
              result={{ item: courseUnion, score: 0, matchedInterests: [] }}
              variant="secondary"
            />
          </section>
        )}
      </div>
    </main>
  );
}
