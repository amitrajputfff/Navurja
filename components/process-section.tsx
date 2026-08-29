"use client";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

const STEP_SLIDES = [
  { image: "/step-use.jpg", tag: "Daily kitchen use" },
  { image: "/step-store.jpg", tag: "Safely stored" },
  { image: "/step-collect.jpg", tag: "We collect it" },
  { image: "/step-transform.jpg", tag: "Becomes new energy" },
];

export function ProcessSection() {
  const items = HOW_IT_WORKS_STEPS.map((step, index) => (
    <Card
      key={step.number}
      index={index}
      card={{
        category: `${step.number} — ${STEP_SLIDES[index].tag}`,
        title: step.title,
        src: STEP_SLIDES[index].image,
        content: (
          <p className="mx-auto max-w-2xl text-base text-nav-dark-text/80 md:text-lg">
            {step.description}
          </p>
        ),
      }}
    />
  ));

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

      <div className="mt-8">
        <Carousel items={items} />
      </div>
    </section>
  );
}
