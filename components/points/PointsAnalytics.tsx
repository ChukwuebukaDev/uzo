"use client";

import { useState, useEffect } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { getDistanceMapbox } from "@/utilities/distance"; // async Mapbox route distance

interface Point {
  id: string;
  lat: number;
  lng: number;
}

export default function PointsAnalytics() {
  const points = useMapStore((s) => s.points);

  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [selectedA, setSelectedA] = useState<Point | null>(null);
  const [selectedB, setSelectedB] = useState<Point | null>(null);

  const [loadingTotal, setLoadingTotal] = useState(true);
  const [loadingAB, setLoadingAB] = useState(false);

  const [totalDistance, setTotalDistance] = useState(0);
  const [distanceAB, setDistanceAB] = useState<number | null>(null);

  // ----------------- Compute Total Distance Async -----------------
  useEffect(() => {
    let isMounted = true;
    setLoadingTotal(true);

    (async () => {
      if (points.length < 2) {
        if (!isMounted) return;
        setTotalDistance(0);
        setLoadingTotal(false);
        return;
      }

      let total = 0;

      for (let i = 0; i < points.length - 1; i++) {
        // Async Mapbox distance
        try {
          const dist = await getDistanceMapbox(
            [points[i].lat, points[i].lng],
            [points[i + 1].lat, points[i + 1].lng],
          );
          if (dist == null) return;
          total += dist;
        } catch (err) {
          console.error("Error fetching Mapbox distance:", err);
        }
      }

      if (!isMounted) return;
      setTotalDistance(total);
      setLoadingTotal(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [points]);

  // ----------------- Compute Distance A → B Async -----------------
  useEffect(() => {
    if (!selectedA || !selectedB) return;

    let isMounted = true;
    setLoadingAB(true);
    setDistanceAB(null);

    (async () => {
      try {
        const dist = await getDistanceMapbox(
          [selectedA.lat, selectedA.lng],
          [selectedB.lat, selectedB.lng],
        );
        if (!isMounted) return;
        setDistanceAB(dist);
      } catch (err) {
        console.error("Error fetching Mapbox distance A→B:", err);
      } finally {
        if (isMounted) setLoadingAB(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedA, selectedB]);

  // ----------------- Get User Location -----------------
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-500 w-[95%] max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl p-5 shadow-2xl border border-white/20 backdrop-blur-3xl bg-linear-to-br from-[#0f172a]/95 via-[#020617]/90 to-black/95 text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-xl text-white tracking-tight">
            Points Analytics
          </h2>
          <button
            onClick={handleGetLocation}
            className="text-xs bg-blue-600/90 hover:bg-blue-500 px-3 py-1.5 rounded-lg shadow-md transition font-semibold"
          >
            Use My Location
          </button>
        </div>

        {/* Total Distance */}
        <div className="mb-5">
          <p className="text-xs text-gray-300 uppercase tracking-wide">
            Total Distance
          </p>
          {loadingTotal ? (
            <div className="flex items-center gap-2 text-blue-400">
              <span className="animate-spin border-b-2 border-white w-4 h-4 rounded-full"></span>
              Calculating...
            </div>
          ) : (
            <p className="text-3xl font-extrabold text-blue-400">
              {totalDistance.toFixed(2)} km
            </p>
          )}
        </div>

        {/* Points List */}
        <div className="max-h-44 overflow-y-auto space-y-2 mb-5 pr-1">
          {points.map((p) => {
            const distFromUser = currentLocation
              ? getDistanceMapbox(currentLocation, [p.lat, p.lng])
              : null;

            return (
              <div
                key={p.id}
                className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition rounded-xl px-4 py-2 border border-white/10 shadow-inner"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {p.name || p.id.slice(0, 5)}
                  </p>
                  {distFromUser && (
                    <p className="text-xs text-gray-300">
                      {typeof distFromUser === "number"
                        ? `${(distFromUser as number).toFixed(2)} km away`
                        : "Loading..."}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedA(p)}
                    className={`text-xs px-3 py-1 rounded-md transition font-semibold ${
                      selectedA?.id === p.id
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-white/10 hover:bg-white/20 text-gray-200"
                    }`}
                  >
                    A
                  </button>

                  <button
                    onClick={() => setSelectedB(p)}
                    className={`text-xs px-3 py-1 rounded-md transition font-semibold ${
                      selectedB?.id === p.id
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-white/10 hover:bg-white/20 text-gray-200"
                    }`}
                  >
                    B
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Distance A → B */}
        <div className="border-t border-white/20 pt-4">
          <p className="text-xs text-gray-300 uppercase tracking-wide">
            Distance Between Points
          </p>

          {loadingAB ? (
            <div className="flex items-center gap-2 text-green-400">
              <span className="animate-spin border-b-2 border-white w-4 h-4 rounded-full"></span>
              Calculating...
            </div>
          ) : distanceAB ? (
            <p className="text-2xl font-bold text-green-400 mt-1">
              {distanceAB.toFixed(2)} km
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">
              Select two points (A & B)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
