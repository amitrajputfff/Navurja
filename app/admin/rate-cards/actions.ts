"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";

// Bare <form action> — see the comment on convertLeadToOrganization in
// leads/actions.ts for why errors redirect rather than return.
export async function createRateCard(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const fail = (message: string) =>
    redirect(`/admin/rate-cards?error=${encodeURIComponent(message)}`);

  const city = String(formData.get("city") ?? "").trim();
  const segment = String(formData.get("segment") ?? "");
  const qualityGrade = String(formData.get("qualityGrade") ?? "standard");
  const ratePerKg = Number(formData.get("ratePerKg"));

  if (!city || !segment || !Number.isFinite(ratePerKg) || ratePerKg <= 0) {
    return fail("City, segment, and a positive rate are required");
  }

  const { error } = await supabase.from("rate_cards").insert({
    city,
    segment,
    quality_grade: qualityGrade,
    rate_per_kg: ratePerKg,
  });
  if (error) return fail(error.message);

  revalidatePath("/admin/rate-cards");
  redirect("/admin/rate-cards");
}

export async function deactivateRateCard(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("rate_cards")
    .update({ active: false, effective_to: new Date().toISOString().slice(0, 10) })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/rate-cards");
  return { ok: true };
}
