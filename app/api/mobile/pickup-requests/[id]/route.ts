import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("pickup_requests")
    .select(
      "id, status, requested_window_start, requested_window_end, estimated_kg, assigned_collector_id, outlets(id, name, address, city, contact_name, contact_phone, lat, lng, organizations(id, legal_name, segment))"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.assigned_collector_id !== auth.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ request: data });
}
