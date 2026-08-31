"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";

const StageCanvas = dynamic(
  () => import("@/components/scroll-stage-canvas").then((m) => m.StageCanvas),
  { ssr: false }
);

/**
 * Document element ids whose top-of-viewport crossing marks a stage
 * boundary — index into this array is the morph stage (0–4) the droplet
 * reaches at that point in the page. Keeping this keyed to real section
 * positions (measured via getBoundingClientRect, not hardcoded vh
 * fractions) means the droplet's journey tracks the actual page layout,
 * including when section heights change with content or viewport width.
 */
const STAGE_ANCHOR_IDS = [
  "top",
  "problem",
  "how-it-works",
  "impact",
  "final-cta",
] as const;

/**
 * The scroll-driven background layer: one droplet that forms in the hero,
 * travels the length of the page while its shape/color morph across the
 * anchors above, and bursts apart near the final CTA to hand off to the
 * static leaf mark in the footer. Fixed behind all page content (-z-10);
 * sections with their own background naturally occlude it, so it mostly
 * reads through the untinted bands (hero, problem, solutions, pickup form).
 *
 * Desktop/large-viewport only (`hidden lg:block`) — a page-spanning WebGL
 * canvas is real GPU/battery cost, and this is a decorative layer, not
 * load-bearing content, so it's the first thing to drop on smaller devices.
 * Section-level scroll choreography (Phase 3) still runs everywhere.
 */
export function ScrollStage() {
  const prefersReducedMotion = useReducedMotion();
  const [tabVisible, setTabVisible] = useState(true);
  const stageProgressRef = useRef(0);
  const totalProgressRef = useRef(0);

  useEffect(() => {
    const onVisibility = () =>
      setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const anchors = STAGE_ANCHOR_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (anchors.length < 2) return;

    let anchorYs: number[] = [];
    const measure = () => {
      anchorYs = anchors.map(
        (el) => el.getBoundingClientRect().top + window.scrollY
      );
    };
    measure();

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onRefresh: measure,
      onUpdate: () => {
        const scrollY = window.scrollY;
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        totalProgressRef.current = Math.min(1, Math.max(0, scrollY / maxScroll));

        const last = anchorYs.length - 1;
        if (scrollY <= anchorYs[0]) {
          stageProgressRef.current = 0;
          return;
        }
        for (let i = 0; i < last; i++) {
          if (scrollY >= anchorYs[i] && scrollY <= anchorYs[i + 1]) {
            const span = anchorYs[i + 1] - anchorYs[i] || 1;
            stageProgressRef.current = i + (scrollY - anchorYs[i]) / span;
            return;
          }
        }
        stageProgressRef.current = last;
      },
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden lg:block">
      {tabVisible && (
        <StageCanvas
          stageProgressRef={stageProgressRef}
          totalProgressRef={totalProgressRef}
        />
      )}
    </div>
  );
}
