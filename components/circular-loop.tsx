"use client";

import { Reveal } from "@/components/reveal";
import { RadialOrbitalTimeline } from "@/components/ui/radial-orbital-timeline";
import { CIRCULAR_LOOP_STAGES } from "@/lib/constants";

export function CircularLoop() {
  return (
    <section className="relative overflow-hidden bg-nav-deep-green py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nav-green/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-oil-gold">
            The Loop
          </p>
          <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-white">
            A closed loop, not a dead end.
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Tap a node to see how each stage connects to the next.
          </p>
        </Reveal>

        <RadialOrbitalTimeline timelineData={CIRCULAR_LOOP_STAGES} />
      </div>
    </section>
  );
}
