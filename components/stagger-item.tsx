"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
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
    <motion.div variants={variants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
