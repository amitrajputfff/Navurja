export type FaqItem = { question: string; answer: string };
export type FaqCategory = { category: string; items: FaqItem[] };

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    category: "Getting Started",
    items: [
      {
        question: "Who can use NavUrja?",
        answer:
          "Any food business that generates used cooking oil — restaurants, hotels, cafés, cloud kitchens, caterers, food processors, and institutional kitchens. Request a pickup and our team will confirm availability in your area.",
      },
      {
        question: "How do I schedule my first pickup?",
        answer:
          "Fill in the pickup request form on our homepage with your business details, address, and an estimated oil quantity in kilograms. Our team will reach out to confirm the date, time, and rate for your area.",
      },
      {
        question: "Is there a minimum quantity to qualify for pickup?",
        answer:
          "Very small volumes may not be economical for a dedicated pickup. If your kitchen generates a modest amount, let us know when you submit a request and we'll suggest the best option — including grouping with a nearby collection route where possible.",
      },
    ],
  },
  {
    category: "Pickup & Logistics",
    items: [
      {
        question: "How often can oil be collected?",
        answer:
          "Pickup cadence depends on how much used oil your kitchen generates — from weekly for high-volume kitchens to on-demand for smaller operations. We'll agree on a schedule that fits your business.",
      },
      {
        question: "Do I need to store the oil myself between pickups?",
        answer:
          "Yes, safely and in a sealed container — we can provide one as part of onboarding. Keeping oil in a dedicated container (rather than mixed with other waste) keeps your kitchen cleaner and makes handover quicker.",
      },
      {
        question: "What if I need to reschedule a pickup?",
        answer:
          "Contact us before the confirmed pickup window and we'll find a new time. Our aim is a dependable, predictable schedule — let us know as early as you can if something changes on your end.",
      },
    ],
  },
  {
    category: "Pricing & Payment",
    items: [
      {
        question: "How is the rate for my oil determined?",
        answer:
          "Rates are quoted per kilogram and vary by city, business type, and oil quality. We'll confirm your applicable rate before your first pickup, and you'll always know the rate in advance of a collection.",
      },
      {
        question: "How and when do I get paid?",
        answer:
          "Payment is made through the method agreed during onboarding, tied to the recorded weight of each collection. We're moving toward transparent, trackable payment records for every pickup.",
      },
    ],
  },
  {
    category: "Compliance & Documentation",
    items: [
      {
        question: "Can NavUrja help with FSSAI's RUCO compliance requirements?",
        answer:
          "Yes — regulated, documented disposal of used cooking oil is the core of what we do. Food businesses generating meaningful volumes of used oil are expected to dispose of it through an authorised channel and keep records; scheduled pickup with NavUrja is built around exactly that need.",
      },
      {
        question: "Will I get documentation for each pickup?",
        answer:
          "We're building toward downloadable pickup and disposal records for every collection, so you have something concrete to show if your used cooking oil practices are ever reviewed.",
      },
      {
        question: "What actually happens to the oil after collection?",
        answer:
          "It's filtered, graded, and processed into biodiesel — read our blog post on how used cooking oil becomes biodiesel for the full breakdown of the conversion process.",
      },
    ],
  },
];
