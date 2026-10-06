"use client";

import { motion } from "framer-motion";
import { GroupRecord, ScoredResult } from "@/lib/types";
import { getMatchExplanation } from "@/lib/matching";

interface GroupCardProps {
  result: ScoredResult<GroupRecord>;
  variant?: "primary" | "secondary";
  index?: number;
}

const CATEGORY_LABEL: Record<GroupRecord["category"], string> = {
  design_team: "Design Team",
  student_group: "Student Group",
  student_government: "Student Government",
};

export default function GroupCard({
  result,
  variant = "secondary",
  index = 0,
}: GroupCardProps) {
  const { item: group, matchedInterests } = result;
  const isPrimary = variant === "primary";
  const explanation = getMatchExplanation(matchedInterests);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45, ease: "easeOut" }}
      className={[
        "relative rounded bg-white transition-colors",
        isPrimary
          ? "border-2 border-blueprint p-6 md:p-8"
          : "border border-blueprint p-4 hover:border-ink",
      ].join(" ")}
    >
      <div className="mb-2">
        <p className="eyebrow text-[0.65rem] text-blueprint">
          {CATEGORY_LABEL[group.category]}
        </p>
      </div>

      <h3
        className={[
          "font-display font-bold text-ink leading-snug",
          isPrimary ? "text-2xl md:text-3xl" : "text-lg",
        ].join(" ")}
      >
        {group.name}
      </h3>

      <p
        className={[
          "font-body text-ink-soft mt-3 leading-relaxed",
          isPrimary ? "text-base" : "text-sm line-clamp-3",
        ].join(" ")}
      >
        {group.description}
      </p>

      {group.isAutomaticMembership ? (
        <p
          className={[
            "font-body text-ink border-t border-line pt-3",
            isPrimary ? "text-sm mt-5" : "text-[0.8rem] mt-4",
          ].join(" ")}
        >
          You&apos;re automatically a member as a full-time student in this
          program. Reach out to get involved:
          {group.contactEmail && (
            <>
              {" "}
              <a
                href={`mailto:${group.contactEmail}`}
                className="underline underline-offset-2 hover:text-blueprint"
              >
                {group.contactEmail}
              </a>
            </>
          )}
        </p>
      ) : (
        explanation && (
          <p
            className={[
              "font-body text-ink border-t border-line pt-3",
              isPrimary ? "text-sm mt-5" : "text-[0.8rem] mt-4",
            ].join(" ")}
          >
            {explanation}
          </p>
        )
      )}

      {group.contactMayBeOutdated && (
        <p className="font-body text-[0.8rem] text-ink-soft mt-3">
          Contact info may be out of date.
        </p>
      )}

      <div
        className={[
          "flex flex-wrap items-center gap-3",
          isPrimary ? "mt-4" : "mt-3",
        ].join(" ")}
      >
        {group.contactEmail && (
          <a
            href={`mailto:${group.contactEmail}`}
            className={[
              "inline-flex items-center gap-1.5 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors rounded",
              isPrimary ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5",
            ].join(" ")}
          >
            Email {group.contactEmail}
          </a>
        )}
        {group.website && (
          <a
            href={group.website}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "inline-flex items-center gap-1.5 font-display font-bold text-ink hover:text-blueprint border-2 border-ink hover:border-blueprint transition-colors rounded",
              isPrimary ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5",
            ].join(" ")}
          >
            Visit Site
            <span aria-hidden="true">→</span>
          </a>
        )}
        {group.instagram && (
          <a
            href={`https://www.instagram.com/${group.instagram.replace(/^@/, "")}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "inline-flex items-center gap-1.5 font-display font-bold text-ink hover:text-blueprint border-2 border-ink hover:border-blueprint transition-colors rounded",
              isPrimary ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5",
            ].join(" ")}
          >
            Instagram
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      <p className="font-body text-[0.8rem] text-ink-soft/70 mt-3">
        Reach out to the team to ask about joining.
      </p>
    </motion.div>
  );
}
