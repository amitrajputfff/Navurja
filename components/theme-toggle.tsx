"use client";

import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid a hydration mismatch: next-themes only knows the real resolved
  // theme after mount, so render nothing that depends on it until then.
  const mounted = useMounted();

  return (
    <AnimatedThemeToggler
      className={cn(
        "glass fixed top-5 right-5 z-40 flex size-10 items-center justify-center rounded-full text-nav-primary transition-transform hover:scale-105 [&_svg]:size-4.5",
        className
      )}
      aria-label="Toggle dark mode"
      theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={(theme) => setTheme(theme)}
    />
  );
}
