"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
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
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { HERO_METRICS } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const OilVisual = dynamic(
  () => import("@/components/oil-visual").then((mod) => mod.OilVisual),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto aspect-square w-full max-w-[380px] animate-pulse rounded-full bg-nav-mint sm:max-w-[440px] lg:max-w-[520px]" />
    ),
  },
);

const METRIC_ICONS = [Droplets, Building2, Leaf];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useScrollProgress(sectionRef);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-28"
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
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-2 lg:justify-start"
          >
            <Image
              src="/logo-icon.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 scale-125 object-contain"
              priority
            />
            <span className="text-base font-semibold tracking-tight text-nav-primary">
              NavUrja
            </span>
          </motion.div>

          <motion.span
            variants={fadeInUp}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-nav-light-green bg-nav-mint px-3.5 py-1.5 text-xs font-medium tracking-wide text-nav-primary"
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
            a new{" "}
            <FlipWords
              words={["energy.", "power.", "purpose.", "life."]}
              duration={2600}
              className="!p-0 bg-gradient-to-r from-nav-oil-gold to-nav-green bg-clip-text align-baseline !text-transparent"
            />
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
              className="w-full rounded-full bg-nav-primary px-6 py-5 text-base text-white hover:bg-nav-deep-green sm:w-auto"
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
          <OilVisual progress={scrollProgress} />

          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <FloatingMetric
              icon={METRIC_ICONS[0]}
              label={HERO_METRICS[0].label}
              value={HERO_METRICS[0].value}
              unit={HERO_METRICS[0].unit}
              delay={0.5}
              className="absolute -left-4 top-6 lg:-left-10"
            />
            <FloatingMetric
              icon={METRIC_ICONS[1]}
              label={HERO_METRICS[1].label}
              value={HERO_METRICS[1].value}
              delay={0.65}
              className="absolute -right-2 top-1/2 -translate-y-1/2 lg:-right-8"
            />
            <FloatingMetric
              icon={METRIC_ICONS[2]}
              label={HERO_METRICS[2].label}
              value={HERO_METRICS[2].value}
              unit={HERO_METRICS[2].unit}
              delay={0.8}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
