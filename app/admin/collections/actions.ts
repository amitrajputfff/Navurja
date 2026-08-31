"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server-auth";

export async function createCollection(formData: FormData) {
  const outletId = String(formData.get("outletId") ?? "");
  const netKg = Number(formData.get("netKg"));
  const ratePerKg = Number(formData.get("ratePerKg"));
  const qualityGrade = String(formData.get("qualityGrade") ?? "standard");
  const paymentMode = String(formData.get("paymentMode") ?? "cash");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!outletId || !Number.isFinite(netKg) || netKg <= 0) {
    return { error: "Outlet and a positive net kg are required" };
  }
  if (!Number.isFinite(ratePerKg) || ratePerKg <= 0) {
    return { error: "Rate per kg is required" };
  }

  const authClient = await getSupabaseServerAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const supabase = getSupabaseServerClient();
  const { data: collection, error } = await supabase
    .from("collections")
    .insert({
      outlet_id: outletId,
      net_kg: netKg,
      rate_per_kg: ratePerKg,
      quality_grade: qualityGrade,
      notes: notes || null,
      entered_by: user?.id ?? null,
      entry_method: "manual",
    })
    .select("id, net_payable")
    .single();

  if (error || !collection) return { error: error?.message ?? "Failed to record collection" };

  const { error: paymentError } = await supabase.from("payments").insert({
    collection_id: collection.id,
    mode: paymentMode,
    amount: collection.net_payable,
    status: "settled",
    settled_at: new Date().toISOString(),
  });
  if (paymentError) return { error: paymentError.message };

  revalidatePath("/admin/collections");
  revalidatePath("/admin");
  return { ok: true };
}
