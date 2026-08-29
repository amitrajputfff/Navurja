"use client";

import type { RefObject } from "react";
import { useScroll, type MotionValue } from "motion/react";

/**
 * Scroll progress (0 -> 1) for how far the viewport has moved through the
 * target section, from the moment it enters until it scrolls fully past.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  return scrollYProgress;
}
