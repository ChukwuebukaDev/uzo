"use client";
import Link from "next/link";
import MapContainer from "../map/MapContainer";
import { mapProps } from "@/types/map";
import Image from "next/image";
export default function Hero() {
  const mapProperties: mapProps = {
    zoom: 6,
    center: [9.0765, 7.3986],
    zoomControl: false,
    scrollWheelZoom: false,
    searchControl: false,
  };

  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Map Background */}
      <MapContainer properties={mapProperties} />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      <div className="relative z-20 px-6 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-snug md:leading-snug text-white">
          Discover Locations with <span className="text-yellow-400">Uzo</span>
          🌍
        </h1>

        <p className="mt-6 text-white/90 text-base sm:text-lg md:text-xl">
          Explore geospatial data, discover nearby locations, and visualize
          places on an interactive map.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="/map"
            className="px-6 py-3 sm:px-8 sm:py-4 flex justify-center items-center rounded-lg bg-yellow-400 text-black text-sm sm:text-base font-medium hover:bg-yellow-500 hover:shadow-lg transition duration-300"
          >
            <span>Open Map</span>
            <Image
              alt="marker"
              className="animate-bounce"
              src={"/marker/destination.png"}
              width={30}
              height={30}
            />
          </Link>
        </div>
      </div>

      {/* Floating Location Markers */}
      <div className="absolute top-1/3 right-1/4   animate-bounce z-20">
        <Image
          alt="marker"
          src={"/marker/default.png"}
          width={30}
          height={30}
        />
      </div>
      <div className="absolute top-2/3 left-10  animate-bounce z-20">
        <Image alt="marker" src={"/marker/origin.png"} width={30} height={30} />
      </div>
    </section>
  );
}
