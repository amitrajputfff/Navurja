import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { SiteDock } from "@/components/site-dock";

export function StubPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pt-24 pb-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nav-green">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,3vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            {title}
          </h1>
          <div className="prose-navurja mt-8 text-nav-muted">{children}</div>
        </section>
      </main>
      <Footer />
      <SiteDock />
    </>
  );
}
