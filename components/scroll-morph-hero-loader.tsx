"use client";

import dynamic from "next/dynamic";

const ScrollMorphHeroImpl = dynamic(
  () => import("@/components/scroll-morph-hero").then((mod) => mod.ScrollMorphHero),
  {
    ssr: false,
    loading: () => <div className="h-screen" aria-hidden />,
  },
);

export function ScrollMorphHero() {
  return <ScrollMorphHeroImpl />;
}
