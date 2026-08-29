"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";

export function useCountUp(target: number, duration = 1.6) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = Math.round(target).toLocaleString("en-IN");
      return;
    }

    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        if (el) el.textContent = Math.round(value).toLocaleString("en-IN");
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration, motionValue, prefersReducedMotion]);

  return ref;
}
