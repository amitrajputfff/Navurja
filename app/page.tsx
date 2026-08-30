import dynamic from "next/dynamic";
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
import { QuickDock } from "@/components/quick-dock";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollMorphHero } from "@/components/scroll-morph-hero-loader";

const CircularLoop = dynamic(
  () => import("@/components/circular-loop").then((mod) => mod.CircularLoop),
  {
    loading: () => <div className="h-[420px]" aria-hidden />,
  }
);

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <ScrollMorphHero />
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
      <QuickDock />
      <ThemeToggle />
    </>
  );
}
