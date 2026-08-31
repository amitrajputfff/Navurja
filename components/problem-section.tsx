import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageCompare } from "@/components/ui/image-compare";
import { Reveal } from "@/components/reveal";
import { scaleIn } from "@/lib/animations";

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-muted">
            The Problem
          </p>
          <h2 className="mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            Cooking oil doesn&apos;t have to end{" "}
            <span className="text-nav-green">in the drain</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-nav-muted lg:mx-0">
            Used cooking oil poured down the drain causes blocked pipes,
            water pollution, and harm to marine life.
          </p>
          <Link
            href="/#how-it-works"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-nav-primary transition-colors hover:text-nav-green"
          >
            Learn More <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <Reveal variants={scaleIn} delay={0.1}>
          <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_80px_-30px_rgba(11,61,46,0.3)]">
            <ImageCompare
              beforeSrc="/problem.png"
              afterSrc="/solution.png"
              beforeAlt="Used cooking oil poured down a kitchen drain, clogging it with residue"
              afterAlt="NavUrja's drain-safe solution keeping pipes clean and the water clear"
              className="aspect-[3/2] rounded-[2rem]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
