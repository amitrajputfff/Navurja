import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Recycle, Eye, Leaf } from "lucide-react";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "About",
  description: "Why NavUrja exists and how we're building a cleaner loop for used cooking oil.",
};

const VALUES = [
  {
    icon: Recycle,
    title: "Circular by design",
    description:
      "Used cooking oil isn't waste until we let it go to waste. Every pickup keeps it inside a loop that ends in renewable energy, not a drain or a landfill.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance as a feature",
    description:
      "Responsible disposal shouldn't be a guessing game. We're building toward clear documentation for every collection, so businesses always have a record to point to.",
  },
  {
    icon: Eye,
    title: "Transparent, always",
    description:
      "A fair, published rate per kilogram. No hidden terms. You should always know what happens to your oil and what you're paid for it.",
  },
  {
    icon: Leaf,
    title: "Impact you can measure",
    description:
      "Kilograms collected, businesses served, emissions avoided — real numbers a food business can point to when asked how it handles its waste.",
  },
];

export default function AboutPage() {
  return (
    <StubPage eyebrow="About NavUrja" title="Nothing useful should be wasted." breadcrumbs={[{ label: "About" }]}>
      <p className="text-lg text-nav-dark-text">
        NavUrja collects used cooking oil from food businesses and gives it a
        second life through responsible recycling and renewable energy —
        turning something every commercial kitchen already produces into a
        resource instead of a liability.
      </p>

      <div className="mt-10 space-y-8">
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">The problem we started with</h2>
          <p className="mt-2">
            Used cooking oil poured down a kitchen drain doesn&apos;t just
            disappear — it clogs pipes, pollutes waterways, and harms
            marine life. Multiply that across every restaurant, hotel, and
            cloud kitchen in a city, and a habit that feels harmless in one
            sink becomes a genuine environmental problem. Most kitchens
            aren&apos;t ignoring this on purpose; there simply hasn&apos;t
            been an easy, dependable way to do it differently.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">What we&apos;re building instead</h2>
          <p className="mt-2">
            A simple loop: kitchens use oil as they always have, store it
            safely in a container we provide, and we collect it on a
            schedule that fits their business. From there, it&apos;s
            processed into renewable fuel — displacing the fossil fuel that
            oil would otherwise have to be replaced with, and keeping it
            out of drains, waterways, and landfills entirely.
          </p>
          <p className="mt-3">
            We built the site you&apos;re on to make requesting a pickup as
            simple as filling out a short form — because the harder it is
            to do the right thing with used oil, the less likely any kitchen
            is to bother.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">Who we work with</h2>
          <p className="mt-2">
            Restaurants and cafés, hotels, cloud kitchens, caterers, food
            processors, and institutional kitchens — any food business that
            generates used cooking oil and would rather it become fuel than
            waste.
          </p>
        </div>
      </div>

      <h2 className="mt-12 text-base font-semibold text-nav-dark-text">What we hold ourselves to</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VALUES.map((value) => (
          <div key={value.title} className="rounded-2xl border border-black/5 bg-white p-5">
            <span className="flex size-9 items-center justify-center rounded-full bg-nav-light-green text-nav-primary">
              <value.icon className="size-4.5" strokeWidth={2} />
            </span>
            <p className="mt-3 font-semibold text-nav-dark-text">{value.title}</p>
            <p className="mt-1.5 text-sm text-nav-muted">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-nav-light-green bg-nav-mint p-6 text-center">
        <p className="font-medium text-nav-dark-text">
          Have questions before your first pickup?
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#pickup"
            className="inline-flex items-center justify-center rounded-full bg-nav-primary px-5 py-2.5 text-sm font-medium text-white! transition-colors hover:bg-nav-primary/90"
          >
            Request a Pickup
          </Link>
          <Link
            href="/faqs"
            className="inline-flex items-center justify-center rounded-full border border-nav-primary/20 px-5 py-2.5 text-sm font-medium text-nav-primary transition-colors hover:bg-white"
          >
            Read the FAQs
          </Link>
        </div>
      </div>
    </StubPage>
  );
}
