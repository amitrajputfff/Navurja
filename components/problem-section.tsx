"use client";

import { MoveHorizontal } from "lucide-react";
import { Compare } from "@/components/ui/compare";
import { Reveal } from "@/components/reveal";
import { scaleIn } from "@/lib/animations";

export function ProblemSection() {
  return (
    <section id="approach" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            Cooking oil doesn&apos;t have to end in the drain.
          </h2>
          <p className="mt-4 text-lg text-nav-muted">
            Used cooking oil is valuable when it&apos;s collected and handled
            responsibly &mdash; not poured away.
          </p>
        </Reveal>

        <Reveal variants={scaleIn} delay={0.1} className="mt-14">
          <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_80px_-30px_rgba(11,61,46,0.3)]">
            <Compare
              firstImage="/compare-old-way.svg"
              secondImage="/compare-new-way.svg"
              firstImageClassName="object-cover"
              secondImageClassname="object-cover"
              className="aspect-[4/3] w-full rounded-[2rem]"
              slideMode="hover"
              autoplay
              autoplayDuration={4000}
            />
            <span className="pointer-events-none absolute top-4 left-4 z-30 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              The old way
            </span>
            <span className="pointer-events-none absolute top-4 right-4 z-30 rounded-full bg-nav-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              The NavUrja way
            </span>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-nav-muted">
            <MoveHorizontal className="size-3.5" /> Drag to see the difference
          </p>
        </Reveal>
      </div>
    </section>
  );
}
