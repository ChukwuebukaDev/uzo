"use client";

import { useMapStore, Point as StorePoint } from "@/stores/useMapStore";
import { POI } from "@/app/lib/Pois";
import MapFly from "../route/MapFly";
import MarkerCard from "./marker/MarkerCard";
import { mergePOIsByRadius } from "@/app/lib/Pois";
import { mapProps } from "@/types/map";
import FocusMarker from "./marker/FocusMarker";
import {
  Marker,
  Circle,
  Popup,
  MarkerClusterGroup,

} from "./leaflet/leaflet";
import MapContainer from "./MapContainer";
import { useIconStore } from "@/stores/useIconStore";

interface MapViewProps {
  pois: POI[];
  userLocation: [number, number] | null;
}

export default function MapView({ pois, userLocation }: MapViewProps) {
  const mapCenter = useMapStore((s) => s.mapCenter);
  const zoom = useMapStore((s) => s.zoom);
  const points = useMapStore((s) => s.points);
  const poiGroups = mergePOIsByRadius(pois, 1500);
  const icons = useIconStore((s) => s.icons);

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
  const mapProperties: mapProps = {
    zoom,
    center: mapCenter,
    zoomControl: false,
    scrollWheelZoom: false,
    maxZoom: 18,
    searchControl: false,
  };
  return (
    <MapContainer properties={mapProperties}>
      <MapFly points={points} />
      <>
        {/* Clustered markers */}
        {/* <MarkerClusterGroup>
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
        </MarkerClusterGroup> */}

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
    </MapContainer>
  );
}
