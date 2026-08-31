import { NextRequest, NextResponse } from "next/server";
import { getVendorUser } from "@/lib/vendor-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

function startOfMonthISO() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// Rough, clearly-labeled estimate (not a precise LCA figure) — UCO-derived
// biodiesel displacing fossil diesel is commonly cited in the ~2.5-3x
// range for CO2e avoided per kg processed. Same "illustrative, not a
// claim" discipline as IMPACT_METRICS in lib/constants.ts on the website.
const CO2E_ESTIMATE_FACTOR = 2.5;

export async function GET(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });
  if (!auth.user.org_id) {
    return NextResponse.json({
      month: { kg: 0, payable: 0, count: 0 },
      lifetime: { kg: 0, payable: 0, count: 0, co2eKgEstimate: 0 },
    });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("net_kg, net_payable, collected_at, outlets!inner(org_id)")
    .eq("outlets.org_id", auth.user.org_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const monthStart = startOfMonthISO();
  const monthRows = rows.filter((r) => r.collected_at >= monthStart);

  const sum = (list: typeof rows, key: "net_kg" | "net_payable") =>
    list.reduce((total, r) => total + Number(r[key]), 0);

  const lifetimeKg = sum(rows, "net_kg");

  return NextResponse.json({
    month: { kg: sum(monthRows, "net_kg"), payable: sum(monthRows, "net_payable"), count: monthRows.length },
    lifetime: {
      kg: lifetimeKg,
      payable: sum(rows, "net_payable"),
      count: rows.length,
      co2eKgEstimate: Math.round(lifetimeKg * CO2E_ESTIMATE_FACTOR),
    },
  });
}
