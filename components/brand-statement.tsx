import { Reveal } from "@/components/reveal";
import { scaleIn } from "@/lib/animations";

export function BrandStatement() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal variants={scaleIn}>
          <h2 className="text-balance text-[clamp(2.25rem,5vw+1rem,5rem)] font-bold leading-[1.05] tracking-tight text-nav-dark-text">
            Nothing useful
            <br />
            should be wasted.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-balance text-lg text-nav-muted">
            NavUrja is building a cleaner loop for one of the world&apos;s
            most overlooked resources.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
