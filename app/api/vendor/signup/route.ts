import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Self-serve signup — no invite code, unlike the admin/ops staff signup
 * flow. Any food business can create an account. Creates the Supabase
 * Auth user directly (service-role admin API, so no email-confirmation
 * round trip is required to start using the app) plus an `app_users` row
 * with role 'fbo_owner' and `org_id` left null — the app routes a
 * freshly-signed-up user straight into onboarding (POST
 * /api/vendor/onboarding) to create their organization before anything
 * else in the vendor API will resolve for them.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; fullName?: string; phone?: string }
    | null;
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const email = body.email?.trim();
  const password = body.password ?? "";
  const fullName = body.fullName?.trim();
  const phone = body.phone?.trim();

  if (!email || password.length < 8) {
    return NextResponse.json(
      { error: "Enter a valid email and an 8+ character password" },
      { status: 400 }
    );
  }
  if (!fullName) {
    return NextResponse.json({ error: "Your name is required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !data.user) {
    return NextResponse.json({ error: createError?.message ?? "Could not create account" }, { status: 400 });
  }

  const { error: profileError } = await supabase.from("app_users").insert({
    id: data.user.id,
    full_name: fullName,
    phone: phone || null,
    role: "fbo_owner",
  });
  if (profileError) {
    return NextResponse.json(
      { error: `Account created but profile setup failed: ${profileError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
