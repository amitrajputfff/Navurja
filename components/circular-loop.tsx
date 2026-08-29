"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Droplet, Truck, Recycle, Zap, TrendingDown, Sparkles, Leaf } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CIRCULAR_LOOP_STAGES } from "@/lib/constants";

const RADIUS = 175;
const CENTER = 220;
const STAGE_COUNT = CIRCULAR_LOOP_STAGES.length;
const STAGE_ICONS = [Droplet, Truck, Recycle, Zap, TrendingDown, Sparkles];
const NODE_COLORS = ["#D9A441", "#0B3D2E", "#D9A441", "#0B3D2E", "#D9A441", "#0B3D2E"];

function nodePosition(index: number, radius = RADIUS) {
  const angle = (Math.PI * 2 * index) / STAGE_COUNT - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
    angle,
  };
}

function arcPath(i: number) {
  const a = nodePosition(i);
  const b = nodePosition((i + 1) % STAGE_COUNT);
  const midAngle = (a.angle + b.angle) / 2;
  const control = {
    x: CENTER + RADIUS * 0.78 * Math.cos(midAngle),
    y: CENTER + RADIUS * 0.78 * Math.sin(midAngle),
  };
  return `M${a.x},${a.y} Q${control.x},${control.y} ${b.x},${b.y}`;
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
  const fill = useTransform(progress, [0, 0.5, 1], ["#65756D", "#D9A441", "#0B3D2E"]);

  if (prefersReducedMotion) return null;

  return <motion.circle cx={cx} cy={cy} r={6} fill={fill} filter="url(#loopGlow)" />;
}

export function CircularLoop() {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <section className="bg-secondary/20 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-oil-gold">
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

            {CIRCULAR_LOOP_STAGES.map((_, i) => (
              <path
                key={i}
                d={arcPath(i)}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth={1.5}
                strokeDasharray="1.5 9"
                strokeLinecap="round"
              />
            ))}

            <TravelingDot />

            {/* Center hub */}
            <circle cx={CENTER} cy={CENTER} r={54} fill="white" stroke="var(--color-nav-oil-gold)" strokeOpacity={0.4} />
            <foreignObject x={CENTER - 44} y={CENTER - 44} width={88} height={88}>
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center">
                <Leaf className="size-5 text-nav-primary" />
                <p className="text-[0.6rem] leading-tight font-semibold text-nav-primary">
                  Closing the
                  <br />
                  loop
                </p>
              </div>
            </foreignObject>

            {CIRCULAR_LOOP_STAGES.map((stage, i) => {
              const { x, y } = nodePosition(i);
              const Icon = STAGE_ICONS[i];
              const labelBelow = y > CENTER + 30;
              const labelAbove = y < CENTER - 30;
              return (
                <g key={stage}>
                  <circle cx={x} cy={y} r={22} fill={NODE_COLORS[i]} />
                  <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon className="size-3.5 text-white" strokeWidth={2} />
                    </div>
                  </foreignObject>
                  <text
                    x={x}
                    y={y + (labelBelow ? 38 : labelAbove ? -32 : 5)}
                    textAnchor="middle"
                    className="fill-nav-dark-text text-[11px] font-semibold"
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
