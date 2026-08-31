"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCompareProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  initialInset?: number;
}

/** Drag-to-reveal before/after image slider. The boundary sits at `inset`%
 * from the left: `beforeSrc` shows to its left, `afterSrc` shows through to
 * its right. Handle is drag-first (mouse + touch), not hover-driven — no
 * autoplay, no forever-running timer, nothing to pause off-screen. */
export function ImageCompare({
  beforeSrc,
  afterSrc,
  beforeAlt = "",
  afterAlt = "",
  className,
  initialInset = 50,
}: ImageCompareProps) {
  const [inset, setInset] = useState(initialInset);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (clientX === undefined) return;
      const x = clientX - rect.left;
      setInset(Math.min(100, Math.max(0, (x / rect.width) * 100)));
    },
    []
  );

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    updateFromPointer(e);
  };

  return (
    <div
      className={cn("relative w-full touch-none overflow-hidden select-none", className)}
      onMouseMove={onMove}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={onMove}
      onTouchEnd={() => setDragging(false)}
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(min-width: 1024px) 576px, 100vw"
        className="absolute inset-0 object-cover"
        draggable={false}
      />
      <Image
        src={beforeSrc}
        alt={beforeAlt}
        fill
        sizes="(min-width: 1024px) 576px, 100vw"
        className="absolute inset-0 z-10 object-cover"
        style={{ clipPath: `inset(0 ${100 - inset}% 0 0)` }}
        draggable={false}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute top-0 z-20 h-full w-0.5 -ml-px bg-white/80"
        style={{ left: `${inset}%` }}
      />
      <button
        type="button"
        aria-label="Drag to compare the old way and the NavUrja way"
        className="absolute top-1/2 z-30 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-nav-deep-green shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nav-deep-green"
        style={{ left: `${inset}%` }}
        onMouseDown={(e) => {
          setDragging(true);
          updateFromPointer(e);
        }}
        onTouchStart={(e) => {
          setDragging(true);
          updateFromPointer(e);
        }}
        onMouseUp={() => setDragging(false)}
        onTouchEnd={() => setDragging(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setInset((v) => Math.max(0, v - 5));
          if (e.key === "ArrowRight") setInset((v) => Math.min(100, v + 5));
        }}
      >
        <GripVertical className="size-4" />
      </button>
    </div>
  );
}
