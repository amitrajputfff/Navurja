import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ChefHat,
  Coffee,
  ShieldCheck,
  Sparkles,
  Truck,
  FileCheck2,
  BarChart3,
  UtensilsCrossed,
  Warehouse,
  Soup,
  Landmark,
} from "lucide-react";

/**
 * All numeric metrics below are illustrative placeholders until NavUrja
 * supplies verified figures — never treat these as real claims.
 */

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Solutions", href: "#solutions" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
] as const;

export const BUSINESS_CATEGORIES = [
  { label: "Restaurants", icon: UtensilsCrossed },
  { label: "Hotels", icon: Landmark },
  { label: "Cloud Kitchens", icon: Soup },
  { label: "Caterers", icon: ChefHat },
  { label: "Food Businesses", icon: Building2 },
  { label: "Commercial Kitchens", icon: Warehouse },
] as const satisfies ReadonlyArray<{ label: string; icon: LucideIcon }>;

export const BUSINESS_TYPE_OPTIONS = BUSINESS_CATEGORIES.map((c) => c.label);

export const HERO_METRICS = [
  { label: "Oil Collected", value: "XX,XXX+", unit: "KG" },
  { label: "Businesses", value: "XXX+", unit: "" },
  { label: "CO₂ Impact", value: "XX,XXX", unit: "KG" },
] as const;

export const IMPACT_METRICS = [
  { label: "Oil Collected", value: 0, suffix: "+ KG", target: 24800 },
  { label: "Businesses Served", value: 0, suffix: "+", target: 320 },
  { label: "Cities Covered", value: 0, suffix: "+", target: 8 },
  { label: "CO₂ Emissions Avoided", value: 0, suffix: "+ KG", target: 41200 },
] as const;

export const SOLUTIONS = [
  {
    title: "Restaurants",
    description: "Simple, recurring oil collection that fits your kitchen's rhythm.",
    icon: UtensilsCrossed,
  },
  {
    title: "Hotels",
    description: "Reliable, high-volume collection built for larger operations.",
    icon: Landmark,
  },
  {
    title: "Cloud Kitchens",
    description: "Flexible pickup scheduling that adapts to demand spikes.",
    icon: Soup,
  },
  {
    title: "Caterers",
    description: "On-demand collection for temporary and event-based operations.",
    icon: ChefHat,
  },
  {
    title: "Food Businesses",
    description: "Responsible used-oil management for any scale of kitchen.",
    icon: Building2,
  },
  {
    title: "Commercial Kitchens",
    description: "Scalable collection solutions that grow with your business.",
    icon: Warehouse,
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
    description: "Your kitchen uses cooking oil as part of daily operations.",
  },
  {
    number: "02",
    title: "Store",
    description: "Used oil is safely stored, ready for pickup.",
  },
  {
    number: "03",
    title: "Collect",
    description: "NavUrja collects it directly from your business.",
  },
  {
    number: "04",
    title: "Transform",
    description: "The oil enters a responsible recycling and renewable-fuel ecosystem.",
  },
] as const;

export const CIRCULAR_LOOP_STAGES = [
  "Used Cooking Oil",
  "Collection",
  "Processing",
  "Renewable Fuel",
  "Lower Waste",
  "New Energy",
] as const;

export const FOOTER_COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Solutions", href: "#solutions" },
      { label: "Impact", href: "#impact" },
      { label: "Contact", href: "#pickup" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;
