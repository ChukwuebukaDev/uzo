"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMapStore, Point as StorePoint } from "@/stores/useMapStore";
import LocateControl from "./LocateControl";
import RouteRenderer from "./RouteRenderer";
import L from "leaflet";
import MapClickHandler from "./MapClickHandler";
import MapFly from "../route/MapFly";
import { createIcons, Icons } from "@/lib/marker/markerMaker"; // Proper typing
import MapInitializer from "./UI/MapInitializer";
export type POI = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

// Dynamic React-Leaflet imports (no SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), {
  ssr: false,
});
const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-cluster").then((m) => m.default),
  { ssr: false },
);

interface MapViewProps {
  pois: POI[];
  userLocation: [number, number] | null;
}

export default function MapView({ pois, userLocation }: MapViewProps) {
  const [icons, setIcons] = useState<Icons | null>(null);
  const points = useMapStore((s) => s.points);
  useEffect(() => {
    const map = useMapStore.getState().fitBounds;
    if (!map || points.length === 0) return;

    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map(bounds);
  }, [points]);
  useEffect(() => {
    createIcons().then(setIcons);
  }, []);

  if (!icons) return null;

  // Detect duplicates in points
  const findDuplicates = (pts: StorePoint[]) => {
    const map = new Map<string, number[]>();
    pts.forEach((p, i) => {
      const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
      const arr = map.get(key) ?? [];
      arr.push(i);
      map.set(key, arr);
    });
    const dup = new Set<number>();
    for (const idxs of map.values()) {
      if (idxs.length > 1) idxs.forEach((i) => dup.add(i));
    }
    return dup;
  };

  const duplicateIndexes = findDuplicates(points);

  return (
    <MapContainer
      center={userLocation || [6.4475, 3.5236]}
      zoom={userLocation ? 14 : 12}
      zoomControl = {false}
      maxZoom={18}
      style={{ height: "80vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapInitializer />
      {/* Auto-zoom / Fit points */}
      <MapFly points={points} />

      {/* POIs cluster */}
      <MarkerClusterGroup>
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.lat, poi.lng]}
            icon={icons.defaultIcon}
          >
            <Popup>
              <h3 className="font-bold">{poi.name}</h3>
              <p>{poi.description}</p>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* Imported points */}
      {points.map((p, i) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={
            duplicateIndexes.has(i) ? icons.duplicateIcon : icons.defaultIcon
          } // highlight duplicates
        >
          <Popup>
            <h3 className="font-bold">{p.name}</h3>
          </Popup>
        </Marker>
      ))}

      {/* User location */}
      {userLocation && (
        <>
          <Marker
            position={userLocation}
            title="You are here"
            icon={icons.defaultIcon}
          />
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

      <LocateControl icons={icons} />
      <MapClickHandler />
      <RouteRenderer icons={icons} />
    </MapContainer>
  );
}
