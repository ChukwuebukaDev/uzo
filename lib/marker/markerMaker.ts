"use client";

import type { Icon } from "leaflet";

export interface Icons {
  originIcon: Icon;
  destinationIcon: Icon;
  defaultIcon: Icon;
  duplicateIcon: Icon; // highlight duplicates
}

export async function createIcons(): Promise<Icons> {
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

  const duplicateIcon = L.icon({
    iconUrl: "/marker/duplicate.png", // you can make this red or yellow
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return { originIcon, destinationIcon, defaultIcon, duplicateIcon };
}

export interface RouteRendererProps {
  icons: Icons;
}