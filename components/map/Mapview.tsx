"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMapStore, Point as StorePoint } from "@/stores/useMapStore";
import { POI } from "@/app/lib/Pois";
import LocateControl from "./LocateControl";
import RouteRenderer from "./RouteRenderer";
import MapClickHandler from "./MapClickHandler";
import MapFly from "../route/MapFly";
import MarkerCard from "./marker/MarkerCard";
import { createIcons, Icons } from "@/lib/marker/markerMaker"; 
import { mergePOIsByRadius } from "@/app/lib/Pois";
import MapInitializer from "./UI/MapInitializer";
import FocusMarker from "./marker/FocusMarker";

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
  const mapCenter = useMapStore((s) => s.mapCenter);
  const zoom = useMapStore((s) => s.zoom);
  const points = useMapStore((s) => s.points);
const poiGroups = mergePOIsByRadius(pois, 1500);
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
      center={mapCenter}
      zoom={zoom}
      zoomControl={false}
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
      <MapFly points={points} />

     <>
  {/* Clustered markers */}
  <MarkerClusterGroup>
    {pois.map((poi) => (
      <Marker
        key={poi.id}
        position={[poi.lat, poi.lng]}
        icon={icons.defaultIcon}
      >
        <Popup>
          <h3>{poi.name}</h3>
        </Popup>
      </Marker>
    ))}
  </MarkerClusterGroup>

{poiGroups.map((group, i) => {
  const lat = group.reduce((sum, p) => sum + p.lat, 0) / group.length;
  const lng = group.reduce((sum, p) => sum + p.lng, 0) / group.length;
  const radius = 3000; 
  return (
    <Circle
      key={`group-${i}`}
      center={[lat, lng]}
      radius={radius}
      pathOptions={{
        color: "#facc15",
        fillColor: "#facc15",
        fillOpacity: 0.15,
        weight: 2,
      }}
    />
  );
})}
  {/* Coverage circles outside the cluster */}

</>

      {/* Imported points */}
      {points.map((p, i) => (
        <FocusMarker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={
            duplicateIndexes.has(i) ? icons.duplicateIcon : icons.defaultIcon
          }
        >
          <Popup>
            <MarkerCard id={p.id} name={p.name} lat={p.lat} lng={p.lng} />
          </Popup>
        </FocusMarker>
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
