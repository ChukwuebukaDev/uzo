"use client";

import dynamic from "next/dynamic";
import { ReactNode, useEffect } from "react";
import { mapProps } from "@/types/map";
import { MapContainerProps as LeafletProps } from "react-leaflet";
import LocationSearch from "./LocationSearch";
import MapInitializer from "./UI/MapInitializer";
import MapClickHandler from "./MapClickHandler";
import { useIconStore } from "@/stores/useIconStore";
import LocateControl from "./LocateControl";
import RouteRenderer from "./RouteRenderer";

interface MapWrapperProps {
  properties: mapProps;
  children?: ReactNode;
}

const LeafletMapContainer = dynamic<LeafletProps>(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

export default function MapContainer({
  children,
  properties,
}: MapWrapperProps) {
  const { zoom, center, zoomControl, scrollWheelZoom, searchControl } =
    properties;
  const icons = useIconStore((s) => s.icons);
  const loadIcons = useIconStore((s) => s.loadIcons);

  useEffect(() => {
    loadIcons();
  }, []);
  if (!icons) return;
  return (
    <>
      <LeafletMapContainer
        center={center}
        zoom={zoom}
        zoomControl={zoomControl}
        scrollWheelZoom={scrollWheelZoom}
        className="absolute inset-0 h-full w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapInitializer />
        {/*<MapClickHandler/>*/}
        <RouteRenderer icons={icons} />
        <LocateControl icons={icons} />
        {children}
      </LeafletMapContainer>
      {searchControl && <LocationSearch />}
    </>
  );
}
