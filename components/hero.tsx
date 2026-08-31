"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Building2,
  Droplets,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { FloatingMetric } from "@/components/floating-metric";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { HERO_METRICS } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const HeroFrameSequence = dynamic(
  () =>
    import("@/components/hero-frame-sequence").then(
      (mod) => mod.HeroFrameSequence
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto aspect-video w-full max-w-[560px] animate-pulse rounded-3xl bg-nav-mint sm:max-w-[620px] lg:max-w-[640px]" />
    ),
  },
);

const METRIC_ICONS = [Droplets, Building2, Leaf];
const METRIC_POSITIONS = [
  "absolute -left-4 top-6 lg:-left-10",
  "absolute -right-2 top-1/2 -translate-y-1/2 lg:-right-8",
  "absolute bottom-2 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0",
];
const METRIC_DELAYS = [0.5, 0.65, 0.8];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  // Pin the hero in place for an extended scroll range so the full frame
  // sequence actually gets watched rather than blown through in the ~1
  // viewport-height the section naturally occupies. Reduced motion skips the
  // pin entirely and lets the page scroll normally past a static frame.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=200%",
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        onUpdate: (self) => scrollProgress.set(self.progress),
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion, scrollProgress]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%] bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-secondary)_0%,var(--color-background)_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-nav-light-green/40 blur-[120px]"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-8">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center lg:text-left"
        >
          {/* No repeated logo+wordmark here — SiteNav (fixed above the
              hero) already owns that mark, so this starts straight at the
              badge to avoid stacking two identical NavUrja marks on load. */}
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-nav-light-green bg-nav-mint px-3.5 py-1.5 text-xs font-medium tracking-wide text-nav-primary"
          >
            <Leaf className="size-3.5" />
            Turning Waste Into Energy
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="mt-6 text-balance text-[clamp(2.75rem,4.5vw+1.25rem,5.5rem)] font-bold leading-[0.98] tracking-tight text-nav-dark-text"
          >
            Give waste
            <br />
            <span className="inline-flex items-baseline justify-center gap-x-3 whitespace-nowrap lg:justify-start">
              a new
              <FlipWords
                words={["energy.", "power.", "future.", "impact."]}
                duration={2600}
                className="!p-0 bg-gradient-to-r from-nav-oil-gold to-nav-green bg-clip-text align-baseline whitespace-nowrap !text-transparent"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-md text-balance text-lg text-nav-muted lg:mx-0"
          >
            NavUrja collects used cooking oil and gives it a second life through
            responsible recycling and renewable energy.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button
              render={<a href="#pickup" />}
              nativeButton={false}
              size="lg"
              className="w-full rounded-full px-6 py-5 text-base sm:w-auto"
            >
              Request a Pickup <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<a href="#how-it-works" />}
              nativeButton={false}
              variant="ghost"
              size="lg"
              className="w-full rounded-full px-6 py-5 text-base text-nav-primary hover:bg-nav-mint sm:w-auto dark:text-nav-light-green dark:hover:bg-white/10"
            >
              See How It Works <ChevronDown className="size-4" />
            </Button>
          </motion.div>
        </motion.div>

        <div className="relative">
          <HeroFrameSequence progress={scrollProgress} />

          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            {HERO_METRICS.map((metric, index) => (
              <FloatingMetric
                key={metric.label}
                icon={METRIC_ICONS[index]}
                label={metric.label}
                value={metric.value}
                unit={metric.unit}
                delay={METRIC_DELAYS[index]}
                className={METRIC_POSITIONS[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
