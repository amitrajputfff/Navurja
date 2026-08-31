# Pending — Ops/Collector App (`mobile/`)

Tracking doc for what's deliberately deferred on the field ops app.
See `/Users/amit/.claude/plans/what-if-i-want-dazzling-scroll.md` (Part
4A, Wave 2) for full context. Website/admin gaps are tracked separately
in `../pending.md`.

## Collector role — built, not fully hardened

- [x] Core flow: assigned pickups → directions/call → weigh-in (mandatory
      GPS + photo) → rate auto-fill → payment → History with detail view
      → Profile with stats. Live-tested on a real device via Expo Go.
- [ ] **Offline mutation queue** — every screen currently assumes network.
      `expo-sqlite`-backed local queue so a collector can complete a
      collection with no signal and have it sync on reconnect without
      duplicating. Biggest real gap vs. the original plan, which called
      this non-negotiable for the field.
- [ ] **Real FBO-side OTP confirmation** — currently a "verbal
      confirmation" checkbox placeholder (`confirmation_otp_verified`),
      explicitly not independently verified. Needs an SMS provider (see
      root `pending.md`).
- [ ] **Container/drum tracking** — QR-based issue/return
      (`expo-camera` barcode scanning), wired into the Collect flow.
      Schema (`containers`, `container_movements`) exists, unused.
- [ ] **Printed/WhatsApp receipts** — nothing generated or sent after a
      collection today beyond the in-app confirmation.
- [ ] **Push notifications** — "a pickup was just assigned to you."
      Expo's push service is free, but blocked on the admin **Dispatch
      UI** (root `pending.md`) existing first — nothing to notify about
      without it.
- [ ] Panic/SOS, battery-aware GPS polling — mentioned in the original
      plan's cross-cutting requirements, not implemented.

## Roles not built at all

- [ ] **Sales exec screens** — lead queue, nearby unsigned FBOs, on-site
      onboarding, status updates, directions/call to a lead's address.
      Currently any `sales_exec` account just sees the collector's
      Requests/History/Profile tabs (empty, since nothing's assigned to
      them) — not a real experience.
- [ ] **Hub operator screens** — confirm collector handovers, weigh-in,
      running hub stock, dispatch a consignment. Same situation as
      sales exec — role exists in the schema/auth gate, no real screens.

## Distribution

- [ ] Currently Expo Go only (SDK 54, downgraded from 57 specifically so
      plain Expo Go from the App Store/Play Store still works — SDK 55+
      dropped off the Apple App Store and needs `eas go` + a paid Apple
      Developer account).
- [ ] No EAS project set up. A real installable build (TestFlight/Play
      internal testing, eventually public store listings) needs an EAS
      account and, for iOS, the $99/yr Apple Developer Program.

## Known rough edges

- [ ] No lint config for this project at all (the blank-typescript
      template didn't include one). Verified via `tsc --noEmit` +
      manual review this session; worth a real ESLint + React
      Native/Expo plugin setup before the app grows much further.
- [ ] Rate-card auto-fill on the Collect screen only matches on exact
      city + segment + quality-grade — no fallback if a rate card is
      missing for that combination (the field just stays blank,
      requiring manual entry, which is correct but silent — could use a
      "no rate card found for X" hint).
