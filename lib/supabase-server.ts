import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — server-only. Bypasses RLS by design, since the
 * `leads` / `newsletter_subscribers` tables carry no policies at all (see
 * the Phase 0 SQL migration). Never import this from a client component.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — set them in .env.local"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
