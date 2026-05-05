"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { GeolocateControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import SearchBox from "./search/SearchBox";
import Popup from "./popup/PopUp";
import MapSkeleton from "./mapskeleton/MapSkeleton";
import { useMapStore } from "@/stores/useMapStore";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Feature = GeoJSON.Feature<
  GeoJSON.Point,
  {
    id: string;
    time: number;
    mag: number;
    place: string;
  }
>;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const points = useMapStore((s) => s.points);
  const userLocation = useMapStore((s) => s.userLocation);

  // ----------------- INIT MAP -----------------
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const { lng, lat } = userLocation || { lng: 3.3792, lat: 6.5244 };

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 12,
    });

    mapRef.current = map;

    map.addControl(
      new GeolocateControl({
        trackUserLocation: true,
        showAccuracyCircle: false,
      })
    );

    map.on("load", () => {
      setIsMapLoaded(true);

      //  Load custom marker image FIRST
      map.loadImage("marker/origin.png", (error, image) => {
        if (error) throw error;

        if (!map.hasImage("custom-marker")) {
          map.addImage("custom-marker", image!);
        }

        // Add source
        map.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        //  Cluster circles
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "points",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#60a5fa",
              10,
              "#3b82f6",
              30,
              "#1d4ed8",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              18,
              10,
              24,
              30,
              30,
            ],
          },
        });

        // 👉 Cluster count labels
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "points",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-size": 12,
          },
          paint: {
            "text-color": "#fff",
          },
        });

       
        map.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "points",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "custom-marker",
            "icon-size": 1.3,
            "icon-anchor": "bottom",
            "icon-allow-overlap": true,
          },
        });

        // ----------------- INTERACTIONS -----------------

        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });

          const clusterId = features[0]?.properties?.cluster_id;
          const source = map.getSource("points") as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom == null) return;

            map.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom,
            });
          });
        });

        map.on("click", "unclustered-point", (e) => {
          e.originalEvent.stopPropagation();

          const feature = e.features?.[0] as Feature | undefined;
          if (!feature) return;

          useMapStore.getState().setSelectedPoint({
            id: feature.properties.id,
          });

          setActiveFeature(feature);
        });

        // close popup if clicking empty space
        map.on("click", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["unclustered-point"],
          });

          if (!features.length) {
            setActiveFeature(null);
          }
        });

        // cursor UX
        ["clusters", "unclustered-point"].forEach((layer) => {
          map.on("mouseenter", layer, () => {
            map.getCanvas().style.cursor = "pointer";
          });

          map.on("mouseleave", layer, () => {
            map.getCanvas().style.cursor = "";
          });
        });
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ----------------- UPDATE DATA -----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("points");

    if (!source || !("setData" in source)) return;

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: points.map((p) => ({
        type: "Feature",
        properties: {
          id: p.id,
          time: p.time,
          mag: p.mag,
          place: p.place,
        },
        geometry: {
          type: "Point",
          coordinates: [p.lng, p.lat],
        },
      })),
    };

    (source as mapboxgl.GeoJSONSource).setData(geojson);

    // 🔥 Optional: auto-fit bounds
    if (points.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();

      points.forEach((p) => bounds.extend([p.lng, p.lat]));

      map.fitBounds(bounds, { padding: 50, duration: 1000 });
    }
  }, [points]);

  // ----------------- RENDER -----------------
  return (
    <div className="relative w-full h-full">
      <MapSkeleton isMapLoaded={isMapLoaded} />

      <SearchBox />

      <div ref={mapContainer} className="w-full h-full" />

      {mapRef.current && (
        <Popup map={mapRef.current} activeFeature={activeFeature} />
      )}
    </div>
  );
}