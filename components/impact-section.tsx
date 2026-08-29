import Image from "next/image";
import { Leaf } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { CounterStat } from "@/components/counter-stat";
import { IMPACT_METRICS } from "@/lib/constants";

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-nav-deep-green">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-nav-green/20 blur-[120px]"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-nav-light-green">
                <Leaf className="size-3.5" /> The NavUrja Impact
              </span>
              <h2 className="mt-4 text-balance text-[clamp(1.75rem,2.5vw+1rem,2.75rem)] font-bold tracking-tight text-white">
                Real impact. Measurable change.
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/60">
                Figures shown are illustrative placeholders and will update
                as NavUrja&apos;s network grows.
              </p>

              <RevealGroup
                staggerChildren={0.1}
                className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10"
              >
                {IMPACT_METRICS.map((metric) => (
                  <StaggerItem key={metric.label} className="@container">
                    <CounterStat
                      target={metric.target}
                      suffix={metric.suffix}
                      label={metric.label}
                    />
                  </StaggerItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal
              variants={{
                hidden: { opacity: 0, scale: 1.04 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
              }}
              className="relative min-h-[280px]"
            >
              <Image
                src="/leaf-macro.jpg"
                alt="Close-up of green leaves catching sunlight"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nav-deep-green via-nav-deep-green/10 to-transparent lg:bg-gradient-to-l" />
              <div className="glass-dark absolute bottom-6 left-6 max-w-[70%] rounded-2xl px-4 py-3 text-sm text-white sm:left-8">
                Every pickup keeps used oil out of drains and landfills.
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
