"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Leaf, Link as LinkIcon, Zap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Adapted from the common "radial orbital timeline" community snippet:
// restyled from its dark-native purple/blue/teal-on-black demo palette to
// NavUrja's gold/green-on-deep-green tokens, sized to sit inline inside a
// section (the original was `h-screen w-full`, meant as a standalone
// full-viewport route) instead of taking over the page, and using this
// project's own Badge/Button/Card (Base UI-backed) rather than the
// Radix/shadcn versions the snippet shipped with, which use a different
// underlying primitive than the rest of this app's UI kit.

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  icon: LucideIcon;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export function RadialOrbitalTimeline({
  timelineData,
}: {
  timelineData: readonly TimelineItem[];
}) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Nodes are positioned at this pixel radius from center — it has to match
  // the orbit ring div's own actual rendered radius (size-72 / sm:size-[22rem]
  // below) or the icons float visibly off the ring instead of sitting on it.
  const [radius, setRadius] = useState(144);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setRadius(mq.matches ? 176 : 144);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      const opening = !prev[id];
      newState[id] = opening;

      if (opening) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>;

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
      }, 50);
    }

    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    if (nodeIndex === -1) return;
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.65, Math.min(1, 0.65 + 0.35 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? [...currentItem.relatedIds] : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-nav-deep-green bg-nav-light-green border-nav-light-green";
      case "in-progress":
        return "text-white bg-nav-green/90 border-nav-green";
      case "pending":
        return "text-white/70 bg-white/10 border-white/25";
      default:
        return "text-white/70 bg-white/10 border-white/25";
    }
  };

  return (
    <div
      className="relative flex h-[460px] w-full items-center justify-center overflow-hidden sm:h-[560px]"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div
        className="absolute flex h-full w-full items-center justify-center"
        ref={orbitRef}
        style={{ perspective: "1000px" }}
      >
        <div className="absolute z-10 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-nav-oil-gold via-nav-green to-nav-primary">
          <div className="absolute size-[4.5rem] animate-ping rounded-full border border-white/20 opacity-70" />
          <div
            className="absolute size-20 animate-ping rounded-full border border-white/10 opacity-50"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md">
            <Leaf className="size-4 text-nav-deep-green" strokeWidth={2} />
          </div>
        </div>

        <div className="absolute size-72 rounded-full border border-white/25 sm:size-[22rem]" />

        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          const nodeStyle = {
            transform: `translate(${position.x}px, ${position.y}px)`,
            zIndex: isExpanded ? 200 : position.zIndex,
            opacity: isExpanded ? 1 : position.opacity,
          };

          return (
            <div
              key={item.id}
              ref={(el) => {
                nodeRefs.current[item.id] = el;
              }}
              className="absolute cursor-pointer transition-all duration-700"
              style={nodeStyle}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              <div
                className={cn("absolute -inset-1 rounded-full", isPulsing && "animate-pulse duration-1000")}
                style={{
                  background:
                    "radial-gradient(circle, rgba(46,158,91,0.35) 0%, rgba(46,158,91,0) 70%)",
                  width: `${item.energy * 0.4 + 40}px`,
                  height: `${item.energy * 0.4 + 40}px`,
                  left: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                  top: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                }}
              />

              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-full border-2 shadow-md shadow-black/20 transition-all duration-300",
                  isExpanded
                    ? "scale-150 border-white bg-nav-green text-white shadow-lg shadow-nav-green/40"
                    : isRelated
                      ? "animate-pulse border-white bg-nav-light-green text-nav-deep-green"
                      : "border-white/70 bg-nav-deep-green text-white shadow-nav-deep-green/50"
                )}
              >
                <Icon size={17} />
              </div>

              <div
                className={cn(
                  "absolute top-13 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300",
                  isExpanded ? "scale-125 text-white" : "text-white/85"
                )}
              >
                {item.title}
              </div>

              {isExpanded && (
                <Card className="absolute top-20 left-1/2 w-64 -translate-x-1/2 overflow-visible border-white/15 bg-nav-deep-green/95 shadow-xl shadow-black/30 backdrop-blur-lg">
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-white/40" />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={cn("border px-2 text-xs", getStatusStyles(item.status))}>
                        {item.status === "completed"
                          ? "ESTABLISHED"
                          : item.status === "in-progress"
                            ? "GROWING"
                            : "AHEAD"}
                      </Badge>
                      <span className="font-mono text-xs text-white/50">{item.date}</span>
                    </div>
                    <CardTitle className="mt-2 text-sm text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-white/80">
                    <p>{item.content}</p>

                    <div className="mt-4 border-t border-white/10 pt-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="flex items-center">
                          <Zap size={10} className="mr-1" />
                          Contribution
                        </span>
                        <span className="font-mono">{item.energy}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-nav-oil-gold to-nav-green"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 border-t border-white/10 pt-3">
                        <div className="mb-2 flex items-center">
                          <LinkIcon size={10} className="mr-1 text-white/70" />
                          <h4 className="text-xs font-medium tracking-wider text-white/70 uppercase">
                            Connects to
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const relatedItem = timelineData.find((i) => i.id === relatedId);
                            if (!relatedItem) return null;
                            return (
                              <Button
                                key={relatedId}
                                variant="outline"
                                size="sm"
                                className="flex h-6 items-center rounded-full border-white/20 bg-transparent px-2 py-0 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(relatedId);
                                }}
                              >
                                {relatedItem.title}
                                <ArrowRight size={8} className="ml-1 text-white/60" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
