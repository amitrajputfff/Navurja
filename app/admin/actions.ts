"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const STAFF_ROLES = [
  "admin",
  "city_manager",
  "sales_exec",
  "hub_operator",
] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export async function signUpStaff(formData: FormData) {
  const inviteCode = String(formData.get("inviteCode") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const role = String(formData.get("role") ?? "admin") as StaffRole;

  if (inviteCode !== process.env.ADMIN_SIGNUP_CODE) {
    return { error: "Invalid invite code" };
  }
  if (!email || password.length < 8) {
    return { error: "Enter a valid email and an 8+ character password" };
  }
  if (!STAFF_ROLES.includes(role)) {
    return { error: "Invalid role" };
  }

  const supabase = getSupabaseServerClient();

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !data.user) {
    return { error: createError?.message ?? "Could not create account" };
  }

  const { error: profileError } = await supabase.from("app_users").insert({
    id: data.user.id,
    full_name: fullName || null,
    role,
  });
  if (profileError) {
    return { error: `Account created but role assignment failed: ${profileError.message}` };
  }

  redirect("/admin/login?created=1");
}
