import "server-only";
import { Resend } from "resend";

/**
 * Best-effort email alert on new lead. No-ops without RESEND_API_KEY +
 * LEADS_NOTIFY_EMAIL set — the lead is already safely in Supabase by the
 * time this runs, so a missing/failed notification must never fail the
 * request or block the caller.
 */
export async function notifyNewLead(params: {
  kind: "pickup" | "newsletter";
  summary: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    const resend = new Resend(apiKey);
    // resend.emails.send() does NOT throw on API-level failures (bad
    // recipient, restricted key, quota, etc.) — it resolves normally with
    // `{ data: null, error: {...} }`. Missing that check here previously
    // meant a failed send was silently indistinguishable from a
    // successful one; the try/catch alone only ever caught network-level
    // failures.
    const { data, error } = await resend.emails.send({
      // Defaults to Resend's sandbox sender, which needs no domain
      // verification and can send to any address — swap LEADS_FROM_EMAIL
      // in once navurja.com is verified in Resend.
      // `||`, not `??` — LEADS_FROM_EMAIL="" (unset-but-present in
      // .env.local) is falsy but not nullish, and an empty `from` is what
      // produced Resend's "domain is invalid" error during testing.
      from: process.env.LEADS_FROM_EMAIL || "NavUrja Leads <onboarding@resend.dev>",
      to,
      subject:
        params.kind === "pickup"
          ? "New pickup request — NavUrja"
          : "New newsletter signup — NavUrja",
      text: params.summary,
    });
    if (error) {
      console.error("notifyNewLead: Resend API returned an error", error);
    } else {
      console.log("notifyNewLead: sent", data?.id);
    }
  } catch (error) {
    console.error("notifyNewLead failed", error);
  }
}
