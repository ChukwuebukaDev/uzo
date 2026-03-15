import { Coordinates, RouteInfo } from "@/types/routes";

export async function getRoute(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteInfo> {

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
      `?overview=full&geometries=geojson`;

    const res = await fetch(url, {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Routing service error: ${res.status}`);
    }

    const data = await res.json();

  
    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found between selected points.");
    }

    const route = data.routes[0];

    return {
      distance: route.distance,   
      duration: route.duration,   
      geometry: route.geometry.coordinates.map(
        ([lng, lat]: number[]) => ({ lat, lng })
      ),
    };

  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Routing request timed out.");
    }

    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Failed to fetch route.");
  } finally {
    clearTimeout(timeout);
  }
}