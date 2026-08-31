# Pending — Vendor/Partner App (`vendor/`)

Tracking doc for what's deliberately deferred on the FBO-facing app. See
`/Users/amit/.claude/plans/what-if-i-want-dazzling-scroll.md` (Part 3C)
for full context. Website/admin gaps in `../pending.md`, ops app gaps in
`../mobile/pending.md`.

## Built (v1)

- [x] Self-serve signup (email+password, no invite code — unlike the
      ops/admin staff signup flow) → business setup (org + first outlet)
      → Home/Pickups/History/Profile tabs.
- [x] Backend: `/api/vendor/**`, org-scoped (a vendor can only ever see
      their own organization's outlets/requests/collections — enforced
      server-side, tested: a request against another org's outlet 404s).
- [x] Request a pickup, see status, see collection history with photos
      (signed URLs, same private-bucket pattern as the ops app), month/
      lifetime stats including a clearly-labeled *estimated* (not
      certified) CO₂ figure.

## Known gaps

- [ ] **No "add another outlet" UI.** The backend supports it
      (`POST /api/vendor/outlets`), but the app only creates the first
      outlet during onboarding — a business with multiple locations has
      no way to add the second one from the app yet.
- [ ] **No live pickup tracking.** Status just shows as text
      (requested/assigned/etc.) — no real-time updates, no collector ETA,
      no map. Matches the plan's "Live status" spec only partially.
- [ ] **No certificates.** Blocked on the certificate engine (root
      `pending.md`) — nothing to download yet.
- [ ] **No payment ledger detail / downloadable statement** — History
      shows amount per collection, but there's no consolidated
      statement view or export.
- [ ] **Referral** — mentioned in the plan as the cheapest acquisition
      channel, nothing built.
- [ ] Real SMS/OTP instead of email+password (root `pending.md`) —
      arguably matters more here than for internal ops staff, since
      restaurant owners are the least likely user group to tolerate a
      password-based flow.

## Known rough edges

- [ ] No lint config for this project (same situation as `mobile/`).
      Verified via `tsc --noEmit` + manual review only.
- [ ] No EAS project / real build — Expo Go only, same SDK 54 constraint
      as the ops app (see `../mobile/pending.md` for why).
- [ ] Demo account (`vendor-demo@navurja.internal`) is already onboarded
      with one outlet and one pending pickup request — fine for testing
      the app, but its data is mock, not real.
