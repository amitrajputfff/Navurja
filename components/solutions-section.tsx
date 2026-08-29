import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { SOLUTIONS } from "@/lib/constants";

export function SolutionsSection() {
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
        </Reveal>

        <RevealGroup
          staggerChildren={0.08}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SOLUTIONS.map(({ title, description, icon: Icon }) => (
            <StaggerItem
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-nav-light-green hover:shadow-xl hover:shadow-nav-primary/10"
            >
              <div
                aria-hidden
                className="absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br from-nav-oil-gold/0 to-nav-green/0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:from-nav-oil-gold/20 group-hover:to-nav-green/20 group-hover:opacity-100"
              />
              <div className="relative flex size-12 items-center justify-center rounded-xl bg-nav-mint text-nav-primary transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-5.5" strokeWidth={1.5} />
              </div>
              <h3 className="relative mt-5 text-lg font-semibold text-nav-dark-text">
                {title}
              </h3>
              <p className="relative mt-1.5 text-sm text-nav-muted">
                {description}
              </p>
              <div className="relative mt-5 flex items-center gap-1.5 text-sm font-medium text-nav-primary">
                Learn more
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
