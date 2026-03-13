"use client";

import { useMapEvents } from "react-leaflet";
import { useRouteStore } from "@/stores/useRouteStore";
import { calculateRoute } from "@/controllers/RouteController";

export default function MapClickHandler() {
  const {
    origin,
    destination,
    setOrigin,
    setDestination,
    clearRoute,
  } = useRouteStore();

  useMapEvents({
    click: async (e) => {
      const coords = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      if (!origin) {
        setOrigin(coords);
      } else if (!destination) {
        setDestination(coords);

        await calculateRoute();
      } else {
        clearRoute();
        setOrigin(coords);
      }
    },
  });

  return null; 
}