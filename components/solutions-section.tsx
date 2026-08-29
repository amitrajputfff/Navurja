"use client";

import Image from "next/image";
import { Cards } from "@/blocks/interface-crafts-cards";
import { Reveal } from "@/components/reveal";
import { SOLUTIONS } from "@/lib/constants";

const CARD_STYLES = [
  {
    className: "bg-nav-primary [&_h2]:text-white",
    image: "/solution-restaurants.jpg",
    config: { y: -20, rotate: -15, zIndex: 2 },
  },
  {
    className: "bg-nav-oil-gold [&_h2]:text-nav-deep-green [&_p]:text-nav-deep-green/80",
    image: "/solution-hotels.jpg",
    config: { y: 20, rotate: 8, zIndex: 3 },
  },
  {
    className: "bg-nav-mint [&_h2]:text-nav-primary [&_p]:text-nav-dark-text/80",
    image: "/solution-cloud-kitchens.jpg",
    config: { y: -80, rotate: -5, zIndex: 4 },
  },
  {
    className: "bg-nav-green [&_h2]:text-white",
    image: "/solution-caterers.jpg",
    config: { y: 20, rotate: 12, zIndex: 5 },
  },
  {
    className: "bg-nav-deep-green [&_h2]:text-white",
    image: "/solution-food-businesses.jpg",
    config: { y: 20, rotate: -5, zIndex: 6 },
  },
  {
    className: "bg-white ring-1 ring-nav-light-green [&_h2]:text-nav-primary [&_p]:text-nav-dark-text/80",
    image: "/solution-commercial-kitchens.jpg",
    config: { y: -30, rotate: 16, zIndex: 7 },
  },
];

export function SolutionsSection() {
  const cards = SOLUTIONS.map(({ title, description, icon: Icon }, index) => {
    const style = CARD_STYLES[index];
    return {
      title,
      description,
      className: style.className,
      config: style.config,
      skeleton: (
        <div className="relative h-50 w-full overflow-hidden rounded-xl">
          <Image
            src={style.image}
            alt=""
            fill
            sizes="300px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
          <span className="absolute top-2.5 left-2.5 flex size-8 items-center justify-center rounded-full bg-white/90 text-nav-primary">
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      ),
    };
  });

  return (
    <section id="solutions" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-green">
            Solutions
          </p>
          <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            Built around how your kitchen works.
          </h2>
          <p className="mt-4 text-sm text-nav-muted">
            Tap a card to see how NavUrja fits your business.
          </p>
        </Reveal>

        <div className="mt-4">
          <Cards cards={cards} />
        </div>
      </div>
    </section>
  );
}
