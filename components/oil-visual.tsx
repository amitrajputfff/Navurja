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

const PARTICLE_COLORS: [string, string, string] = ["#a3a3a3", "#93c5fd", "#3b82f6"];

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
        className="absolute inset-[8%] -z-10 rounded-full bg-blue-300/25 blur-[70px]"
      />
      <div
        aria-hidden
        className="absolute inset-[16%] -z-10 rounded-full bg-nav-green/20 blur-[85px]"
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
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full overflow-visible"
            style={{ filter: "drop-shadow(0 30px 60px rgba(30,58,138,0.35))" }}
            role="img"
            aria-label="A glossy translucent blue droplet, symbolizing used cooking oil transforming into clean energy."
          >
            <defs>
              <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="dropClip" clipPathUnits="userSpaceOnUse">
                <path d="M200,52 C272,138 347,204 347,273 C347,340 282,390 200,390 C118,390 53,340 53,273 C53,204 128,138 200,52 Z" />
              </clipPath>
              <radialGradient id="dropShade" cx="32%" cy="26%" r="75%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Orbit ring */}
            <circle
              cx={200}
              cy={210}
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

            {/* Oil droplet */}
            <g clipPath="url(#dropClip)">
              <foreignObject x="0" y="0" width="400" height="400">
                <motion.div
                  style={{
                    width: "100%",
                    height: "100%",
                    ...(prefersReducedMotion ? {} : { rotate: swirlRotate }),
                  }}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      background:
                        "linear-gradient(175deg, rgba(219,234,254,0.5) 0%, rgba(147,197,253,0.6) 35%, rgba(59,130,246,0.72) 70%, rgba(29,78,216,0.8) 100%)",
                    }}
                  />
                </motion.div>
              </foreignObject>

              {/* Sphere shading for depth */}
              <rect
                x={0}
                y={0}
                width={400}
                height={400}
                fill="url(#dropShade)"
              />
              <rect
                x={0}
                y={0}
                width={400}
                height={400}
                fill="rgba(30,58,138,0.3)"
                style={{ mixBlendMode: "multiply" }}
              />
            </g>

            {/* Glass rim */}
            <path
              d="M200,52 C272,138 347,204 347,273 C347,340 282,390 200,390 C118,390 53,340 53,273 C53,204 128,138 200,52 Z"
              fill="none"
              stroke="white"
              strokeOpacity={0.45}
              strokeWidth={2}
            />

            {/* Specular highlight */}
            <ellipse
              cx={148}
              cy={150}
              rx={38}
              ry={54}
              fill="white"
              opacity={0.55}
              filter="url(#particleGlow)"
              transform="rotate(-18 148 150)"
            />
            <ellipse cx={160} cy={122} rx={9} ry={13} fill="white" opacity={0.85} />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
