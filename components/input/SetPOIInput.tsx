import { getDistance } from "@/lib/distance";
import { pois } from "@/app/lib/Pois";
import { useState } from "react";
export default function SetPoIInput(){
  const [customPois, setCustomPois] = useState<any[]>([]);

  const handleAddPOI = (poi) => {
    setCustomPois((prev) => [...prev, poi]);
  };
  const nearbyPois = userLocation
    ? pois.filter((poi) => {
        const distance = getDistance(
          userLocation[0],
          userLocation[1],
          poi.lat,
          poi.lng
        );
  
        return distance <= 5; // 5km radius
      })
    : pois;
   const allPois = [...nearbyPois, ...customPois];

   return null;
}