import { NextRequest, NextResponse } from "next/server";
import { getVendorUser } from "@/lib/vendor-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getVendorUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });
  if (!auth.user.org_id) return NextResponse.json({ collections: [] });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select(
      "id, collected_at, net_kg, quality_grade, rate_per_kg, net_payable, photo_url, outlets!inner(id, name, org_id)"
    )
    .eq("outlets.org_id", auth.user.org_id)
    .order("collected_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const collections = await Promise.all(
    (data ?? []).map(async (row) => {
      if (!row.photo_url) return { ...row, photo_url: null };
      const { data: signed } = await supabase.storage
        .from("collection-photos")
        .createSignedUrl(row.photo_url, 3600);
      return { ...row, photo_url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ collections });
}
