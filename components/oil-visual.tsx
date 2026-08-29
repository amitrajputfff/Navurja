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

const PARTICLE_COLORS: [string, string, string] = ["#8a978f", "#D9A441", "#5FAF72"];

type Particle = {
  id: number;
  radius: number;
  yFactor: number;
  phase: number;
  speed: number;
  size: number;
};

const PARTICLES: Particle[] = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  radius: 178 + ((i * 31) % 22),
  yFactor: 0.58 + ((i % 3) * 0.03),
  phase: (Math.PI * 2 * i) / 7,
  speed: 0.24 + (i % 4) * 0.035,
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
    (a) => 0.5 + 0.5 * Math.max(0, Math.sin(a))
  );

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={particle.size}
      fill={fill}
      style={{ opacity }}
      filter="url(#particleGlow)"
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

  const rotateX = useTransform(pointerY, [-1, 1], [8, -8]);
  const rotateY = useTransform(pointerX, [-1, 1], [-8, 8]);
  const swirlRotate = useTransform(globalT, (t) => t * 9);

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
        className="absolute inset-[8%] -z-10 rounded-full bg-nav-oil-gold/20 blur-[70px]"
      />
      <div
        aria-hidden
        className="absolute inset-[16%] -z-10 rounded-full bg-nav-green/25 blur-[85px]"
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { scale, y: translateY, opacity: sceneOpacity, perspective: 1200 }
        }
        className="relative h-full w-full"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { rotateX, rotateY, transformStyle: "preserve-3d" }
          }
          className="relative h-full w-full"
        >
          {/* Orbit ring + particles */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
          >
            <defs>
              <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx={200}
              cy={200}
              r={187}
              fill="none"
              stroke="var(--color-nav-light-green)"
              strokeOpacity={0.4}
              strokeDasharray="1.5 11"
              strokeLinecap="round"
            />
            {!prefersReducedMotion &&
              particles.map((p) => (
                <OrbitParticle key={p.id} particle={p} globalT={globalT} />
              ))}
          </svg>

          {/* Energy orb */}
          <div
            className="absolute inset-[19%] overflow-hidden rounded-full shadow-[0_30px_90px_-20px_rgba(11,61,46,0.45)]"
            role="img"
            aria-label="A glowing sphere of swirling green and gold energy, representing used cooking oil transforming into renewable power."
          >
            <motion.div
              aria-hidden
              className="absolute inset-[-40%]"
              style={
                prefersReducedMotion
                  ? undefined
                  : { rotate: swirlRotate }
              }
              initial={false}
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #073B2A 0deg, #0B3D2E 70deg, #5FAF72 150deg, #D9A441 230deg, #073B2A 300deg, #073B2A 360deg)",
                }}
              />
            </motion.div>

            {/* Sphere shading for depth */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 34%), radial-gradient(circle at 68% 78%, rgba(7,59,42,0.55) 0%, rgba(7,59,42,0) 55%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
              }}
            />

            {/* Specular highlight */}
            <div
              aria-hidden
              className="absolute top-[14%] left-[18%] h-[26%] w-[26%] rounded-full bg-white/70 blur-xl"
            />
            <div
              aria-hidden
              className="absolute top-[20%] left-[24%] h-[7%] w-[7%] rounded-full bg-white/90 blur-[2px]"
            />

            {/* Rim light */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/25"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
