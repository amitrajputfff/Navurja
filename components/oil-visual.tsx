"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { usePointer } from "@/hooks/use-pointer";

const DROPLET_PATH_A =
  "M200,60 C260,140 300,200 300,260 C300,300 254,340 200,340 C146,340 100,300 100,260 C100,200 140,140 200,60 Z";
const DROPLET_PATH_B =
  "M200,58 C264,144 306,202 302,262 C300,304 252,344 200,344 C148,344 98,302 98,260 C96,198 138,142 200,58 Z";

const PARTICLE_COLORS: [string, string, string] = ["#8a978f", "#D9A441", "#5FAF72"];

type Particle = {
  id: number;
  radius: number;
  yFactor: number;
  phase: number;
  speed: number;
  size: number;
};

const PARTICLES: Particle[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  radius: 172 + ((i * 37) % 26),
  yFactor: 0.52 + ((i % 3) * 0.03),
  phase: (Math.PI * 2 * i) / 8,
  speed: 0.28 + (i % 4) * 0.04,
  size: 3 + (i % 3),
}));

function OrbitParticle({
  particle,
  globalT,
}: {
  particle: Particle;
  globalT: MotionValue<number>;
}) {
  const angle = useTransform(
    globalT,
    (t) => particle.phase + particle.speed * t
  );
  const progress = useTransform(angle, (a) => {
    const twoPi = Math.PI * 2;
    const norm = ((a % twoPi) + twoPi) % twoPi;
    return norm / twoPi;
  });
  const cx = useTransform(angle, (a) => 200 + particle.radius * Math.cos(a));
  const cy = useTransform(
    angle,
    (a) => 200 + particle.radius * Math.sin(a) * particle.yFactor
  );
  const fill = useTransform(progress, [0, 0.5, 1], PARTICLE_COLORS);
  const opacity = useTransform(
    angle,
    (a) => 0.55 + 0.45 * Math.max(0, Math.sin(a))
  );

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={particle.size}
      fill={fill}
      style={{ opacity }}
    />
  );
}

export function OilVisual({
  progress,
}: {
  progress?: MotionValue<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { x: pointerX, y: pointerY } = usePointer(containerRef);
  const globalT = useMotionValue(0);

  useAnimationFrame((time) => {
    if (prefersReducedMotion) return;
    globalT.set(time / 1000);
  });

  const rotateX = useTransform(pointerY, [-1, 1], [7, -7]);
  const rotateY = useTransform(pointerX, [-1, 1], [-7, 7]);

  const fallbackZero = useMotionValue(0);
  const scrollProgress = progress ?? fallbackZero;
  const scale = useTransform(scrollProgress, [0, 1], [1, 0.88]);
  const translateY = useTransform(scrollProgress, [0, 1], [0, -36]);
  const sceneOpacity = useTransform(scrollProgress, [0, 0.75, 1], [1, 1, 0.35]);

  const particles = useMemo(() => PARTICLES, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[520px]"
    >
      <div
        aria-hidden
        className="absolute inset-[6%] -z-10 rounded-full bg-nav-oil-gold/25 blur-[70px]"
      />
      <div
        aria-hidden
        className="absolute inset-[14%] -z-10 rounded-full bg-nav-green/25 blur-[80px]"
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { scale, y: translateY, opacity: sceneOpacity, perspective: 1000 }
        }
        className="relative h-full w-full"
      >
        <motion.svg
          viewBox="0 0 400 400"
          className="h-full w-full overflow-visible"
          style={
            prefersReducedMotion
              ? undefined
              : { rotateX, rotateY, transformStyle: "preserve-3d" }
          }
          role="img"
          aria-label="An illustration of a golden oil droplet with particles orbiting it, symbolizing used cooking oil transforming into renewable energy."
        >
          <defs>
            <linearGradient id="dropletGradient" x1="0" y1="0" x2="0.15" y2="1">
              <stop offset="0%" stopColor="#073B2A" />
              <stop offset="42%" stopColor="#0B3D2E" />
              <stop offset="100%" stopColor="#D9A441" />
            </linearGradient>
            <radialGradient id="rimGradient" cx="50%" cy="28%" r="75%">
              <stop offset="0%" stopColor="#EAF7ED" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
            </radialGradient>
            <filter id="softBlur" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <circle
            cx={200}
            cy={200}
            r={183}
            fill="none"
            stroke="var(--color-nav-light-green)"
            strokeOpacity={0.45}
            strokeDasharray="1.5 11"
            strokeLinecap="round"
          />

          <motion.path
            d={DROPLET_PATH_A}
            fill="none"
            stroke="url(#rimGradient)"
            strokeWidth={2.5}
            opacity={0.6}
            filter="url(#softBlur)"
            style={{ transformOrigin: "200px 200px", scale: 1.035 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { d: [DROPLET_PATH_A, DROPLET_PATH_B, DROPLET_PATH_A] }
            }
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.path
            d={DROPLET_PATH_A}
            fill="url(#dropletGradient)"
            animate={
              prefersReducedMotion
                ? undefined
                : { d: [DROPLET_PATH_A, DROPLET_PATH_B, DROPLET_PATH_A] }
            }
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <ellipse
            cx={165}
            cy={150}
            rx={34}
            ry={52}
            fill="white"
            opacity={0.28}
            filter="url(#softBlur)"
            transform="rotate(-18 165 150)"
          />
          <ellipse cx={178} cy={122} rx={9} ry={14} fill="white" opacity={0.55} />

          {!prefersReducedMotion &&
            particles.map((p) => (
              <OrbitParticle key={p.id} particle={p} globalT={globalT} />
            ))}
        </motion.svg>
      </motion.div>
    </div>
  );
}
