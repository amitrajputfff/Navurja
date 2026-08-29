"use client";

import { useCountUp } from "@/hooks/use-count-up";

export function CounterStat({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const ref = useCountUp(target);

  return (
    <div className="text-center sm:text-left">
      <p className="text-[clamp(1.375rem,6.5cqi+0.6rem,2.5rem)] font-bold tracking-tight whitespace-nowrap text-white">
        <span ref={ref}>0</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/60">
        {label}
      </p>
    </div>
  );
}
