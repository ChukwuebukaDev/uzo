import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [3.3792, 6.5244],
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", async () => {
      new mapboxgl.Marker().setLngLat([3.3792, 6.5244]).addTo(map);

      new mapboxgl.Marker({ color: "red" }).setLngLat([3.4, 6.45]).addTo(map);
      try {
        const res = await fetch(
          `http://localhost:3001/route?start=3.3792,6.5244&end=3.4000,6.4500`,
        );

        const data = await res.json();
        const route = data.routes[0].geometry;

        if (!map.getSource("route")) {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: route,
              properties: {},
            },
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-width": 5,
              "line-color": "#007AFF",
            },
          });
        }
      } catch (err) {
        console.error("Route error:", err);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
