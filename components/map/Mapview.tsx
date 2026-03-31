"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "@/stores/useMapStore";
import LocateControl from "./LocateControl";
import PointsAnalytics from "./PointsAnalytics";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface Point {
  id: string;
  lng: number;
  lat: number;
}

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const routeMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const points = useMapStore((s) => s.points);

  // ----------------- INIT MAP -----------------
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [3.3792, 6.5244],
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", async () => {
      try {
        // ----------------- ROUTE -----------------
        const res = await fetch(
          `http://localhost:3001/route?start=5.701686,5.597889&end=3.4000,6.4500`,
        );

        const data = await res.json();
        const route = data.routes[0].geometry;
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
            "line-opacity": 0.9,
          },
        });

        // ----------------- ROUTE MARKERS -----------------
        const start = route.coordinates[0];
        const end = route.coordinates[route.coordinates.length - 1];

        routeMarkersRef.current.push(
          addMarker(map, start, "#22c55e"),
          addMarker(map, end, "#ef4444"),
        );

        // ----------------- FIT ROUTE -----------------
        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach((coord: number[]) =>
          bounds.extend(coord as [number, number]),
        );

        map.fitBounds(bounds, { padding: 60, duration: 1000 });
      } catch (err) {
        console.error("Route error:", err);
      }
    });

    return () => {
      routeMarkersRef.current.forEach((m) => m.remove());
      routeMarkersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ----------------- POINT CLUSTERS -----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: points.map((p) => ({
        type: "Feature",
        properties: { id: p.id },
        geometry: {
          type: "Point",
          coordinates: [p.lng, p.lat],
        },
      })),
    };

    // ✅ Update existing source
    const existingSource = map.getSource("points") as mapboxgl.GeoJSONSource;

    if (existingSource) {
      existingSource.setData(geojson);
      return;
    }

    // ----------------- SOURCE -----------------
    map.addSource("points", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // ----------------- CLUSTERS -----------------
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "points",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#60a5fa",
          10,
          "#3b82f6",
          30,
          "#1d4ed8",
        ],
        "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 30, 30],
      },
    });

    // ----------------- CLUSTER COUNT -----------------
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "points",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    // ----------------- SINGLE POINT -----------------
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "points",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#2563eb",
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // ----------------- INTERACTIONS -----------------
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });

      const clusterId = features[0].properties?.cluster_id;

      const source = map.getSource("points") as mapboxgl.GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) return;

        map.easeTo({
          center: (features[0].geometry as any).coordinates,
          zoom,
        });
      });
    });

    map.on("click", "unclustered-point", (e) => {
      const coords = (e.features?.[0].geometry as any).coordinates;
      const id = e.features?.[0].properties?.id;

      new mapboxgl.Popup()
        .setLngLat(coords)
        .setHTML(`<strong>Point ${id}</strong>`)
        .addTo(map);
    });

    map.on("mouseenter", "clustegrs", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
  }, [points]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      <LocateControl map={mapRef.current} />
      <PointsAnalytics />
    </>
  );
}

// ----------------- MARKER HELPER -----------------
function addMarker(map: mapboxgl.Map, lngLat: [number, number], color: string) {
  const el = document.createElement("div");

  el.style.width = "16px";
  el.style.height = "16px";
  el.style.borderRadius = "50%";
  el.style.background = color;
  el.style.boxShadow = "0 0 0 3px white, 0 4px 12px rgba(0,0,0,0.25)";

  return new mapboxgl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
}
