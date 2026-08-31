import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select(
      "id, collected_at, gross_kg, tare_kg, net_kg, quality_grade, rate_per_kg, net_payable, gps_lat, gps_lng, photo_url, confirmation_otp_verified, notes, collector_id, outlets(id, name, address, city, organizations(id, legal_name, segment)), payments(mode, amount, status)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.collector_id !== auth.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let photoUrl: string | null = null;
  if (data.photo_url) {
    const { data: signed } = await supabase.storage
      .from("collection-photos")
      .createSignedUrl(data.photo_url, 3600);
    photoUrl = signed?.signedUrl ?? null;
  }

  return NextResponse.json({ collection: { ...data, photo_url: photoUrl } });
}
