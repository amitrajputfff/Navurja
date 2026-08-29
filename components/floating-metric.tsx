"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

export function FloatingMetric({
  icon: Icon,
  label,
  value,
  unit,
  className,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`glass pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 ${className ?? ""}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-nav-mint text-nav-primary">
        <Icon className="size-4.5" />
      </span>
      <div className="leading-tight">
        <p className="text-[0.7rem] font-medium uppercase tracking-wide text-nav-muted">
          {label}
        </p>
        <p className="text-base font-semibold text-nav-dark-text">
          {value}
          {unit ? <span className="ml-1 text-xs font-medium text-nav-muted">{unit}</span> : null}
        </p>
      </div>
    </motion.div>
  );
}
