import { supabase } from "@/lib/supabase";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL — check mobile/.env");
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new ApiError("Not signed in", 401);
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await authHeader();
  const response = await fetch(`${BASE_URL}${path}`, { headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.error ?? "Request failed", response.status);
  return body as T;
}

export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  const headers = await authHeader();
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.error ?? "Request failed", response.status);
  return body as T;
}

export async function apiPatch<T>(path: string, payload: unknown): Promise<T> {
  const headers = await authHeader();
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.error ?? "Request failed", response.status);
  return body as T;
}

/** Multipart upload — used only for the photo endpoint. */
export async function apiUploadPhoto(uri: string): Promise<{ path: string }> {
  const headers = await authHeader();
  const filename = uri.split("/").pop() ?? "photo.jpg";
  const extension = filename.split(".").pop()?.toLowerCase();
  const mimeType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

  const formData = new FormData();
  // React Native's fetch/FormData accepts this { uri, name, type } shape
  // for a file field — it is not a real Blob/File, but RN's networking
  // layer knows to stream the file at `uri` when it sees this shape.
  formData.append("file", { uri, name: filename, type: mimeType } as unknown as Blob);

  const response = await fetch(`${BASE_URL}/api/mobile/upload`, {
    method: "POST",
    headers,
    body: formData,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.error ?? "Upload failed", response.status);
  return body as { path: string };
}
