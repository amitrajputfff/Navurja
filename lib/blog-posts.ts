/**
 * All blog content lives here, same pattern as lib/constants.ts. Body
 * content is plain paragraph/heading blocks (no markdown dependency) —
 * enough for editorial copy, not meant for arbitrary rich formatting.
 */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readTimeMinutes: number;
  body: BlogBlock[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-used-cooking-oil-doesnt-belong-in-the-drain",
    title: "Why Used Cooking Oil Doesn't Belong in the Drain",
    excerpt:
      "It looks like liquid going down a liquid pipe. It isn't. Here's what actually happens after the oil leaves your kitchen — and why it's a bigger problem than a slow sink.",
    category: "Sustainability",
    date: "2026-06-08",
    readTimeMinutes: 5,
    body: [
      {
        type: "p",
        text: "Pour a little oil down the sink after frying and nothing seems to happen. The water carries it away, the sink drains, and the kitchen moves on. That's the illusion — oil doesn't dissolve in water, it just goes somewhere out of sight.",
      },
      { type: "h2", text: "What actually happens in the pipe" },
      {
        type: "p",
        text: "As oil cools inside a drain line, it thickens and sticks to the pipe wall. Every subsequent pour adds another layer. Combined with food particles, this builds into what water utilities call a \"fatberg\" — a solid mass that narrows the pipe until it blocks completely. For a single restaurant, that shows up as a backed-up floor drain. Multiplied across a street of kitchens feeding the same municipal line, it's a sewer overflow.",
      },
      { type: "h2", text: "Where it ends up" },
      {
        type: "p",
        text: "Oil that makes it past the kitchen drain doesn't stop at the municipal treatment plant either. Treatment systems are built for water-soluble waste; oil floats, coats equipment, and reduces the efficiency of the biological processes that clean everything else. What isn't caught can pass through to rivers and waterways, where it forms a film on the surface that blocks oxygen exchange — the same mechanism that makes oil spills harmful to aquatic life, just at a slower, quieter scale.",
      },
      { type: "h2", text: "The cost shows up later, not immediately" },
      {
        type: "p",
        text: "This is why the problem is easy to ignore day-to-day: the consequences are downstream, both literally and in time. A kitchen pouring oil down the drain for a year won't necessarily see a blockage in month one. But the buildup is cumulative, and by the time it's visible — a slow drain, a plumber's bill, a compliance notice — it's already been happening for a while.",
      },
      { type: "h2", text: "The fix is a container, not a chemical" },
      {
        type: "p",
        text: "None of this requires a new habit that's hard to keep. Used oil poured into a sealed container instead of the sink solves the pipe problem completely, and handed to a collection service instead of the general waste bin, it stops being waste at all — it becomes the feedstock for biodiesel. The oil was always going to leave the kitchen. The only question is whether it leaves through a pipe or through a container.",
      },
    ],
  },
  {
    slug: "fssai-ruco-explained",
    title: "FSSAI's RUCO Initiative, Explained",
    excerpt:
      "RUCO — Repurpose Used Cooking Oil — is the regulatory framework behind why food businesses can no longer just throw used oil away. Here's what it actually requires.",
    category: "Compliance",
    date: "2026-07-02",
    readTimeMinutes: 6,
    body: [
      {
        type: "p",
        text: "If you run a commercial kitchen in India, you may have heard the acronym RUCO without anyone explaining what it actually means for your business. RUCO stands for Repurpose Used Cooking Oil — an initiative from the Food Safety and Standards Authority of India (FSSAI) aimed at diverting used cooking oil away from informal reuse and disposal, and into regulated channels like biodiesel production.",
      },
      { type: "h2", text: "Why it exists" },
      {
        type: "p",
        text: "Repeatedly reheated and reused cooking oil accumulates compounds linked to health risks, and historically, used oil from large kitchens has had a way of quietly re-entering the food supply through informal resale. Separately, oil poured down drains causes the pipe-blockage and water-pollution problems most kitchens are already familiar with. RUCO addresses both: it creates a legitimate, traceable market for used oil, so there's an economic reason to hand it to an authorised collector instead of a drain or an unregulated reseller.",
      },
      { type: "h2", text: "The 50-litre threshold" },
      {
        type: "p",
        text: "The rule that actually matters operationally: Food Business Operators generating more than 50 litres of used cooking oil per day are expected to dispose of it only through FSSAI-authorised collectors, and to maintain records of doing so. That threshold captures most mid-to-large restaurants, hotel kitchens, cloud kitchens running high fryer volume, and institutional catering operations — it's a lower bar than it sounds once you account for a single deep fryer running a full service day.",
      },
      { type: "h2", text: "How the collection network works" },
      {
        type: "list",
        items: [
          "Authorised aggregators collect used oil directly from kitchens, typically on a scheduled or on-demand pickup.",
          "The oil is tracked from collection through to the biodiesel or soap manufacturers it's ultimately sold to — the traceability is the actual point of the framework.",
          "In exchange, the food business gets paid for the oil rather than paying to have it removed, and receives documentation it can point to if asked about disposal practices.",
        ],
      },
      { type: "h2", text: "What it means for your kitchen" },
      {
        type: "p",
        text: "In practice, RUCO turns a waste-disposal cost into a small revenue line, and turns \"we throw it out\" into \"we can show you exactly where it went.\" For a kitchen that's already storing used oil safely and handing it to a collector, none of this changes daily operations — it just gives a name and a paper trail to something worth doing anyway.",
      },
    ],
  },
  {
    slug: "how-used-cooking-oil-becomes-biodiesel",
    title: "From Kitchen to Fuel Tank: How Used Cooking Oil Becomes Biodiesel",
    excerpt:
      "Waste oil doesn't get 'cleaned up' into fuel — it goes through an actual chemical conversion. Here's the process in plain terms.",
    category: "How It Works",
    date: "2026-07-24",
    readTimeMinutes: 5,
    body: [
      {
        type: "p",
        text: "\"Recycled into fuel\" undersells what actually happens to used cooking oil on its way to becoming biodiesel. It isn't filtered and relabeled — it goes through a real chemical transformation that changes its molecular structure into something an engine can burn cleanly.",
      },
      { type: "h2", text: "Step 1: Filtering" },
      {
        type: "p",
        text: "Collected oil arrives with food particles, water, and other kitchen debris mixed in. The first step is straightforward mechanical filtering to remove solids, followed by settling or centrifuging to separate out water — both of which interfere with the chemistry in the next step if left in.",
      },
      { type: "h2", text: "Step 2: Testing the oil's condition" },
      {
        type: "p",
        text: "Used oil is graded before processing, mainly by its free fatty acid (FFA) content — a measure of how much the oil has broken down from repeated heating. Higher-FFA oil needs an extra pre-treatment step; this grading is also usually what determines the price paid per kilogram, since it predicts how much usable fuel the batch will yield.",
      },
      { type: "h2", text: "Step 3: Transesterification" },
      {
        type: "p",
        text: "This is the actual conversion. The filtered oil is reacted with an alcohol (typically methanol) in the presence of a catalyst. The reaction breaks the oil's large fat molecules (triglycerides) apart and rebuilds them into two things: biodiesel (fatty acid methyl esters, or FAME) and glycerol, a byproduct used separately in soap and cosmetics manufacturing.",
      },
      { type: "h2", text: "Step 4: Washing and purifying" },
      {
        type: "p",
        text: "The raw biodiesel is washed to remove leftover catalyst and soap formed during the reaction, then dried. What's left meets fuel-grade specifications and can be blended with or used in place of conventional diesel.",
      },
      { type: "h2", text: "Why the yield matters" },
      {
        type: "p",
        text: "Not every litre of used oil becomes a litre of biodiesel — degraded oil and processing losses mean the real yield is meaningfully below 100%. It's still a dramatically better outcome than the oil's two alternatives: sitting in a landfill, or being poured down a drain and becoming someone else's blocked pipe.",
      },
    ],
  },
  {
    slug: "5-signs-your-restaurant-needs-a-uco-partner",
    title: "5 Signs Your Kitchen Should Have a Used Cooking Oil Partner",
    excerpt:
      "Most kitchens don't think about UCO disposal until something forces the issue. Here's how to tell before that happens.",
    category: "For Restaurants",
    date: "2026-08-11",
    readTimeMinutes: 4,
    body: [
      {
        type: "p",
        text: "Used cooking oil disposal is one of those operational details that's easy to leave un-examined right up until it becomes a problem. A few signs it's worth fixing before that point:",
      },
      { type: "h2", text: "1. You're already paying someone to take it away" },
      {
        type: "p",
        text: "If oil disposal shows up as a cost on your books at all — a waste hauler, a plumber called out for blockages, a fine — that's a sign the oil is being treated as pure liability instead of the priced commodity it actually is. Used oil has a market value; disposing of it responsibly can be revenue-neutral or better, not a cost centre.",
      },
      { type: "h2", text: "2. Your drains are slower than they used to be" },
      {
        type: "p",
        text: "A gradually slowing kitchen drain is rarely random — it's usually residue buildup from oil going down it, however small the amount each time. By the time it's a visible problem, months of buildup are already sitting in the line.",
      },
      { type: "h2", text: "3. You generate a meaningful volume of fryer oil" },
      {
        type: "p",
        text: "Any kitchen running a deep fryer through a full service day is a candidate. FSSAI's RUCO framework specifically flags food businesses producing more than 50 litres of used oil per day as needing an authorised disposal channel — worth checking where your kitchen actually falls before assuming it doesn't apply.",
      },
      { type: "h2", text: "4. You've been asked about your sustainability or compliance practices" },
      {
        type: "p",
        text: "Corporate clients, franchise auditors, and increasingly customers themselves ask about waste handling. \"We hand it to an oil collector\" is a much better answer with a certificate behind it than a shrug." ,
      },
      { type: "h2", text: "5. You're storing used oil in whatever container is around" },
      {
        type: "p",
        text: "Old cans and improvised containers are a spill risk and make the eventual handover harder than it needs to be. A proper collection partner supplies sealed containers as part of the service — one less thing to think about, and a cleaner storage area in the meantime.",
      },
      { type: "h2", text: "None of these need to be urgent to be worth fixing" },
      {
        type: "p",
        text: "The appeal of setting up a collection partner isn't solving a crisis — it's removing a slow-building one before it becomes worth noticing. Scheduled pickup, a fair price per kilogram, and a paper trail replace an ad-hoc habit that was never going to end well.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
