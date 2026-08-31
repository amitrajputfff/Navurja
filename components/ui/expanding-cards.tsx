"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ExpandingCardItem {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: readonly ExpandingCardItem[];
  defaultActiveIndex?: number;
}

// Adapted from the common "expanding cards" community snippet — swapped the
// raw <img> for next/image (this project's convention for every other
// photo), dropped the `id`/`linkHref` props the original defined but never
// actually rendered, and restyled the collapsed-card vertical label and
// hover scrim to NavUrja's palette.
export const ExpandingCards = React.forwardRef<
  HTMLUListElement,
  ExpandingCardsProps
>(({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(
    defaultActiveIndex
  );
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridStyle = React.useMemo(() => {
    if (activeIndex === null) return {};
    const sizes = items
      .map((_, index) => (index === activeIndex ? "5fr" : "1fr"))
      .join(" ");
    return isDesktop
      ? { gridTemplateColumns: sizes }
      : { gridTemplateRows: sizes };
  }, [activeIndex, items, isDesktop]);

  return (
    <ul
      ref={ref}
      className={cn(
        "grid w-full gap-2",
        "h-[560px] md:h-[420px]",
        "transition-[grid-template-columns,grid-template-rows] duration-500 ease-out",
        className
      )}
      style={{
        ...gridStyle,
        ...(isDesktop
          ? { gridTemplateRows: "1fr" }
          : { gridTemplateColumns: "1fr" }),
      }}
      {...props}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className="group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-3xl border border-border md:min-w-[64px]"
          onMouseEnter={() => setActiveIndex(index)}
          onFocus={() => setActiveIndex(index)}
          onClick={() => setActiveIndex(index)}
          tabIndex={0}
          data-active={activeIndex === index}
        >
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="scale-110 object-cover grayscale transition-all duration-300 ease-out group-data-[active=true]:scale-100 group-data-[active=true]:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <article className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
            <h3 className="hidden origin-left rotate-90 text-sm font-semibold tracking-wide text-white/80 uppercase opacity-100 transition-opacity duration-300 ease-out group-data-[active=true]:opacity-0 md:block">
              {item.title}
            </h3>

            <div className="text-nav-light-green opacity-0 transition-opacity delay-75 duration-300 ease-out group-data-[active=true]:opacity-100">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-white opacity-0 transition-opacity delay-150 duration-300 ease-out group-data-[active=true]:opacity-100">
              {item.title}
            </h3>
            <p className="max-w-xs text-sm text-white/80 opacity-0 transition-opacity delay-225 duration-300 ease-out group-data-[active=true]:opacity-100">
              {item.description}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
});
ExpandingCards.displayName = "ExpandingCards";
