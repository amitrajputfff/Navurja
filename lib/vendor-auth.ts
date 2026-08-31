import "server-only";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const VENDOR_ROLES = ["fbo_owner", "fbo_staff"] as const;

/**
 * Auth boundary for the vendor API surface (/api/vendor/**), mirroring
 * lib/mobile-auth.ts's approach for the ops app: the Partner app signs in
 * directly against Supabase Auth with the publishable/anon key and sends
 * the resulting access token on every request. This verifies the token
 * server-side, resolves the caller's org via app_users.org_id, and only
 * then touches the database with the service-role client — vendor users
 * can only ever see their own organization's data, enforced here rather
 * than via RLS (same reasoning as the ops app: the service-role key can
 * never safely live in a shipped app bundle).
 */
export async function getVendorUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return { error: "Missing bearer token" as const };

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const {
    data: { user },
    error: authError,
  } = await anonClient.auth.getUser(token);
  if (authError || !user) return { error: "Invalid or expired session" as const };

  const supabase = getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("app_users")
    .select("id, role, full_name, phone, org_id, active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.active) return { error: "No active profile for this account" as const };
  if (!VENDOR_ROLES.includes(profile.role as (typeof VENDOR_ROLES)[number])) {
    return { error: "This account is not a vendor account" as const };
  }

  return { user: { email: user.email ?? null, ...profile } };
}
