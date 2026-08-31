import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type CollectionPayload = {
  pickupRequestId?: string;
  outletId: string;
  grossKg?: number;
  tareKg?: number;
  netKg: number;
  qualityGrade: "standard" | "premium" | "low";
  ratePerKg: number;
  paymentMode: "cash" | "upi" | "bank" | "credit_note";
  gpsLat: number;
  gpsLng: number;
  photoPath: string;
  verbalConfirmation: boolean;
  notes?: string;
};

// History — the collector's own past collections, most recent first.
export async function GET(request: NextRequest) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select(
      "id, collected_at, net_kg, quality_grade, rate_per_kg, net_payable, photo_url, outlets(id, name, address, organizations(id, legal_name))"
    )
    .eq("collector_id", auth.user.id)
    .order("collected_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // photo_url is a private-bucket storage path, not directly viewable —
  // swap each one for a short-lived signed URL the app can actually load.
  const collections = await Promise.all(
    (data ?? []).map(async (row) => {
      if (!row.photo_url) return { ...row, photo_url: null };
      const { data: signed } = await supabase.storage
        .from("collection-photos")
        .createSignedUrl(row.photo_url, 3600);
      return { ...row, photo_url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ collections });
}

/**
 * The anti-fraud pair for v1 (no SMS/OTP provider configured yet): GPS +
 * photo are both mandatory. `verbalConfirmation` is a placeholder for the
 * real FBO-side OTP confirmation this is meant to become — it's recorded
 * in `confirmation_otp_verified` so the schema doesn't need to change
 * when real OTP delivery is wired up later, but it is NOT currently
 * trustworthy on its own the way a real OTP would be, since nothing
 * outside the app confirms it happened.
 */
export async function POST(request: NextRequest) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = (await request.json().catch(() => null)) as CollectionPayload | null;
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const {
    pickupRequestId,
    outletId,
    grossKg,
    tareKg,
    netKg,
    qualityGrade,
    ratePerKg,
    paymentMode,
    gpsLat,
    gpsLng,
    photoPath,
    verbalConfirmation,
    notes,
  } = body;

  if (!outletId || !Number.isFinite(netKg) || netKg <= 0) {
    return NextResponse.json({ error: "Outlet and a positive net kg are required" }, { status: 400 });
  }
  if (!Number.isFinite(ratePerKg) || ratePerKg <= 0) {
    return NextResponse.json({ error: "Rate per kg is required" }, { status: 400 });
  }
  if (!Number.isFinite(gpsLat) || !Number.isFinite(gpsLng)) {
    return NextResponse.json({ error: "Location is required to record a collection" }, { status: 400 });
  }
  if (!photoPath) {
    return NextResponse.json({ error: "A photo is required to record a collection" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  // A collector may only close out a request that's actually assigned to
  // them — this is the one place a compromised or buggy client could try
  // to attribute a collection to the wrong person's route.
  if (pickupRequestId) {
    const { data: pr } = await supabase
      .from("pickup_requests")
      .select("id, assigned_collector_id")
      .eq("id", pickupRequestId)
      .maybeSingle();
    if (!pr || pr.assigned_collector_id !== auth.user.id) {
      return NextResponse.json({ error: "Pickup request not assigned to you" }, { status: 403 });
    }
  }

  const { data: collection, error } = await supabase
    .from("collections")
    .insert({
      pickup_request_id: pickupRequestId ?? null,
      outlet_id: outletId,
      collector_id: auth.user.id,
      gross_kg: grossKg ?? null,
      tare_kg: tareKg ?? null,
      net_kg: netKg,
      quality_grade: qualityGrade,
      rate_per_kg: ratePerKg,
      gps_lat: gpsLat,
      gps_lng: gpsLng,
      photo_url: photoPath,
      confirmation_otp_verified: !!verbalConfirmation,
      notes: notes || null,
      entered_by: auth.user.id,
      entry_method: "app",
    })
    .select("id, net_payable")
    .single();

  if (error || !collection) {
    return NextResponse.json({ error: error?.message ?? "Failed to record collection" }, { status: 500 });
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    collection_id: collection.id,
    mode: paymentMode,
    amount: collection.net_payable,
    status: "settled",
    settled_at: new Date().toISOString(),
  });
  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  if (pickupRequestId) {
    await supabase.from("pickup_requests").update({ status: "completed" }).eq("id", pickupRequestId);
  }

  return NextResponse.json({ ok: true, collectionId: collection.id, netPayable: collection.net_payable });
}
