"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Visible over the hero, then fades out once the hero (`#top`) scrolls out
 * of view — leaving just the floating SiteDock for in-page navigation, per
 * request. Pages with no `#top` section (About, Blog, FAQs, legal) have no
 * hero to fade past, so the nav just stays visible there instead of
 * vanishing with nothing to replace it.
 */
export function SiteNav() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 px-4 transition-all duration-300 sm:px-6",
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
        !visible && "pointer-events-none"
      )}
    >
      <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between gap-4 rounded-full border border-black/5 bg-white/80 px-5 py-3 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] backdrop-blur-md sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo-icon.png"
            alt=""
            width={26}
            height={26}
            className="size-6.5 object-contain"
          />
          <span className="text-sm font-semibold tracking-tight text-nav-primary">NavUrja</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-nav-muted transition-colors hover:text-nav-dark-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          render={<Link href="/#pickup" />}
          nativeButton={false}
          size="sm"
          className="shrink-0 rounded-full px-4"
        >
          Request Pickup <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </header>
  );
}
