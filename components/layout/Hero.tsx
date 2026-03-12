"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import React Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  // Only render map after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
      
      {/* Map Background */}
      {mounted && (
        <MapContainer
          center={[9.0765, 7.3986]}
          zoom={6}
          scrollWheelZoom={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 0,
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      <div className="relative z-20 px-6 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-snug md:leading-snug text-white">
          Discover Locations with <span className="text-yellow-400">Uzo</span> 🌍
        </h1>

        <p className="mt-6 text-white/90 text-base sm:text-lg md:text-xl">
          Explore geospatial data, discover nearby locations, and visualize
          places on an interactive map.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="/map"
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-yellow-400 text-black text-sm sm:text-base font-medium hover:bg-yellow-500 hover:shadow-lg transition duration-300"
          >
            Open Map
          </Link>
        </div>
      </div>

      {/* Floating Location Markers */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-bounce z-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse z-20"></div>
      <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce z-20"></div>
    </section>
  );
}