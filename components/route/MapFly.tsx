import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { Coordinates } from "@/types/routes";

interface Props {
  points: Coordinates[];
}

export default function MapFly({ points }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const { lat, lng } = points[0];
setTimeout(()=>{
   map.flyTo([lat, lng], 14, {
      animate: true,
      duration: 3,
    });  
},3000)
   
  }, [points, map]);

  return null;
}
