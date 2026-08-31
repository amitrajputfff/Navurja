import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { ProcessSection } from "@/components/process-section";
import { PickupForm } from "@/components/pickup-form";
import { SolutionsSection } from "@/components/solutions-section";
import { WhyNavurja } from "@/components/why-navurja";
import { ImpactSection } from "@/components/impact-section";
import { BrandStatement } from "@/components/brand-statement";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { SiteDock } from "@/components/site-dock";
import { SiteNav } from "@/components/site-nav";
import { CircularLoop } from "@/components/circular-loop-loader";

// ScrollStage (the fixed WebGL background layer, components/scroll-stage.tsx)
// is deliberately not mounted right now — paused at the user's request while
// its behavior gets sorted out. The component itself is untouched, just not
// rendered here; re-add `<ScrollStage />` above `<SiteDock />` to bring it
// back once it's ready.

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="flex-1">
        <Hero />
        <ProblemSection />
        <ProcessSection />
        <PickupForm />
        <SolutionsSection />
        <WhyNavurja />
        <ImpactSection />
        <CircularLoop />
        <BrandStatement />
        <FinalCta />
      </main>
      <Footer />
      <SiteDock />
    </>
  );
}
