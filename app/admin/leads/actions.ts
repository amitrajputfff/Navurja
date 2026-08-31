"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const LEAD_STATUSES = ["new", "contacted", "converted", "dead"] as const;

export async function updateLeadStatus(leadId: string, status: string) {
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) {
    return { error: "Invalid status" };
  }
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) return { error: error.message };
  revalidatePath("/admin/leads");
  return { ok: true };
}

// Used directly as a plain <form action>, which requires a void-returning
// function (React's form-action typing) — errors are reported by
// redirecting back to the same page with ?error=, not by returning a
// value, since `redirect()` throws and never actually returns here.
export async function convertLeadToOrganization(leadId: string, formData: FormData) {
  const supabase = getSupabaseServerClient();
  const fail = (message: string) =>
    redirect(`/admin/leads/${leadId}/convert?error=${encodeURIComponent(message)}`);

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();
  if (leadError || !lead) return fail("Lead not found");

  const city = String(formData.get("city") ?? "").trim();
  if (!city) return fail("City is required");

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      legal_name: lead.business_name,
      segment: lead.business_type,
      owner_phone: lead.phone,
      owner_email: lead.email,
      city,
      lead_id: lead.id,
    })
    .select("id")
    .single();
  if (orgError || !org) return fail(orgError?.message ?? "Failed to create organization");

  const { error: outletError } = await supabase.from("outlets").insert({
    org_id: org.id,
    name: lead.business_name,
    address: lead.pickup_location,
    city,
    contact_name: lead.name,
    contact_phone: lead.phone,
  });
  if (outletError) return fail(outletError.message);

  await supabase
    .from("leads")
    .update({ status: "converted", converted_org_id: org.id })
    .eq("id", leadId);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/organizations");
  redirect(`/admin/organizations/${org.id}`);
}
