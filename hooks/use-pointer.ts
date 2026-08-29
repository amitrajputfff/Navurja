"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";

/**
 * Tracks normalized pointer position (-1..1 on each axis) relative to the
 * given element's center, using a single rAF-throttled listener and
 * spring-smoothed motion values so consumers get gentle parallax for free.
 */
export function usePointer(ref: RefObject<HTMLElement | null>) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(event: PointerEvent) {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        rawX.set(Math.max(-1, Math.min(1, nx)));
        rawY.set(Math.max(-1, Math.min(1, ny)));
      });
    }

    function handleLeave() {
      rawX.set(0);
      rawY.set(0);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [ref, rawX, rawY]);

  return { x, y };
}
