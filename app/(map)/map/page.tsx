"use client";

import { useState } from "react";
import MapView, { POI } from "@/components/map/Mapview"
import POIInput from "@/components/input/POIInput";
import { pois as defaultPois } from "@/app/lib/Pois";
import { getDistance } from "@/lib/distance";
import { Toaster } from "sonner";

export default function MapPage() {
  const [customPois, setCustomPois] = useState<POI[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const handleAddPOI = (poi: POI) => {
    setCustomPois((prev) => [...prev, poi]);
  };

  const nearbyPois = userLocation
    ? defaultPois.filter((poi) => {
        const distance = getDistance(
          userLocation[0],
          userLocation[1],
          poi.lat,
          poi.lng
        );
        return distance <= 5; // 5 km
      })
    : defaultPois;

  const allPois = [...nearbyPois, ...customPois];

  return (
    <div className="relative h-screen w-full">
      <POIInput onAdd={handleAddPOI} />
      <Toaster position="top-center" richColors />
      <MapView pois={allPois} userLocation={userLocation} />
    </div>
  );
}