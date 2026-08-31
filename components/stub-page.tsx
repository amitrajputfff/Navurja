import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteDock } from "@/components/site-dock";
import { SiteNav } from "@/components/site-nav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function StubPage({
  eyebrow,
  title,
  breadcrumbs,
  wide = false,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Trail after "Home" — the current page is always the last, non-linked crumb. */
  breadcrumbs: { label: string; href?: string }[];
  /** Wider content column for pages with their own internal layout (e.g. blog grids). */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="flex-1">
        <section className={wide ? "mx-auto max-w-6xl px-6 pt-28 pb-28" : "mx-auto max-w-3xl px-6 pt-28 pb-28"}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={crumb.href} />}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-nav-green">
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
