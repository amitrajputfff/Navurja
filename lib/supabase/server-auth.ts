import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Session-aware client for Server Components/Actions — reads the signed-in
 * user via cookies. Uses the anon key and is subject to RLS (no policies =
 * no table access), which is exactly right: this client is for "who is
 * signed in", never for reading/writing business data. Business data goes
 * through lib/supabase-server.ts's service-role client, gated by the role
 * check in app/admin/layout.tsx.
 */
export async function getSupabaseServerAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render — middleware already
            // refreshes the session cookie, so this is safe to ignore.
          }
        },
      },
    }
  );
}
