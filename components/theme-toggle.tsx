"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function ThemeToggle() {
  return (
    <AnimatedThemeToggler
      className="glass fixed top-5 right-5 z-40 flex size-11 items-center justify-center rounded-full text-nav-primary transition-transform hover:scale-105"
      aria-label="Toggle dark mode"
    />
  );
}
