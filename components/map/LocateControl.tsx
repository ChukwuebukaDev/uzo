"use client";

import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

export default function LocateControl({ map }: { map: mapboxgl.Map | null }) {
  const [isLocating, setIsLocating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Track dragging (like Leaflet's useMapEvents)
  useEffect(() => {
    if (!map) return;

    const handleMoveStart = () => setIsDragging(true);
    const handleMoveEnd = () => setIsDragging(false);

    map.on("movestart", handleMoveStart);
    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("movestart", handleMoveStart);
      map.off("moveend", handleMoveEnd);
    };
  }, [map]);

  const handleLocate = () => {
    if (!map || !map.isStyleLoaded()) return;

    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;

        // Fly to location
        map.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 2000,
        });

        // ----------------- MARKER -----------------
        const el = document.createElement("div");
        el.className = "w-4 h-4 bg-blue-600 rounded-full shadow-lg";

        const marker = new mapboxgl.Marker({ element: el }).setLngLat([
          lng,
          lat,
        ]);

        marker.addTo(map);
        // ----------------- CIRCLE -----------------
        const circleGeoJSON = createCircle([lng, lat], 0.1); // ~100m

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
            paint: {
              "fill-color": "#3b82f6",
              "fill-opacity": 0.2,
            },
          });

          map.addLayer({
            id: "user-circle-stroke",
            type: "line",
            source: "user-circle",
            paint: {
              "line-color": "#3b82f6",
              "line-width": 2,
            },
          });
        }

        setTimeout(() => setIsLocating(false), 1200);
      },
      (err) => {
        alert("Location access denied.");
        console.warn(err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <button
      onClick={handleLocate}
      className={`fixed top-20 right-6 md:bottom-10 md:right-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-300 ${
        isDragging ? "opacity-0" : "opacity-100"
      } ${isLocating ? "animate-pulse" : ""}`}
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
  const coords = {
    latitude: center[1],
    longitude: center[0],
  };

  const km = radiusInKm;

  const ret: number[][] = [];

  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);

    ret.push([coords.longitude + x, coords.latitude + y]);
  }

  ret.push(ret[0]);

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ret],
    },
    properties: {},
  };
}
