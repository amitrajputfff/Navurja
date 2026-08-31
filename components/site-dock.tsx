"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BarChart3, Recycle, Workflow } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Dock only surfaces the core scroll sections — About and Resources (FAQ)
// stay in the footer's full NAV_LINKS list but are dropped here per request.
const DOCK_LINKS = NAV_LINKS.filter(
  (link) => link.href !== "/#about" && link.href !== "/faqs"
);
const LINK_ICONS = [Workflow, Recycle, BarChart3];

export function SiteDock() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-opacity duration-300",
        hidden && "opacity-0"
      )}
    >
      <div className={cn("transition-[opacity]", hidden ? "pointer-events-none" : "pointer-events-auto")}>
        <Dock>
          <DockItem href="/" aria-label="Home">
            <DockIcon>
              <Image
                src="/logo-icon.png"
                alt=""
                width={28}
                height={28}
                className="size-full object-contain"
                priority
              />
            </DockIcon>
            <DockLabel>Home</DockLabel>
          </DockItem>

          {DOCK_LINKS.map((link, index) => {
            const Icon = LINK_ICONS[index];
            return (
              <DockItem key={link.href} href={link.href} aria-label={link.label}>
                <DockIcon>
                  <Icon className="size-full" strokeWidth={1.75} />
                </DockIcon>
                <DockLabel>{link.label}</DockLabel>
              </DockItem>
            );
          })}
        </Dock>
      </div>
    </div>
  );
}
