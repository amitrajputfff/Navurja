import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { CounterStat } from "@/components/counter-stat";
import { IMPACT_METRICS } from "@/lib/constants";

export function ImpactSection() {
  return (
    <section id="impact" className="relative overflow-hidden bg-nav-deep-green py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-nav-green/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-nav-oil-gold/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-light-green">
            Impact
          </p>
          <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-white">
            Numbers that will grow with every pickup.
          </h2>
          <p className="mt-4 text-white/60">
            Figures shown are illustrative placeholders and will update as
            NavUrja&apos;s network grows.
          </p>
        </Reveal>

        <RevealGroup
          staggerChildren={0.1}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
        >
          {IMPACT_METRICS.map((metric) => (
            <StaggerItem key={metric.label}>
              <CounterStat
                target={metric.target}
                suffix={metric.suffix}
                label={metric.label}
              />
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
