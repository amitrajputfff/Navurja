import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { WHY_NAVURJA } from "@/lib/constants";

export function WhyNavurja() {
  return (
    <section className="bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            Better for your business.
            <br />
            Better for the{" "}
            <span className="text-nav-green">planet</span>.
          </h2>
        </Reveal>

        <RevealGroup
          staggerChildren={0.08}
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {WHY_NAVURJA.map(({ title, description, icon: Icon }) => (
            <StaggerItem key={title} className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-nav-primary ring-1 ring-border">
                <Icon className="size-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-nav-dark-text">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-nav-muted">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
