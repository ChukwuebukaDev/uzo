"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "@/stores/useMapStore";
import LocateControl from "./LocateControl";
import { fetchRoute } from "@/lib/routing/getRoute";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const routeMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const listenersAddedRef = useRef(false);

  const points = useMapStore((s) => s.points);
  const userLocation = useMapStore((s) => s.userLocation);
  const getSelectedPoint = useMapStore((s) => s.getSelectedPoint);
  const getNearestPoint = useMapStore((s) => s.getNearestPoint);

  // ----------------- INIT MAP -----------------
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [3.3792, 6.5244], // default fallback
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", () => console.log("Map loaded"));

    return () => {
      routeMarkersRef.current.forEach((m) => m.remove());
      routeMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ----------------- ROUTE FETCH -----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    const destination = getSelectedPoint() || getNearestPoint();
    if (!destination) return;

    // wait until map style is loaded
    if (!map.isStyleLoaded()) {
      map.once("load", () =>
        fetchRoute(map, userLocation, destination, routeMarkersRef),
      );
    } else {
      fetchRoute(map, userLocation, destination, routeMarkersRef);
    }
  }, [userLocation, points]);

  // ----------------- POINT CLUSTERS -----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: points.map((p) => ({
        type: "Feature",
        properties: { id: p.id },
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      })),
    };

    // update existing source or create new
    const existingSource = map.getSource("points") as mapboxgl.GeoJSONSource;
    if (existingSource) {
      existingSource.setData(geojson);
    } else {
      map.addSource("points", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

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

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "points",
        filter: ["has", "point_count"],
        layout: { "text-field": "{point_count_abbreviated}", "text-size": 12 },
        paint: { "text-color": "#fff" },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#2563eb",
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    }

    // ----------------- INTERACTIONS -----------------
    if (!listenersAddedRef.current) {
      listenersAddedRef.current = true;

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
        useMapStore.getState().setSelectedPoint(id);
        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(`<strong>Point ${id}</strong>`)
          .addTo(map);
      });

      map.on(
        "mouseenter",
        "clusters",
        () => (map.getCanvas().style.cursor = "pointer"),
      );
      map.on(
        "mouseleave",
        "clusters",
        () => (map.getCanvas().style.cursor = ""),
      );
    }
  }, [points]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      {mapRef.current && <LocateControl map={mapRef.current} />}
    </>
  );
}
