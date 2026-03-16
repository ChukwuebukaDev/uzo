"use client";
import dynamic from "next/dynamic";
import { useRouteStore } from "@/stores/useRouteStore";
import { useEffect, useState } from "react";
import { RouteRendererProps } from "@/lib/marker/markerMaker";

const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((m) => m.Polyline), { ssr: false });

export default function RouteRenderer({ icons }: RouteRendererProps) {
  const { origin, destination, route } = useRouteStore();
  const [polylineCoords, setPolylineCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (route?.geometry) {
  setTimeout(()=>setPolylineCoords(route.geometry.map((p) => [p.lat, p.lng])),0)
    } else {
   setTimeout(()=>setPolylineCoords([]),0)
    }
  }, [route]);

  if (!origin && !destination && polylineCoords.length === 0) return null;

  return (
    <>
      {origin && (
        <Marker position={[origin.lat, origin.lng]} icon={icons.originIcon}>
          <Popup>Start Point</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={icons.destinationIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {polylineCoords.length > 0 && (
        <Polyline
          positions={polylineCoords}
          pathOptions={{ color: "#000", weight: 5, opacity: 0.8 }}
        />
      )}
    </>
  );
}