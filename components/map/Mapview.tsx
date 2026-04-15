"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { GeolocateControl } from "mapbox-gl";
import SearchBox from "./search/SearchBox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "@/stores/useMapStore";
import Popup from "./popup/PopUp";
import MapSkeleton from "./mapskeleton/MapSkeleton";
import MapboxClickHandler from "./click/MapboxClickHandler";
import LocateControl from "./LocateControl";

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
  const listenersAddedRef = useRef(false);
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const points = useMapStore((s) => s.points);
  const clearPoints = useMapStore((s) => s.clearPoints);
  const userLocation = useMapStore((s) => s.userLocation);

 // initialize map
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
  
    map.addControl(new GeolocateControl({ trackUserLocation: true, showAccuracyCircle: false }));

    map.on("load", () => {
      setIsMapLoaded(true);
    });

    // click outside to close popup
    map.on("click", () => {
      setActiveFeature(null);
    });

    

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // points and clusters
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

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

    const source = map.getSource("points") as mapboxgl.GeoJSONSource;

    if (source) {
      source.setData(geojson);
    } else {
      // add source and layers only once
      map.addSource("points", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // clusters circles
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

      // cluster count labels
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

      // individual points
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#2563eb",
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    }

    // interactions
    if (!listenersAddedRef.current) {
      listenersAddedRef.current = true;

      //click on cluster to zoom in
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

  //  click on a marker to show popup
      map.on("click", "unclustered-point", (e) => {
        e.originalEvent.stopPropagation();

        const feature = e.features?.[0] as Feature | undefined;
        if (!feature) return;

        useMapStore.getState().setSelectedPoint({
          id: feature.properties.id,
        });

        setActiveFeature(feature);
      });

    // cursor changes on marker hover
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, [points]);

  // ----------------- RENDER -----------------
  return (
    <div className="relative w-full h-full">
     
      <MapSkeleton isMapLoaded={isMapLoaded} />

    <SearchBox />
      <div ref={mapContainer} className="w-full h-full" />

    
      {/* {mapRef.current && <MapboxClickHandler map={mapRef.current} />} */}

      {mapRef.current && (
        <Popup map={mapRef.current} activeFeature={activeFeature} />
      )}
    </div>
  );
}