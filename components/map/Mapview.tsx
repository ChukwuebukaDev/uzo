"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LocateControl from "./LocateControl";
import RouteRenderer from "./RouteRenderer";
import MapClickHandler from "./MapClickHandler";
import { createIcons } from "@/lib/marker/markerMaker";

export type POI = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

// Dynamic React-Leaflet imports
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), { ssr: false });
const MarkerClusterGroup = dynamic(() => import("react-leaflet-cluster").then((m) => m.default), { ssr: false });

interface MapViewProps {
  pois: POI[];
  userLocation: [number, number] | null;
}

export default function MapView({ pois, userLocation }: MapViewProps) {
  const [icons, setIcons] = useState<any>(null);

  // Load Leaflet icons dynamically on client
  useEffect(() => {
    createIcons().then((loadedIcons) => setIcons(loadedIcons));
  }, []);

  if (!icons) return null; // Wait until icons are loaded

  return (
    <MapContainer
      center={userLocation || [40.758, -73.9855]}
      zoom={userLocation ? 14 : 12}
      maxZoom={18}
      style={{ height: "80vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Clustered POIs */}
      <MarkerClusterGroup>
        {pois.map((poi) => (
          <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={icons.defaultIcon}>
            <Popup>
              <h3 className="font-bold">{poi.name}</h3>
              <p>{poi.description}</p>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* User location marker + radius */}
      {userLocation && (
        <>
          <Marker position={userLocation} title="You are here" icon={icons.defaultIcon} />
          <Circle
            center={userLocation}
            radius={3000}
            pathOptions={{
              color: "#facc15",
              fillColor: "#facc15",
              fillOpacity: 0.2,
            }}
          />
        </>
      )}

      <LocateControl icons = {icons} />
      <MapClickHandler/>
      <RouteRenderer icons={icons} />   {/* pass icons if needed */}
    </MapContainer>
  );
}