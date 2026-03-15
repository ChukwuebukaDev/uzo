"use client";

import { useRouteStore } from "@/stores/useRouteStore";
import { formatDistance, formatDuration } from "@/utilities/format";
import { Button } from "@/components/ui/Button";

export default function RouteInfoPanel() {
  const { route, origin, destination, setRoute } =
    useRouteStore();

  if (!route) return null;

  return (
    <div
      className="
        fixed z-500
        left-1/2 -translate-x-1/2
        bottom-4
        md:top-6 md:bottom-auto
      "
    >
      <div
        className="
          w-[92vw] max-w-md md:max-w-lg
          rounded-2xl
          bg-white/85 backdrop-blur-xl
          border border-white/40
          shadow-2xl
          p-4 md:p-5
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base md:text-lg font-semibold">
            Route Summary
          </h2>

          <Button
            variant="danger"
            onClick={() => setRoute(null)}
          >
            Clear
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">
              Distance
            </p>
            <p className="text-lg md:text-xl font-bold">
              {formatDistance(route.distance)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">
              ETA
            </p>
            <p className="text-lg md:text-xl font-bold">
              {formatDuration(route.duration)}
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="text-xs md:text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">From:</span>{" "}
            {origin?.lat.toFixed(4)}, {origin?.lng.toFixed(4)}
          </p>

          <p>
            <span className="font-medium">To:</span>{" "}
            {destination?.lat.toFixed(4)}, {destination?.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}