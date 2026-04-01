"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useMapStore } from "@/stores/useMapStore";

interface LocateControlProps {
  map: mapboxgl.Map | null;
}

export default function LocateControl({ map }: LocateControlProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const setUserLocation = useMapStore((s) => s.setUserLocation);

  // refs for marker & circle
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // add built-in Mapbox geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.addControl(geolocate);

    geolocate.on("geolocate", (e: GeolocationPosition) => {
      const { longitude: lng, latitude: lat } = e.coords;
      setUserLocation({ lng, lat });
    });

    // map dragging state
    const handleMoveStart = () => setIsDragging(true);
    const handleMoveEnd = () => setIsDragging(false);
    map.on("movestart", handleMoveStart);
    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("movestart", handleMoveStart);
      map.off("moveend", handleMoveEnd);
      map.removeControl(geolocate);
    };
  }, [map, setUserLocation]);

  const handleLocate = () => {
    if (!map || !map.isStyleLoaded()) return;

    if (!navigator.geolocation) {
      alert("Geolocation not supported in your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude: lng, latitude: lat } = pos.coords;

        // update store
        setUserLocation({ lng, lat });

        // fly to user location
        map.flyTo({ center: [lng, lat], zoom: 14, duration: 2000 });

        // ----------------- MARKER -----------------
        if (!userMarkerRef.current) {
          const el = document.createElement("div");
          el.className = "w-4 h-4 bg-blue-600 rounded-full shadow-lg";
          userMarkerRef.current = new mapboxgl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(map);
        } else {
          userMarkerRef.current.setLngLat([lng, lat]);
        }

        // ----------------- CIRCLE -----------------
        const circleGeoJSON = createCircle([lng, lat], 0.1); // ~100m radius

        if (map.getSource("user-circle")) {
          (map.getSource("user-circle") as mapboxgl.GeoJSONSource).setData(
            circleGeoJSON,
          );
        } else {
          map.addSource("user-circle", {
            type: "geojson",
            data: circleGeoJSON,
          });
          map.addLayer({
            id: "user-circle-fill",
            type: "fill",
            source: "user-circle",
            paint: { "fill-color": "#3b82f6", "fill-opacity": 0.2 },
          });
          map.addLayer({
            id: "user-circle-stroke",
            type: "line",
            source: "user-circle",
            paint: { "line-color": "#3b82f6", "line-width": 2 },
          });
        }

        setTimeout(() => setIsLocating(false), 1200);
      },
      (err) => {
        console.warn(err);
        alert("Location access denied.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <button
      onClick={handleLocate}
      disabled={isLocating}
      className={`fixed top-20 right-6 md:bottom-10 md:right-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-300
      ${isDragging ? "opacity-0" : "opacity-100"}
      ${isLocating ? "animate-pulse" : ""}`}
    >
      📍
    </button>
  );
}

// ----------------- HELPER -----------------
function createCircle(
  center: [number, number],
  radiusInKm: number,
  points = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = center;
  const coords: number[][] = [];
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lng + x, lat + y]);
  }
  coords.push(coords[0]);

  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {},
  };
}
