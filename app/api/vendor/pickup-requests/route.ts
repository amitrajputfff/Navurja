import { NextRequest, NextResponse } from "next/server";
import { getVendorUser } from "@/lib/vendor-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });
  if (!auth.user.org_id) return NextResponse.json({ requests: [] });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("pickup_requests")
    .select("id, status, estimated_kg, requested_window_start, created_at, outlets!inner(id, name, org_id)")
    .eq("outlets.org_id", auth.user.org_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data });
}

export async function POST(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });
  if (!auth.user.org_id) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | { outletId?: string; estimatedKg?: number }
    | null;
  const outletId = body?.outletId;
  const estimatedKg = body?.estimatedKg;
  if (!outletId) return NextResponse.json({ error: "Outlet is required" }, { status: 400 });

  const supabase = getSupabaseServerClient();

  // The outlet must actually belong to this vendor's own organization —
  // otherwise anyone could request a pickup against someone else's
  // outlet by guessing an id.
  const { data: outlet } = await supabase
    .from("outlets")
    .select("id, org_id")
    .eq("id", outletId)
    .maybeSingle();
  if (!outlet || outlet.org_id !== auth.user.org_id) {
    return NextResponse.json({ error: "Outlet not found" }, { status: 404 });
  }

  const { error } = await supabase.from("pickup_requests").insert({
    outlet_id: outletId,
    requested_by: auth.user.id,
    estimated_kg: Number.isFinite(estimatedKg) ? estimatedKg : null,
    status: "requested",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
