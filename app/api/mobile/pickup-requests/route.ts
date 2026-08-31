import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

// v1 scope: the collector flow only. A request assigned to me, with
// enough outlet/org context on it that the app never needs a second
// round-trip before starting a collection.
export async function GET(request: NextRequest) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("pickup_requests")
    .select(
      "id, status, requested_window_start, requested_window_end, estimated_kg, outlets(id, name, address, city, contact_name, contact_phone, lat, lng, organizations(id, legal_name, segment))"
    )
    .eq("assigned_collector_id", auth.user.id)
    .in("status", ["scheduled", "assigned", "in_progress"])
    .order("requested_window_start", { ascending: true, nullsFirst: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data });
}
