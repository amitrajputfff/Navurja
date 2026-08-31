import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { notifyNewLead } from "@/lib/notify-lead";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`newsletter:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { honeypot, ...values } = body as Record<string, unknown>;
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  // Upsert on the unique email column — resubscribing isn't an error.
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error("newsletter upsert failed", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  await notifyNewLead({ kind: "newsletter", summary: parsed.data.email });

  return NextResponse.json({ ok: true });
}
