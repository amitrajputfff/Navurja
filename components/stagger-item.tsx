"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { fadeInUp } from "@/lib/animations";

export function StaggerItem({
  children,
  variants = fadeInUp,
  className,
}: {
  children: ReactNode;
  variants?: Variants;
  className?: string;
}) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
