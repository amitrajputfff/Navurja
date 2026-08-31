import { NextRequest, NextResponse } from "next/server";
import { pickupFormSchema } from "@/lib/validations";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { notifyNewLead } from "@/lib/notify-lead";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`leads:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — bots that fill this hidden field get a normal-looking
  // success response so they don't learn to skip it; the row is never
  // written.
  const { honeypot, ...values } = body as Record<string, unknown>;
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = pickupFormSchema.safeParse({
    ...values,
    pickupDate:
      typeof values.pickupDate === "string" ? new Date(values.pickupDate) : values.pickupDate,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("leads").insert({
    source: "website_pickup_form",
    name: data.name,
    phone: data.phone,
    email: data.email,
    business_name: data.businessName,
    business_type: data.businessType,
    pickup_location: data.pickupLocation,
    oil_quantity_kg: data.oilQuantityKg,
    pickup_date: data.pickupDate.toISOString().slice(0, 10),
    message: data.message ?? null,
  });

  if (error) {
    console.error("leads insert failed", error);
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }

  await notifyNewLead({
    kind: "pickup",
    summary: `${data.name} (${data.businessName}, ${data.businessType})\n${data.phone} · ${data.email}\n${data.pickupLocation}\n~${data.oilQuantityKg} kg, preferred date ${data.pickupDate.toDateString()}${data.message ? `\n\n"${data.message}"` : ""}`,
  });

  return NextResponse.json({ ok: true });
}
