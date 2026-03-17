"use client";

import { Marker, useMap } from "react-leaflet";
import { useRef } from "react";
import L from "leaflet";

interface Props {
  position: [number, number];
  icon: L.Icon;
  children: React.ReactNode;
}

export default function FocusMarker({
  position,
  icon,
  children,
}: Props) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  const handleClick = () => {
    if (!markerRef.current) return;

    map.flyTo(position, Math.max(map.getZoom(), 16), {
      duration: 0.8,
    });

    markerRef.current.openPopup();
  };

  return (
    <Marker
      position={position}
      icon={icon}
      ref={markerRef}
      eventHandlers={{
        click: handleClick,
      }}
    >
      {children}
    </Marker>
  );
}