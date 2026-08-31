import { NextRequest, NextResponse } from "next/server";
import { getVendorUser } from "@/lib/vendor-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type OnboardingPayload = {
  legalName: string;
  segment: string;
  city: string;
  outletName: string;
  outletAddress: string;
};

/** One-time: creates the org + first outlet for a freshly signed-up
 * vendor and links app_users.org_id. Rejected if already onboarded —
 * use POST /api/vendor/outlets to add further outlets afterward. */
export async function POST(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });
  if (auth.user.org_id) {
    return NextResponse.json({ error: "Already onboarded" }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as OnboardingPayload | null;
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const { legalName, segment, city, outletName, outletAddress } = body;
  if (!legalName?.trim() || !segment || !city?.trim() || !outletName?.trim() || !outletAddress?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      legal_name: legalName.trim(),
      segment,
      city: city.trim(),
      owner_user_id: auth.user.id,
      owner_email: auth.user.email,
      owner_phone: auth.user.phone,
    })
    .select("id")
    .single();
  if (orgError || !org) {
    return NextResponse.json({ error: orgError?.message ?? "Failed to create organization" }, { status: 500 });
  }

  const { error: outletError } = await supabase.from("outlets").insert({
    org_id: org.id,
    name: outletName.trim(),
    address: outletAddress.trim(),
    city: city.trim(),
    contact_name: auth.user.full_name,
    contact_phone: auth.user.phone,
  });
  if (outletError) {
    return NextResponse.json({ error: outletError.message }, { status: 500 });
  }

  const { error: linkError } = await supabase
    .from("app_users")
    .update({ org_id: org.id })
    .eq("id", auth.user.id);
  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orgId: org.id });
}
