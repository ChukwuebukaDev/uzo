"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Point } from "@/stores/useMapStore";

export default function MapFly({ points }: { points: Point[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    map.whenReady(() => {
      requestAnimationFrame(() => {
        const bounds = L.latLngBounds(
          points.map((p) => [p.lat, p.lng])
        );

        map.fitBounds(bounds, { padding: [40, 40] });
      });
    });
  }, [points, map]);

  return null;
}