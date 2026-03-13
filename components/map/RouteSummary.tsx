"use client";

import { useRouteStore } from "@/stores/useRouteStore";

export default function RouteSummary() {
  const route = useRouteStore((s) => s.route);

  if (!route) return null;

  const km = (route.distance / 1000).toFixed(1);
  const min = Math.round(route.duration / 60);

  return (
    <div className="absolute bottom-32 left-4 z-40
      bg-white shadow-xl rounded-2xl p-4">

      <h3 className="font-bold mb-1">Route</h3>

      <p>{km} km</p>
      <p>{min} min</p>

    </div>
  );
}