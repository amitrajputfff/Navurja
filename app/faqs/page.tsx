import type { Metadata } from "next";
import Link from "next/link";
import { StubPage } from "@/components/stub-page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CATEGORIES } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about pickups, pricing, and compliance.",
};

export default function FaqsPage() {
  return (
    <StubPage
      eyebrow="Support"
      title="Frequently asked questions"
      breadcrumbs={[{ label: "FAQs" }]}
    >
      <p>
        Answers to what restaurants, hotels, and cloud kitchens ask us most.
        Can&apos;t find what you need?{" "}
        <a href="mailto:hello@navurja.com" className="text-nav-primary underline">
          Reach out directly
        </a>{" "}
        and we&apos;ll help right away.
      </p>

      <div className="mt-10 space-y-10">
        {FAQ_CATEGORIES.map((category) => (
          <div key={category.category}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-nav-green">
              {category.category}
            </h2>
            <Accordion className="mt-3">
              {category.items.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="text-nav-dark-text">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-nav-light-green bg-nav-mint p-6 text-center">
        <p className="font-medium text-nav-dark-text">Ready to schedule your first pickup?</p>
        <Link
          href="/#pickup"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-nav-primary px-5 py-2.5 text-sm font-medium text-white! no-underline! transition-colors hover:bg-nav-primary/90"
        >
          Request a Pickup
        </Link>
      </div>
    </StubPage>
  );
}
