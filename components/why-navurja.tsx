import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { Highlighter } from "@/components/ui/highlighter";
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
            <Highlighter action="highlight" color="#BFE7C8" padding={4} isView>
              <span className="text-nav-primary">planet</span>
            </Highlighter>
            .
          </h2>
        </Reveal>

        <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {WHY_NAVURJA.map(({ title, description, icon: Icon }, index) => (
            <div
              key={title}
              className={cn(
                "group/feature relative flex flex-col border-border/70 py-10 lg:border-r",
                (index === 0 || index === 3) && "lg:border-l",
                index < 3 && "lg:border-b"
              )}
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
