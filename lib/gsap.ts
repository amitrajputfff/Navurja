"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registering a plugin twice is a harmless no-op in GSAP, but guarding on
// `window` keeps this import side-effect-free during SSR/static generation.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
