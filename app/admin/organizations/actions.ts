"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";

// Bare <form action> — see the comment on convertLeadToOrganization in
// leads/actions.ts for why errors redirect rather than return.
export async function createOrganization(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const fail = (message: string) =>
    redirect(`/admin/organizations?error=${encodeURIComponent(message)}`);

  const legalName = String(formData.get("legalName") ?? "").trim();
  const segment = String(formData.get("segment") ?? "");
  const city = String(formData.get("city") ?? "").trim();
  const ownerPhone = String(formData.get("ownerPhone") ?? "").trim();
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();
  const outletAddress = String(formData.get("outletAddress") ?? "").trim();

  if (!legalName || !segment || !city || !outletAddress) {
    return fail("Business name, segment, city, and outlet address are required");
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ legal_name: legalName, segment, city, owner_phone: ownerPhone || null, owner_email: ownerEmail || null })
    .select("id")
    .single();
  if (orgError || !org) return fail(orgError?.message ?? "Failed to create organization");

  const { error: outletError } = await supabase.from("outlets").insert({
    org_id: org.id,
    name: legalName,
    address: outletAddress,
    city,
  });
  if (outletError) return fail(outletError.message);

  revalidatePath("/admin/organizations");
  redirect(`/admin/organizations/${org.id}`);
}

export async function addOutlet(orgId: string, formData: FormData) {
  const supabase = getSupabaseServerClient();

  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();

  if (!name || !address || !city) {
    return { error: "Outlet name, address, and city are required" };
  }

  const { error } = await supabase.from("outlets").insert({
    org_id: orgId,
    name,
    address,
    city,
    contact_name: contactName || null,
    contact_phone: contactPhone || null,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/organizations/${orgId}`);
  return { ok: true };
}
