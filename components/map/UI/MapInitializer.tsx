import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useMapStore } from "@/stores/useMapStore";

export default function MapInitializer() {
  const map = useMap();

  useEffect(() => {
    // Store fitBounds function in Zustand
    useMapStore.setState({ fitBounds: map.fitBounds.bind(map) });
  }, [map]);

  return null; 
}