"use client";

import { motion } from "framer-motion";
import { RecommendationResult } from "@/lib/types";
import { getMatchExplanation } from "@/lib/recommendation";

interface CourseCardProps {
  result: RecommendationResult;
  variant?: "primary" | "secondary";
  index?: number;
}

export default function CourseCard({
  result,
  variant = "secondary",
  index = 0,
}: CourseCardProps) {
  const { course, score, matchedInterests } = result;
  const isPrimary = variant === "primary";
  const explanation = getMatchExplanation(matchedInterests);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45, ease: "easeOut" }}
      className={[
        "relative rounded-xl border bg-paper-raised",
        isPrimary
          ? "corner-ticks border-blueprint/40 p-6 md:p-8 shadow-[0_8px_30px_-12px_rgba(18,25,42,0.25)]"
          : "border-line p-5 hover:border-blueprint/50 transition-colors",
      ].join(" ")}
    >
      {isPrimary && (
        <span className="font-mono-tag absolute -top-3 left-6 bg-ember text-paper text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1 rounded-full">
          Your Top Match
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono-tag text-xs tracking-[0.15em] text-blueprint uppercase mb-1">
            [ {course.courseCode} ]
          </div>
          <h3
            className={[
              "font-display font-semibold text-ink",
              isPrimary ? "text-2xl md:text-3xl" : "text-lg",
            ].join(" ")}
          >
            {course.courseName}
          </h3>
        </div>

        <div className="text-right shrink-0">
          <div
            className={[
              "font-mono-tag font-semibold text-ember",
              isPrimary ? "text-3xl md:text-4xl" : "text-xl",
            ].join(" ")}
          >
            {score}%
          </div>
          <div className="font-mono-tag text-[0.6rem] tracking-widest text-ink-soft uppercase">
            match
          </div>
        </div>
      </div>

      {isPrimary && <div className="dimension-line my-4 opacity-60" />}

      {matchedInterests.length > 0 && (
        <div className={isPrimary ? "mt-4" : "mt-3"}>
          <p className="font-mono-tag text-[0.65rem] tracking-widest text-ink-soft uppercase mb-2">
            Why we picked it
          </p>
          {explanation && (
            <p className="font-body text-sm text-ink-soft mb-2">{explanation}</p>
          )}
          <ul className="flex flex-wrap gap-2">
            {matchedInterests.map((interest) => (
              <li
                key={interest.id}
                className="flex items-center gap-1.5 rounded-full bg-blueprint/10 text-blueprint px-2.5 py-1 text-xs font-medium"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                  <path
                    d="M1.5 5.2 L4 7.7 L8.5 2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {interest.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {course.verified.description && (
        <p
          className={[
            "font-body text-ink-soft mt-4 leading-relaxed",
            isPrimary ? "text-base" : "text-sm line-clamp-3",
          ].join(" ")}
        >
          {course.verified.description}
        </p>
      )}

      {isPrimary && course.verified.programRestrictions && (
        <p className="font-mono-tag text-[0.7rem] text-ink-soft mt-4 border-t border-line pt-3">
          Restriction: {course.verified.programRestrictions}
        </p>
      )}

      {isPrimary &&
        !course.verified.programRestrictions &&
        course.missingFields.includes("programRestrictions") && (
          <p className="font-mono-tag text-[0.7rem] text-ink-soft mt-4 border-t border-line pt-3">
            Program restriction information not yet confirmed for this course.
          </p>
        )}
    </motion.div>
  );
}
