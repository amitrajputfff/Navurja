import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export function ProcessSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            One simple loop.
            <br />A bigger impact.
          </h2>
        </Reveal>

        <RevealGroup
          staggerChildren={0.15}
          className="relative mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          <div
            aria-hidden
            className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-nav-light-green)_0,var(--color-nav-light-green)_8px,transparent_8px,transparent_16px)] lg:block"
          />
          {HOW_IT_WORKS_STEPS.map((step) => (
            <StaggerItem key={step.number} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl bg-nav-primary text-lg font-bold text-white shadow-lg shadow-nav-primary/20">
                {step.number}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-nav-dark-text">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-nav-muted">{step.description}</p>
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
