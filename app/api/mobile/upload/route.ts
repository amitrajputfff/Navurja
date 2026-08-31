import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const BUCKET = "collection-photos";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Photos are business-sensitive (proof of collection, tied to a specific
 * outlet visit), so the bucket is private — this route uploads on the
 * caller's behalf via the service-role client and hands back a storage
 * path, not a public URL. Whoever needs to *view* a photo later requests
 * a short-lived signed URL for that path rather than the bucket being
 * open.
 */
export async function POST(request: NextRequest) {
  const auth = await getMobileUser(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${auth.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, await file.arrayBuffer(), { contentType: file.type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ path });
}
