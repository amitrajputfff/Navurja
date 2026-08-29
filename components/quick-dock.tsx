"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Recycle, Workflow, BarChart3, Truck } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";

const DOCK_ITEMS = [
  {
    title: "NavUrja",
    icon: (
      <Image
        src="/logo-icon.png"
        alt=""
        width={40}
        height={40}
        className="h-full w-full scale-125 object-contain"
        priority
      />
    ),
    href: "#top",
  },
  { title: "Solutions", icon: <Recycle className="h-full w-full" />, href: "#solutions" },
  {
    title: "How It Works",
    icon: <Workflow className="h-full w-full" />,
    href: "#how-it-works",
  },
  { title: "Impact", icon: <BarChart3 className="h-full w-full" />, href: "#impact" },
  { title: "Request Pickup", icon: <Truck className="h-full w-full" />, href: "#pickup" },
];

export function QuickDock() {
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
      className={`transition-opacity duration-300 ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <FloatingDock
        items={DOCK_ITEMS}
        desktopClassName="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
        mobileClassName="fixed right-5 bottom-5 z-40"
      />
    </div>
  );
}
