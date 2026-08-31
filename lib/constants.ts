import type { LucideIcon } from "lucide-react";
import {
  Ban,
  BarChart3,
  Building2,
  ChefHat,
  Coffee,
  Cpu,
  FileCheck2,
  Factory,
  Landmark,
  Recycle,
  ShieldCheck,
  Soup,
  Sparkles,
  Sunrise,
  Truck,
  UtensilsCrossed,
  Warehouse,
  Zap,
} from "lucide-react";
import { LinkedinIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/components/social-icons";

/**
 * All numeric metrics below are illustrative placeholders until NavUrja
 * supplies verified figures — never treat these as real claims.
 */

// Pinned Unsplash photo IDs — the site hotlinks these via next/image (see
// next.config.ts `images.remotePatterns`) rather than shipping local files,
// since they're stand-ins until NavUrja supplies real photography.
export const UNSPLASH = {
  communities: "1780004033644-0a6d7798943c", // modern institutional building
} as const;

// Cross-page-safe: every in-page anchor is prefixed with "/" so the link
// resolves correctly from routes other than the homepage (e.g. /privacy),
// where the bare "#id" form can't find the target and does nothing.
export const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Impact", href: "/#impact" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
] as const;

export const TRUST_MARKERS = [
  { label: "Smart Technology", icon: Cpu },
  { label: "Renewable Energy", icon: Zap },
  { label: "Circular Economy", icon: Recycle },
  { label: "Zero Landfill", icon: Ban },
  { label: "Measurable Impact", icon: BarChart3 },
  { label: "Better Tomorrow", icon: Sunrise },
] as const satisfies ReadonlyArray<{ label: string; icon: LucideIcon }>;

export const BUSINESS_CATEGORIES = [
  { label: "Restaurants", icon: UtensilsCrossed },
  { label: "Hotels", icon: Landmark },
  { label: "Cloud Kitchens", icon: Soup },
  { label: "Caterers", icon: ChefHat },
  { label: "Food Businesses", icon: Building2 },
  { label: "Commercial Kitchens", icon: Warehouse },
] as const satisfies ReadonlyArray<{ label: string; icon: LucideIcon }>;

// `.map(c => c.label)` on the tuple above would widen back to `string[]`,
// which is what previously defeated z.enum()'s literal-union inference in
// lib/validations.ts. Spelling the tuple out keeps it a literal union.
export const BUSINESS_TYPE_OPTIONS = [
  "Restaurants",
  "Hotels",
  "Cloud Kitchens",
  "Caterers",
  "Food Businesses",
  "Commercial Kitchens",
] as const;

export const HERO_METRICS = [
  { label: "Waste Processed", value: "24,800+", unit: "KG" },
  { label: "Partner Cities", value: "8+", unit: "" },
  { label: "CO₂ Prevented", value: "41,200+", unit: "KG" },
] as const;

export const IMPACT_METRICS = [
  { label: "Oil Collected", suffix: "+ KG", target: 24800 },
  { label: "Businesses Served", suffix: "+", target: 320 },
  { label: "Cities Covered", suffix: "+", target: 8 },
  { label: "CO₂ Emissions Avoided", suffix: "+ KG", target: 41200 },
] as const;

export const SOLUTIONS = [
  {
    title: "Restaurants & Cafes",
    description: "High-volume oil usage made easy.",
    icon: UtensilsCrossed,
    image: "/solution-restaurants.jpg",
  },
  {
    title: "Cloud Kitchens",
    description: "Streamlined solutions for delivery-first kitchens.",
    icon: Soup,
    image: "/solution-cloud-kitchens.jpg",
  },
  {
    title: "Caterers",
    description: "Sustainable practices for every event.",
    icon: ChefHat,
    image: "/solution-caterers.jpg",
  },
  {
    title: "Food Processors",
    description: "Industrial-scale collection and energy recovery.",
    icon: Factory,
    image: "/solution-commercial-kitchens.jpg",
  },
  {
    title: "Communities & Institutions",
    description: "Clean energy solutions for a better society.",
    icon: Landmark,
    image: `https://images.unsplash.com/photo-${UNSPLASH.communities}`,
  },
] as const;

export const WHY_NAVURJA = [
  {
    title: "Easy Pickup",
    description: "Simple scheduling, done in a few clicks.",
    icon: Truck,
  },
  {
    title: "Responsible Recycling",
    description: "Used oil stays inside a closed, circular loop.",
    icon: Sparkles,
  },
  {
    title: "Transparent Tracking",
    description: "Know exactly what happens to your collection.",
    icon: BarChart3,
  },
  {
    title: "Digital Certificates",
    description: "Access documentation whenever you need it.",
    icon: FileCheck2,
  },
  {
    title: "Compliance Support",
    description: "Stay ahead of responsible-disposal requirements.",
    icon: ShieldCheck,
  },
  {
    title: "Impact Reporting",
    description: "Understand your environmental contribution clearly.",
    icon: Coffee,
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Use",
    description: "Use oil in your kitchen or business as usual.",
  },
  {
    number: "02",
    title: "Store",
    description: "Store used oil safely and securely in provided containers.",
  },
  {
    number: "03",
    title: "Collect",
    description: "We collect it efficiently from your location.",
  },
  {
    number: "04",
    title: "Transform",
    description: "Advanced technology converts waste oil into renewable energy.",
  },
  {
    number: "05",
    title: "Power",
    description: "Renewable energy powers homes, businesses, and a cleaner planet.",
  },
] as const;

// Feeds the radial orbital timeline in circular-loop.tsx — one node per
// stage of "why the loop matters," in the order they connect around the
// ring. `relatedIds` draws the connector highlight between adjacent stages
// when one is expanded.
export const CIRCULAR_LOOP_STAGES = [
  {
    id: 1,
    title: "Collection",
    date: "Step 1",
    content:
      "Used cooking oil is picked up directly from partner kitchens instead of going down the drain.",
    icon: Truck,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Less Waste in Landfills",
    date: "Step 2",
    content:
      "Every liter collected is one less liter dumped or landfilled — waste stays inside a managed loop.",
    icon: Ban,
    relatedIds: [1, 3],
    status: "completed",
    energy: 85,
  },
  {
    id: 3,
    title: "Cleaner Waterways",
    date: "Step 3",
    content:
      "Diverting oil at the source keeps it out of drains, pipes, and the waterways it would otherwise pollute.",
    icon: Sparkles,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 70,
  },
  {
    id: 4,
    title: "Renewable Energy",
    date: "Step 4",
    content:
      "Processing converts the collected oil into renewable fuel — a direct, usable source of clean energy.",
    icon: Zap,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 60,
  },
  {
    id: 5,
    title: "Lower Emissions",
    date: "Step 5",
    content:
      "That renewable fuel displaces fossil fuel demand, cutting the emissions the original waste would have added.",
    icon: Recycle,
    relatedIds: [4, 1],
    status: "pending",
    energy: 45,
  },
] as const satisfies ReadonlyArray<{
  id: number;
  title: string;
  date: string;
  content: string;
  icon: LucideIcon;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}>;

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/navurja", icon: LinkedinIcon },
  { label: "Instagram", href: "https://www.instagram.com/navurja", icon: InstagramIcon },
  { label: "X", href: "https://x.com/navurja", icon: XIcon },
  { label: "YouTube", href: "https://www.youtube.com/@navurja", icon: YoutubeIcon },
] as const;
