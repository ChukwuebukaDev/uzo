"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useMapStore } from "@/stores/useMapStore";

interface Point {
  id: string;
  lng: number;
  lat: number;
}

interface PointRendererProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
}

export default function PointRenderer({ mapRef }: PointRendererProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const points = useMapStore((s) => s.points);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    points.forEach((point: Point) => {
      const el = document.createElement("div");
      el.className = "point-marker";
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#2563eb";
      el.style.boxShadow = "0 0 0 3px white, 0 2px 6px rgba(0,0,0,0.3)";

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Optional: Fit map to markers
    if (points.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 60 });
    }
  }, [points, mapRef]);

  return null;
}
