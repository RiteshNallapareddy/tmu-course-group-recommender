"use client";

import { motion } from "framer-motion";
import { RecommendationResult } from "@/lib/types";
import { getMatchExplanation } from "@/lib/recommendation";
import { getMinorCreditForCourse } from "@/lib/minors";

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
  const { course, matchedInterests } = result;
  const isPrimary = variant === "primary";
  const explanation = getMatchExplanation(matchedInterests);
  const minorCredit = getMinorCreditForCourse(course.courseCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45, ease: "easeOut" }}
      className={[
        "relative rounded bg-white transition-colors",
        isPrimary
          ? "border-2 border-blueprint p-6 md:p-8"
          : "border border-line p-5 hover:border-blueprint",
      ].join(" ")}
    >
      <div className="mb-2">
        <p className="eyebrow text-[0.65rem] text-blueprint">
          {course.courseCode}
        </p>
      </div>

      <h3
        className={[
          "font-display font-bold text-ink leading-snug",
          isPrimary ? "text-2xl md:text-3xl" : "text-lg",
        ].join(" ")}
      >
        {course.courseName}
      </h3>

      {course.verified.description && (
        <p
          className={[
            "font-body text-ink-soft mt-3 leading-relaxed",
            isPrimary ? "text-base" : "text-sm line-clamp-3",
          ].join(" ")}
        >
          {course.verified.description}
        </p>
      )}

      {explanation && (
        <p
          className={[
            "font-body text-ink border-t border-line pt-3",
            isPrimary ? "text-sm mt-5" : "text-[0.8rem] mt-4",
          ].join(" ")}
        >
          {explanation}
        </p>
      )}

      {minorCredit.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {minorCredit.map((credit) => (
            <p
              key={`${credit.minorSlug}-${credit.role}`}
              className="font-mono-tag text-[0.7rem] text-blueprint leading-snug"
              title={credit.sourceUrl}
            >
              ✓ Counts toward the {credit.minorName}
            </p>
          ))}
        </div>
      )}

      {course.verified.programRestrictions && (
        <p className="font-body text-[0.8rem] text-ink font-medium mt-3">
          Restriction: {course.verified.programRestrictions}
        </p>
      )}

      {!course.verified.programRestrictions &&
        course.missingFields.includes("programRestrictions") && (
          <p className="font-body text-[0.8rem] text-ink-soft mt-3">
            Program restriction information not yet confirmed for this
            course.
          </p>
        )}

      {course.verified.descriptionSourceUrl && (
        <a
          href={course.verified.descriptionSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-display font-bold text-sm text-white bg-blueprint hover:bg-ink transition-colors rounded px-4 py-2 mt-4"
        >
          View Course
          <span aria-hidden="true">→</span>
        </a>
      )}
    </motion.div>
  );
}
