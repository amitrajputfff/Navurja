import { Reveal, RevealGroup } from "@/components/reveal";
import { StaggerItem } from "@/components/stagger-item";
import { BUSINESS_CATEGORIES } from "@/lib/constants";

export function TrustStrip() {
  return (
    <section id="about" className="border-y border-border/60 bg-secondary/40 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-muted">
            Built for India&apos;s food ecosystem
          </p>
        </Reveal>

        <RevealGroup
          staggerChildren={0.06}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {BUSINESS_CATEGORIES.map(({ label, icon: Icon }) => (
            <StaggerItem
              key={label}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-transparent px-4 py-5 text-center transition-colors hover:border-border hover:bg-background"
            >
              <Icon
                className="size-6 text-nav-muted transition-colors group-hover:text-nav-primary"
                strokeWidth={1.5}
              />
              <span className="text-sm font-medium text-nav-dark-text/80">
                {label}
              </span>
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
