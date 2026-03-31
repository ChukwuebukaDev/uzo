"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { RouteRendererProps } from "@/lib/marker/markerMaker";

const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});

export default function LocateControl({ icons }: RouteRendererProps) {
  const map = useMap();
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useMapEvents({
    movestart: () => {
      setIsDragging(true);
    },
    moveend: () => {
      setIsDragging(false);
    },
  });

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setLocation(coords);
        map.flyTo(coords, 14, { animate: true, duration: 2 });
        setTimeout(() => setIsLocating(false), 1200); // stop pulsing after animation
      },
      (err) => {
        alert("Unable to retrieve location. Please allow location access.");
        console.warn(err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <>
      {/* Circle around user */}
      {location && (
        <Circle
          center={location}
          radius={100}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
          }}
        />
      )}

      {/* User Marker */}
      {location && <Marker position={location} icon={icons.defaultIcon} />}

      {/* Locate Me Button */}
      <button
        onClick={handleLocate}
        className={`fixed top-20 transition-opacity duration-500 cursor-pointer ${isDragging ? "opacity-0" : "opacity-100"} right-6 md:bottom-10 md:right-10 z-500 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition transform duration-300 ${
          isLocating ? "animate-pulse" : ""
        }`}
        title="Find My Location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m8-9h1M3 12H2m9-9a9 9 0 110 18 9 9 0 010-18zm0 4a5 5 0 100 10 5 5 0 000-10z"
          />
        </svg>
      </button>
    </>
  );
}
