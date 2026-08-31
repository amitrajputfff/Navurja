import { NextRequest, NextResponse } from "next/server";
import { getVendorUser } from "@/lib/vendor-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });
  if (!auth.user.org_id) return NextResponse.json({ outlets: [] });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("outlets")
    .select("id, name, address, city, pickup_cadence, status")
    .eq("org_id", auth.user.org_id)
    .order("created_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ outlets: data });
}

export async function POST(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });
  if (!auth.user.org_id) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | { name?: string; address?: string; city?: string }
    | null;
  const name = body?.name?.trim();
  const address = body?.address?.trim();
  const city = body?.city?.trim();
  if (!name || !address || !city) {
    return NextResponse.json({ error: "Name, address, and city are required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("outlets").insert({
    org_id: auth.user.org_id,
    name,
    address,
    city,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
