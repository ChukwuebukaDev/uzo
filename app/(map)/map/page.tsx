"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { POI } from "@/components/map/Mapview";
import { pois as defaultPois } from "@/app/lib/Pois";
import { getDistance } from "@/lib/distance";
import { Toaster } from "sonner";
import ToolRenderer from "@/components/map/ToolRenderer";
import RouteInfoPanel from "@/components/route/RouteInfoPanel";
import FloatingControls from "@/components/map/controls/MapControls";
const MapView = dynamic(() => import("@/components/map/Mapview"), {
  ssr: false,
});

export default function MapPage() {
  const [customPois, setCustomPois] = useState<POI[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  // const handleAddPOI = (poi: POI) => {
  //   setCustomPois((prev) => [...prev, poi]);
  // };

  const nearbyPois = userLocation
    ? defaultPois.filter((poi) => {
        const distance = getDistance(
          userLocation[0],
          userLocation[1],
          poi.lat,
          poi.lng,
        );
        return distance <= 5; // 5 km
      })
    : defaultPois;

  const allPois = [...nearbyPois, ...customPois];

  return (
    <div className="relative h-screen w-full">
      <RouteInfoPanel />
      <ToolRenderer />
      <Toaster position="top-center" richColors />
      <MapView pois={allPois} userLocation={userLocation} />
      <FloatingControls />
    </div>
  );
}
