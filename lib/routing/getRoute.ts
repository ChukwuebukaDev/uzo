import { Coordinates, RouteInfo } from "@/types/routes";

export async function getRoute(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteInfo> {

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
    `?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  // 🧠 Defensive check
  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found");
  }

  const route = data.routes[0];

  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry.coordinates.map(
      ([lng, lat]: number[]) => ({ lat, lng })
    ),
  };
}