import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-nav-primary py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-nav-green/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 size-80 rounded-full bg-nav-oil-gold/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-balance text-[clamp(2.25rem,4vw+1rem,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Give waste
            <br />a new energy.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-balance text-lg text-white/70">
            Join the businesses helping build a more circular future.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            render={<a href="#pickup" />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full bg-white px-6 py-5 text-base text-nav-primary hover:bg-nav-mint sm:w-auto"
          >
            Request a Pickup <ArrowRight className="size-4" />
          </Button>
          <Button
            render={<a href="#pickup" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="glass-dark w-full rounded-full border-white/25 px-6 py-5 text-base text-white hover:bg-white/10 sm:w-auto"
          >
            Talk to NavUrja
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
