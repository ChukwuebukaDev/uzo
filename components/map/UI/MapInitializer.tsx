"use client";

import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import { useMapStore } from "@/stores/useMapStore";

export default function MapInitializer() {
  const map = useMap();
  const isUpdating = useRef(false); 
  useEffect(() => {
    const save = () => {
      if (isUpdating.current) return;
      const center = map.getCenter();
      const zoom = map.getZoom();

      const state = useMapStore.getState();
      if (
        center.lat !== state.mapCenter[0] ||
        center.lng !== state.mapCenter[1] ||
        zoom !== state.zoom
      ) {
        isUpdating.current = true;
        state.setMapView([center.lat, center.lng], zoom);
        setTimeout(() => (isUpdating.current = false), 0);
      }
    };

    map.on("moveend", save);
    map.on("zoomend", save);

    return () => {
      map.off("moveend", save);
      map.off("zoomend", save);
    };
  }, [map]);

  return null;
}