import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("rate_cards")
    .select("city, segment, quality_grade, rate_per_kg")
    .eq("active", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rateCards: data });
}
