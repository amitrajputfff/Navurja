"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { fadeInUp } from "@/lib/animations";

export function Reveal({
  children,
  variants = fadeInUp,
  className,
  amount = 0.2,
  delay = 0,
}: {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  amount?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  staggerChildren = 0.12,
  delayChildren = 0,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  amount?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
