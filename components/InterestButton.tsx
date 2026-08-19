"use client";

import { motion } from "framer-motion";
import { Interest } from "@/lib/types";

interface InterestButtonProps {
  interest: Interest;
  selected: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
}

export default function InterestButton({
  interest,
  selected,
  disabled,
  onToggle,
}: InterestButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(interest.id)}
      disabled={disabled && !selected}
      whileHover={disabled && !selected ? undefined : { scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      className={[
        "group relative rounded border-2 px-4 py-5 min-h-[84px] text-center flex items-center justify-center transition-colors duration-150 w-full",
        "font-display text-base font-bold",
        selected
          ? "bg-blueprint text-white border-blueprint"
          : disabled
          ? "bg-line/30 text-ink-soft/50 border-line cursor-not-allowed"
          : "bg-blueprint-light text-ink border-blueprint-light hover:border-blueprint",
      ].join(" ")}
    >
      <span className="flex items-center gap-2.5">
        {interest.label}
        <span
          className={[
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
            selected
              ? "bg-yellow border-yellow"
              : "border-ink/30 group-hover:border-ink",
          ].join(" ")}
        >
          {selected && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1.5 5.2 L4 7.7 L8.5 2"
                stroke="var(--ink)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>
    </motion.button>
  );
}
