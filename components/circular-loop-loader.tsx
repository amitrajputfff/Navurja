"use client";

import dynamic from "next/dynamic";

// `next/dynamic`'s `ssr: false` option can't be used from a Server
// Component (app/page.tsx) — it has to live inside a Client Component,
// hence this one-line wrapper file.
export const CircularLoop = dynamic(
  () => import("@/components/circular-loop").then((mod) => mod.CircularLoop),
  {
    ssr: false,
    loading: () => <div className="h-[820px]" aria-hidden />,
  }
);
