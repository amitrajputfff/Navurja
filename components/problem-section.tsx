import { ArrowDown, ChefHat, Droplet, Trash2, Truck, Recycle, Zap } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { slideInLeft, slideInRight } from "@/lib/animations";

const OLD_WAY = [
  { icon: ChefHat, label: "Kitchen" },
  { icon: Droplet, label: "Drain" },
  { icon: Trash2, label: "Waste" },
];

const NAVURJA_WAY = [
  { icon: ChefHat, label: "Kitchen" },
  { icon: Truck, label: "Collection" },
  { icon: Recycle, label: "Processing" },
  { icon: Zap, label: "Renewable Energy" },
];

function PathwayColumn({
  heading,
  steps,
  tone,
}: {
  heading: string;
  steps: { icon: typeof ChefHat; label: string }[];
  tone: "muted" | "brand";
}) {
  return (
    <div
      className={`rounded-3xl border p-8 ${
        tone === "muted"
          ? "border-border bg-secondary/30"
          : "border-nav-light-green bg-gradient-to-b from-nav-mint to-background"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
          tone === "muted" ? "text-nav-muted" : "text-nav-primary"
        }`}
      >
        {heading}
      </p>
      <div className="mt-6 flex flex-col items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-2">
            <div
              className={`flex size-16 items-center justify-center rounded-2xl ${
                tone === "muted"
                  ? "bg-background text-nav-muted"
                  : "bg-nav-primary text-white shadow-lg shadow-nav-primary/20"
              }`}
            >
              <step.icon className="size-6" strokeWidth={1.5} />
            </div>
            <p
              className={`text-sm font-medium ${
                tone === "muted" ? "text-nav-muted" : "text-nav-dark-text"
              }`}
            >
              {step.label}
            </p>
            {i < steps.length - 1 && (
              <ArrowDown
                className={`my-1 size-4 ${tone === "muted" ? "text-nav-muted/50" : "text-nav-green"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            Cooking oil doesn&apos;t have to end in the drain.
          </h2>
          <p className="mt-4 text-lg text-nav-muted">
            Used cooking oil is valuable when it&apos;s collected and handled
            responsibly &mdash; not poured away.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <Reveal variants={slideInLeft}>
            <PathwayColumn heading="The Old Way" steps={OLD_WAY} tone="muted" />
          </Reveal>
          <Reveal variants={slideInRight} delay={0.1}>
            <PathwayColumn heading="The NavUrja Way" steps={NAVURJA_WAY} tone="brand" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
