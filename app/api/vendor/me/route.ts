import { NextRequest, NextResponse } from "next/server";
import { getVendorUser } from "@/lib/vendor-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  if (!auth.user.org_id) {
    return NextResponse.json({ user: auth.user, organization: null });
  }

  const supabase = getSupabaseServerClient();
  const { data: organization } = await supabase
    .from("organizations")
    .select("id, legal_name, segment, city, status")
    .eq("id", auth.user.org_id)
    .maybeSingle();

  return NextResponse.json({ user: auth.user, organization: organization ?? null });
}

export async function PATCH(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { fullName?: string; phone?: string } | null;
  const fullName = body?.fullName?.trim();
  if (!fullName) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("app_users")
    .update({ full_name: fullName, phone: body?.phone?.trim() || null })
    .eq("id", auth.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
