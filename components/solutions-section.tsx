import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { SOLUTIONS } from "@/lib/constants";

export function SolutionsSection() {
  return (
    <section id="solutions" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-green">
            Built Around You
          </p>
          <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            Built around how your{" "}
            <span className="text-nav-green">kitchen works</span>.
          </h2>
          <p className="mt-4 text-sm text-nav-muted">
            Solutions for every kind of kitchen.
          </p>
        </Reveal>

        <RevealGroup
          amount={0.2}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {SOLUTIONS.map(({ title, description, icon: Icon, image }) => (
            <StaggerItem
              key={title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_-30px_rgba(11,61,46,0.25)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-1.5 p-5 pb-3">
                <h3 className="text-lg leading-tight font-bold text-nav-primary">
                  {title}
                </h3>
                <p className="text-sm text-nav-muted">{description}</p>
              </div>
              <div className="relative mt-auto h-48 w-full overflow-hidden sm:h-56">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-card/70"
                />
                <span className="absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-nav-deep-green shadow-sm">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
              </div>
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
