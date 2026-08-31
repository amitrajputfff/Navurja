import { Reveal } from "@/components/reveal";
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
            <span className="relative inline-block whitespace-nowrap text-nav-primary">
              <span className="absolute inset-x-0 bottom-0.5 -z-10 h-[0.4em] rounded-sm bg-nav-light-green" />
              planet
            </span>
            .
          </h2>
        </Reveal>

        {/* Shared-border grid: the container draws the top/left edge, every
            cell draws its own right/bottom edge — this produces a correct
            divider grid at any column count without indexing into rows, so
            it doesn't go missing at md's 2 columns or leave a stray edge at
            lg's 3 (both real bugs the previous index-based `lg:`-only
            conditionals had). */}
        <div className="relative z-10 mt-16 grid grid-cols-1 border-t border-l border-border/70 md:grid-cols-2 lg:grid-cols-3">
          {WHY_NAVURJA.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group/feature relative flex flex-col border-r border-b border-border/70 py-10"
            >
              <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-nav-mint to-transparent opacity-0 transition duration-300 group-hover/feature:opacity-100" />
              <div className="relative z-10 mb-4 px-8 text-nav-primary">
                <Icon className="size-6" strokeWidth={1.5} />
              </div>
              <div className="relative z-10 mb-2 px-8 text-lg font-semibold">
                <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-nav-light-green transition-all duration-300 group-hover/feature:h-8 group-hover/feature:bg-nav-green" />
                <span className="inline-block text-nav-dark-text transition-transform duration-300 group-hover/feature:translate-x-2">
                  {title}
                </span>
              </div>
              <p className="relative z-10 max-w-xs px-8 text-sm text-nav-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
