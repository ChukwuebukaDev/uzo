import mapboxgl from "mapbox-gl";
import { addMarker } from "@/utilities/markerMaker";
export async function fetchRoute(
  map: mapboxgl.Map,
  start: { lng: number; lat: number },
  end: { lng: number; lat: number },
  routeMarkersRef: React.MutableRefObject<mapboxgl.Marker[]>,
) {
  try {
    const res = await fetch(
      `http://localhost:3001/route?start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`,
    );
    if (!res.ok) throw new Error("Failed to fetch route");

    const data = await res.json();
    const route = data.routes?.[0]?.geometry;
    if (!route) return;

    const existingSource = map.getSource("route") as mapboxgl.GeoJSONSource;
    if (existingSource) {
      existingSource.setData({
        type: "Feature",
        geometry: route,
        properties: {},
      });
    } else {
      map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: route, properties: {} },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-width": 5,
          "line-color": "#007AFF",
          "line-opacity": 0.9,
        },
      });
    }

    routeMarkersRef.current.forEach((m) => m.remove());
    routeMarkersRef.current = [
      addMarker(map, route.coordinates[0], "#22c55e"),
      addMarker(
        map,
        route.coordinates[route.coordinates.length - 1],
        "#ef4444",
      ),
    ];

    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach((c: number[]) =>
      bounds.extend(c as [number, number]),
    );
    map.fitBounds(bounds, { padding: 60, duration: 1000 });
  } catch (err) {
    console.error("Route fetch error:", err);
  }
}
