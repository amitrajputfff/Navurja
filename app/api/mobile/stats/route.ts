import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

function startOfDayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfWeekISO() {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = (day + 6) % 7; // days since Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function summarize(rows: { net_kg: number; net_payable: number }[]) {
  return {
    count: rows.length,
    kg: rows.reduce((sum, r) => sum + Number(r.net_kg), 0),
    payable: rows.reduce((sum, r) => sum + Number(r.net_payable), 0),
  };
}

export async function GET(request: NextRequest) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("net_kg, net_payable, collected_at")
    .eq("collector_id", auth.user.id)
    .gte("collected_at", startOfWeekISO());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const todayStart = startOfDayISO();
  const today = (data ?? []).filter((r) => r.collected_at >= todayStart);

  return NextResponse.json({
    today: summarize(today),
    week: summarize(data ?? []),
  });
}
