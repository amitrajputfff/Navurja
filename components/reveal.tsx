"use client";

import { motion, type TargetAndTransition, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

/**
 * Motion resolves a variant's own `transition` (if the target state defines
 * one) *over* the component-level `transition` prop — so passing `delay` as
 * a sibling prop alongside a variant that already carries a transition (every
 * variant in lib/animations.ts does) silently drops the delay. This merges
 * it into the variant's own transition instead, so `delay` actually applies.
 */
function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants;
  const visible = variants.visible as TargetAndTransition | undefined;
  return {
    ...variants,
    visible: {
      ...visible,
      transition: { ...visible?.transition, delay },
    },
  };
}

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
      variants={withDelay(variants, delay)}
      className={cn(className)}
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
      variants={staggerContainer(staggerChildren, delayChildren)}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
