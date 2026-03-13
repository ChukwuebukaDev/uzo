
"use client";

export async function createIcons() {
  const L = (await import("leaflet")).default; // dynamically import only on client

  const originIcon = L.icon({
    iconUrl: "/marker/origin.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const destinationIcon = L.icon({
    iconUrl: "/marker/destination.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const defaultIcon = L.icon({
    iconUrl: "/marker/default.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return { originIcon, destinationIcon, defaultIcon };
}

export interface RouteRendererProps {
  icons: {
    originIcon: any;
    destinationIcon: any;
    defaultIcon: any;
  };
}