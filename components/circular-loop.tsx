"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Reveal } from "@/components/reveal";
import { CIRCULAR_LOOP_STAGES } from "@/lib/constants";

const RADIUS = 190;
const CENTER = 220;
const STAGE_COUNT = CIRCULAR_LOOP_STAGES.length;

function nodePosition(index: number) {
  const angle = (Math.PI * 2 * index) / STAGE_COUNT - Math.PI / 2;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

function TravelingDot() {
  const t = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  useAnimationFrame((time) => {
    if (prefersReducedMotion) return;
    t.set(time / 1000);
  });

  const angle = useTransform(t, (v) => (v * 0.35) % (Math.PI * 2) - Math.PI / 2);
  const cx = useTransform(angle, (a) => CENTER + RADIUS * Math.cos(a));
  const cy = useTransform(angle, (a) => CENTER + RADIUS * Math.sin(a));
  const progress = useTransform(
    angle,
    (a) => (((a + Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2)
  );
  const fill = useTransform(progress, [0, 0.5, 1], ["#65756D", "#D9A441", "#5FAF72"]);

  if (prefersReducedMotion) return null;

  return <motion.circle cx={cx} cy={cy} r={7} fill={fill} filter="url(#loopGlow)" />;
}

export function CircularLoop() {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-green">
            The Loop
          </p>
          <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            A closed loop, not a dead end.
          </h2>
        </Reveal>

        <div className="mx-auto mt-16 max-w-lg">
          <svg
            ref={svgRef}
            viewBox="0 0 440 440"
            className="h-auto w-full"
            role="img"
            aria-label={`Circular diagram of the NavUrja process: ${CIRCULAR_LOOP_STAGES.join(", ")}, and back to the start.`}
          >
            <defs>
              <filter id="loopGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={1.5}
              strokeDasharray="1.5 10"
              strokeLinecap="round"
            />

            <TravelingDot />

            {CIRCULAR_LOOP_STAGES.map((stage, i) => {
              const { x, y } = nodePosition(i);
              return (
                <g key={stage}>
                  <circle
                    cx={x}
                    cy={y}
                    r={5}
                    className="fill-nav-primary"
                  />
                  <text
                    x={x}
                    y={y + (y > CENTER + 20 ? 26 : y < CENTER - 20 ? -20 : 4)}
                    textAnchor="middle"
                    className="fill-nav-dark-text text-[11px] font-medium"
                  >
                    {stage}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
