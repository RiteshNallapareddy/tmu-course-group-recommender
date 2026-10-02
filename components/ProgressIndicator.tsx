"use client";

import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  current: number;
  max: number;
  label?: string;
}

export default function ProgressIndicator({
  current,
  max,
  label,
}: ProgressIndicatorProps) {
  const pct = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono-tag text-xs tracking-widest text-ink-soft uppercase">
          {label ?? "Selected"}
        </span>
        <span className="font-mono-tag text-sm text-ink">
          {current} / {max}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-blueprint"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        />
      </div>
    </div>
  );
}
