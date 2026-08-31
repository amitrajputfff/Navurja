import { Linking, Platform } from "react-native";

/**
 * Opens the device's native maps app for turn-by-turn directions.
 * Most outlets don't have lat/lng yet (the admin console doesn't capture
 * it on creation) — falls back to the text address, which every maps app
 * can still geocode, just less precisely than coordinates would.
 */
export function openDirections(lat: number | null, lng: number | null, address: string) {
  const query = lat != null && lng != null ? `${lat},${lng}` : address;
  const label = encodeURIComponent(address);

  const url =
    Platform.OS === "ios"
      ? `maps:0,0?q=${label}${lat != null && lng != null ? `&sll=${lat},${lng}` : ""}`
      : Platform.OS === "android"
        ? `geo:0,0?q=${encodeURIComponent(query)}(${label})`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  Linking.openURL(url).catch(() => Linking.openURL(webFallback));
}

export function callPhone(phone: string) {
  Linking.openURL(`tel:${phone}`).catch(() => {});
}
