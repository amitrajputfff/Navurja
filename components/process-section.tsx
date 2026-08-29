"use client";

import { useState } from "react";
import Image from "next/image";
import { Lens } from "@/components/ui/lens";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

const STEP_SLIDES = [
  { image: "/step-use.jpg", tag: "Daily kitchen use" },
  { image: "/step-store.jpg", tag: "Safely stored" },
  { image: "/step-collect.jpg", tag: "We collect it" },
  { image: "/step-transform.jpg", tag: "Becomes new energy" },
];

function StepCard({ index }: { index: number }) {
  const step = HOW_IT_WORKS_STEPS[index];
  const slide = STEP_SLIDES[index];
  const [hovering, setHovering] = useState(false);

  return (
    <div className="glass w-full overflow-hidden rounded-3xl p-2 shadow-[0_20px_50px_-20px_rgba(11,61,46,0.35)]">
      <div className="relative h-80 w-full overflow-hidden rounded-2xl">
        <Lens hovering={hovering} setHovering={setHovering} zoomFactor={1.6} lensSize={130}>
          <Image
            src={slide.image}
            alt={step.title}
            fill
            sizes="(min-width: 1024px) 280px, 45vw"
            className="object-cover"
          />
        </Lens>

        <span className="glass pointer-events-none absolute top-3 left-3 z-30 rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-nav-primary uppercase">
          {step.number}
        </span>

        <div className="glass-dark pointer-events-none absolute inset-x-3 bottom-3 z-30 rounded-2xl px-4 py-3">
          <p className="text-[0.65rem] font-semibold tracking-wide text-nav-oil-gold uppercase">
            {slide.tag}
          </p>
          <p className="mt-0.5 text-lg font-semibold text-white">{step.title}</p>
        </div>
      </div>
    </div>
  );
}

export function ProcessSection() {
  return (
    <section id="how-it-works" className="bg-secondary/20 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-oil-gold">
          How It Works
        </p>
        <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
          One simple loop.
          <br />A bigger impact.
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-5 px-6 sm:gap-6 lg:grid-cols-4">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <StepCard key={step.number} index={index} />
        ))}
      </div>
    </section>
  );
}
