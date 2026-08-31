"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

// The sequence starts at 051, not 001 — the earliest frames were cut from
// the source set (public/hero-frames/ only ships frame-051..199.webp).
const FRAME_START = 51;
const FRAME_END = 199;
const FRAME_TOTAL = FRAME_END - FRAME_START + 1;
const FRAME_WIDTH = 960;
const FRAME_HEIGHT = 540;

function framePath(n: number) {
  return `/hero-frames/frame-${String(n).padStart(3, "0")}.webp`;
}

/**
 * Scroll-scrubbed image sequence for the hero visual: draws whichever
 * pre-rendered droplet-animation frame matches how far the hero has
 * scrolled onto a canvas. A canvas (rather than swapping <img> src per
 * frame) avoids a decode/layout flash on every frame change.
 */
export function HeroFrameSequence({
  progress,
}: {
  progress?: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: FRAME_TOTAL }, () => null)
  );
  const frameRef = useRef(FRAME_START);
  const [ready, setReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const fallbackProgress = useMotionValue(0);
  const scrollProgress = progress ?? fallbackProgress;

  function draw(frameNumber: number) {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameNumber - FRAME_START];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // If the exact target frame hasn't finished loading yet, draw the
  // closest one that has — a near-neighbor substitute reads as smooth
  // scrubbing, where leaving the previous (now stale) frame on screen
  // reads as a stutter/freeze.
  function drawNearest(frameNumber: number) {
    if (imagesRef.current[frameNumber - FRAME_START]) {
      draw(frameNumber);
      return;
    }
    for (let radius = 1; radius < FRAME_TOTAL; radius++) {
      const lo = frameNumber - radius;
      const hi = frameNumber + radius;
      if (lo >= FRAME_START && imagesRef.current[lo - FRAME_START]) {
        draw(lo);
        return;
      }
      if (hi <= FRAME_END && imagesRef.current[hi - FRAME_START]) {
        draw(hi);
        return;
      }
      if (lo < FRAME_START && hi > FRAME_END) return;
    }
  }

  useEffect(() => {
    let cancelled = false;

    const loadFrame = (n: number) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) imagesRef.current[n - FRAME_START] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = framePath(n);
      });

    // Load the frame shown first, paint it immediately, then load the rest
    // of the sequence concurrently (a bounded pool, not one-at-a-time —
    // sequential loading meant most frames still weren't ready by the time
    // a fast scroll reached them, which is what read as choppy/"sloppy").
    async function run() {
      const startFrame = prefersReducedMotion ? FRAME_END : FRAME_START;
      await loadFrame(startFrame);
      if (cancelled) return;
      frameRef.current = startFrame;
      draw(startFrame);
      setReady(true);

      if (prefersReducedMotion) return;

      const remaining = Array.from(
        { length: FRAME_TOTAL },
        (_, i) => FRAME_START + i
      ).filter((n) => n !== startFrame);
      const CONCURRENCY = 24;
      let cursor = 0;
      async function worker() {
        while (cursor < remaining.length) {
          const n = remaining[cursor++];
          if (cancelled) return;
          await loadFrame(n);
        }
      }
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion]);

  useMotionValueEvent(scrollProgress, "change", (value) => {
    if (prefersReducedMotion) return;
    const frameNumber = Math.min(
      FRAME_END,
      Math.max(FRAME_START, FRAME_START + Math.round(value * (FRAME_TOTAL - 1)))
    );
    if (frameNumber === frameRef.current) return;
    frameRef.current = frameNumber;
    drawNearest(frameNumber);
  });

  return (
    <div className="relative mx-auto aspect-video w-full max-w-[560px] sm:max-w-[620px] lg:max-w-[640px]">
      <div
        aria-hidden
        className="absolute inset-[6%] -z-10 rounded-full bg-nav-oil-gold/20 blur-[90px]"
      />
      <div
        aria-hidden
        className="absolute inset-[10%] -z-10 rounded-full bg-nav-green/20 blur-[100px]"
      />
      <canvas
        ref={canvasRef}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        role="img"
        aria-label="An animated droplet of used cooking oil swirling into green energy as you scroll, resolving into NavUrja's leaf mark."
        // The frames are a glow/bloom render on black with no alpha channel.
        // `screen` blending (not canvas transparency) is what makes the
        // black contribute nothing and the glow add light onto whatever's
        // behind it — the only compositing that looks correct on both a
        // light and a dark page background instead of leaving a visible
        // rectangular smudge in dark mode.
        style={{ mixBlendMode: "screen" }}
        className={`h-full w-full transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
