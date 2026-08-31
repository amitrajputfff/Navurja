import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const result = await getMobileUser(request);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 401 });
  return NextResponse.json({ user: result.user });
}

export async function PATCH(request: NextRequest) {
  const result = await getMobileUser(request);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { fullName?: string } | null;
  const fullName = body?.fullName?.trim();
  if (!fullName) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("app_users")
    .update({ full_name: fullName })
    .eq("id", result.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
