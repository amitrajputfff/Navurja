import { Reveal } from "@/components/reveal";
import { ExpandingCards } from "@/components/ui/expanding-cards";
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

        <Reveal delay={0.1} className="mt-14">
          <ExpandingCards
            items={SOLUTIONS.map(({ title, description, icon: Icon, image }) => ({
              title,
              description,
              image,
              icon: <Icon className="size-6" strokeWidth={1.75} />,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
