# Pending — Website & Admin Console

Tracking doc for what's deliberately deferred on the Next.js site
(`app/**` outside `app/api/mobile` and `app/api/vendor`) and the admin
console (`app/admin/**`). See
`/Users/amit/.claude/plans/what-if-i-want-dazzling-scroll.md` for the full
strategic plan this rolls up into. Ops app gaps are tracked separately in
`mobile/pending.md`, vendor/FBO app gaps in `vendor/pending.md`.

## Admin console

- [ ] **No KYC review gate on vendor self-signup.** The vendor app
      (`vendor/`) lets any food business sign up and immediately create
      an organization + request pickups — `organizations.kyc_status`
      defaults to `pending` in the schema but nothing in the admin
      console actually surfaces or acts on it. Existing orgs (including
      vendor-created ones) already show up fine in `/admin/organizations`
      since that page is schema-driven, not tied to lead-conversion —
      what's missing is a verification step before a self-signed-up org
      is treated as trustworthy.
- [ ] **Dispatch UI** — no way to assign a collector to a pickup request
      from the web console yet. Currently only possible via direct SQL
      (how all demo data was seeded). Blocks push notifications from
      meaning anything (nothing to notify about without an assignment
      action).
- [ ] **Containers module** — schema (`containers`, `container_movements`)
      exists, no admin UI. Pairs with the mobile QR issue/return flow
      below.
- [ ] **Inventory module** — hub stock, consignments out, weighbridge vs
      recorded-kg reconciliation. Schema exists (`hubs`, `consignments`),
      no UI.
- [ ] **Finance module** — payables to FBOs, cash-float variance by
      collector, payout batches, GST reports. Schema exists
      (`payments`, `cash_floats`), no UI.
- [ ] **Certificates module** — issue/bulk-issue, serial register,
      re-download. Schema exists (`certificates`), no UI, no generation
      engine (see Certificate engine below).
- [ ] **Analytics module** — kg by city/segment/collector, retention
      cohorts, churned outlets, ₹/kg realised. Nothing built.
- [ ] Real per-role RLS policies — currently every admin data access goes
      through the service-role key, gated only by the app-level role
      check in `app/admin/layout.tsx`. Fine for a handful of trusted
      staff; worth real RLS before the admin console has many users.

## Backend / integrations (need a paid third-party account — none set up yet)

- [ ] **WhatsApp Business alerts** — pickup confirmations/receipts, in
      addition to the working email-via-Resend path. Needs an AiSensy /
      Gupshup / Interakt account.
- [ ] **Real SMS/OTP auth** — replacing email+password for FBO-facing
      surfaces (vendor app). Needs MSG91 or Firebase Auth.
- [ ] **Razorpay payouts** — UPI/IMPS payouts to FBOs and collectors.
      Needs a KYC'd Razorpay business account.
- [ ] **PostHog analytics** — product analytics + session replay, planned
      since Phase 0 but never actually wired in.

## Certificate engine (Phase 3 dependency)

- [ ] Scheduled job aggregating monthly `collections` per org, computing
      CO₂e against a published methodology, rendering serial-numbered
      PDFs (`@react-pdf/renderer` or Puppeteer route handler), pushing
      over WhatsApp/email.
- [ ] Once real, replace the "illustrative placeholders" disclaimer on
      `IMPACT_METRICS` (`lib/constants.ts`, surfaced in
      `components/impact-section.tsx`) with real `impact_snapshots` data
      — explicitly flagged in the plan as premature to remove until true.

## Smaller/known items

- [ ] `bun.lock` at the repo root is untracked and likely stale — npm is
      the package manager actually in use throughout. Either delete it
      or bring it back in sync; don't let it silently drift further.
- [ ] Rotate the Supabase service-role secret key — it was pasted in
      plaintext into an earlier chat session during setup. Not urgent,
      but a stale copy shouldn't be the one the app runs on long-term.
- [ ] Nominatim (OpenStreetMap) address autocomplete on the pickup form
      is free/no-key but noticeably worse than Google Places for
      multi-word Indian addresses. Swap if/when a Google Maps billing
      account exists.

## Explicitly out of scope for now (Phase 4, revisit later)

Household collection funnel · franchise/partner-collector program ·
carbon credit registry integration · route optimisation · processor-side
portal · value-added services marketplace (FSSAI training, chimney
cleaning, etc.).
