import { Navigate } from "@/components/map/marker/MarkerCard";
export type ReverseGeocodeResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
};
export function navigateToPoint({ ...point }: Navigate) {
  if (!point || !point.lat || !point.lng) return;

  const url = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}&travelmode=${point.travelMode}`;

  // Open in a new tab
  window.open(url, "_blank");
}

export async function coordsToAddress(
  lat: number,
  lon: number,
): Promise<ReverseGeocodeResult | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: "json",
    addressdetails: "1",
    zoom: "18",
    "accept-language": "en",
  });

  const url = `https://nominatim.openstreetmap.org/reverse?${params}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "YourAppName/1.0 (your@email.com)", // REQUIRED
      },
      next: { revalidate: 86400 }, // Next.js caching (1 day)
    });

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data: ReverseGeocodeResult = await res.json();
    return data;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
export async function getAddressString(
  lat: number,
  lon: number,
): Promise<string | null> {
  const result = await coordsToAddress(lat, lon);
  return result?.display_name ?? null;
}
