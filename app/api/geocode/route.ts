import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";

/**
 * Thin proxy to OpenStreetMap's free Nominatim search, restricted to
 * India. Proxied (rather than called from the browser) because Nominatim
 * requires a descriptive User-Agent identifying the calling application —
 * fine to set server-side, not reliably settable from `fetch` in a
 * browser — and because their usage policy asks for server-side request
 * shaping (debounce/rate-limit) rather than unthrottled client calls.
 * No API key: this is free, best-effort geocoding, not a production
 * routing dependency — swap for Google Places if better India coverage
 * or autocomplete UX is needed later.
 */
export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`geocode:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "NavUrja-Website/1.0 (hello@navurja.com)",
      "Accept-Language": "en-IN",
    },
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json({ results: [] });
  }

  const data = (await response.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    address?: { city?: string; town?: string; village?: string; state?: string };
  }>;

  return NextResponse.json({
    results: data.map((item) => ({
      label: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
      city: item.address?.city ?? item.address?.town ?? item.address?.village ?? null,
      state: item.address?.state ?? null,
    })),
  });
}
