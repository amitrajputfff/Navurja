"use client";

import Carousel from "@/components/ui/carousel";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

const STEP_SLIDES = [
  { image: "/step-use.jpg", tag: "Daily kitchen use" },
  { image: "/step-store.jpg", tag: "Safely stored" },
  { image: "/step-collect.jpg", tag: "We collect it" },
  { image: "/step-transform.jpg", tag: "Becomes new energy" },
];

export function ProcessSection() {
  const slides = HOW_IT_WORKS_STEPS.map((step, index) => ({
    title: `${step.number} — ${step.title}`,
    button: STEP_SLIDES[index].tag,
    src: STEP_SLIDES[index].image,
  }));

  return (
    <section id="how-it-works" className="bg-secondary/20 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-green">
          How It Works
        </p>
        <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
          One simple loop.
          <br />A bigger impact.
        </h2>
      </div>

      <div className="mt-16">
        <Carousel slides={slides} />
      </div>
    </section>
  );
}
