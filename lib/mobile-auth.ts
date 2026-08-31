import "server-only";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Auth boundary for the mobile API surface (/api/mobile/**). The Expo app
 * signs in directly against Supabase Auth with the publishable/anon key
 * (safe to embed — that's what it's for) and sends the resulting access
 * token on every request. This verifies that token server-side, then
 * looks up the caller's role the same way the admin console does, and
 * only THEN touches the database via the service-role client — the
 * service-role key itself never leaves this server, so it's never at risk
 * of extraction from the app bundle the way it would be if the mobile
 * app talked to Supabase directly with elevated access.
 */
export async function getMobileUser(request: NextRequest) {
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
    .select("id, role, full_name, active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.active) return { error: "No active profile for this account" as const };

  return { user: { email: user.email ?? null, ...profile } };
}

export const MOBILE_ROLES = ["collector", "sales_exec", "hub_operator", "admin"] as const;
