"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMapStore } from "@/stores/useMapStore";

const MapClickHandler = ({ map }: { map: mapboxgl.Map | null }) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // ✅ global selection
 const getSelectedCoords = useMapStore((s) => s.getSelectedCoords);
const selectedCoords = getSelectedCoords();

  // ----------------- HANDLE MAP CLICK -----------------
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      // ✅ update global store ONLY
      useMapStore.getState().setSelectedPoint({
        coords: [lng, lat],
      });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map]);

  // ----------------- SYNC MARKER WITH STORE -----------------
  useEffect(() => {
    if (!map) return;

    // ❌ remove old marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // ❌ no selection → no marker
    if (!selectedCoords) return;

    // ✅ create marker from store state
    markerRef.current = new mapboxgl.Marker({ color: "#000" })
      .setLngLat(selectedCoords)
      .addTo(map);
  }, [map, selectedCoords]);

  return null;
};

export default MapClickHandler;