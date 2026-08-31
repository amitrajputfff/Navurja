import { ChefHat, ChevronRight, Leaf, Package, Truck, Zap } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEP_ICONS = [ChefHat, Package, Truck, Zap, Leaf];
// The step the reference design calls out as the "active" moment of the
// loop — NavUrja's own part of it, between the customer's use/store and the
// transform/power outcome.
const FEATURED_INDEX = 2;

export function ProcessSection() {
  return (
    <section id="how-it-works" className="bg-secondary/20 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-green">
            Our Process
          </p>
          <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            One simple <span className="text-nav-green">loop</span>.
            <br />A bigger <span className="text-nav-green">impact</span>.
          </h2>
        </Reveal>
      </div>

      <RevealGroup
        amount={0.3}
        className="mx-auto mt-16 max-w-5xl px-6"
      >
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index];
            const isFeatured = index === FEATURED_INDEX;
            return (
              <div key={step.number} className="flex flex-1 items-start">
                <StaggerItem className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={cn(
                      "flex size-[72px] shrink-0 items-center justify-center rounded-full bg-background shadow-[0_8px_24px_-12px_rgba(15,45,35,0.25)]",
                      isFeatured &&
                        "ring-2 ring-nav-light-green ring-offset-4 ring-offset-secondary/20"
                    )}
                  >
                    <Icon
                      className="size-7 text-nav-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="mt-4 text-sm font-bold text-nav-dark-text">
                    {step.number}
                  </span>
                  <p className="mt-1 text-base font-semibold text-nav-dark-text">
                    {step.title}
                  </p>
                  <p className="mt-1.5 max-w-[10rem] text-sm text-nav-muted">
                    {step.description}
                  </p>
                </StaggerItem>
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden shrink-0 items-center pt-9 text-nav-light-green sm:flex"
                  >
                    <ChevronRight className="size-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </RevealGroup>
    </section>
  );
}
