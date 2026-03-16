"use client";

import { useRouteStore } from "@/stores/useRouteStore";
import { formatDistance, formatDuration } from "@/utilities/format";
import { Button } from "@/components/ui/Button";

export default function RouteInfoPanel() {
  const { route, origin, destination, setRoute } = useRouteStore();

  if (!route) return null;

  return (
    <div className="fixed inset-x-0 top-10 md:top-6 md:bottom-auto z-500 flex justify-center px-2 sm:px-4">
      <div
        className="
          w-full max-w-md md:max-w-lg
          rounded-2xl
          bg-white/90 backdrop-blur-xl
          border border-white/30
          shadow-2xl
          p-4 sm:p-5
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-lg font-semibold truncate">
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
        <div className="flex justify-between mb-4 text-sm sm:text-base">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs sm:text-sm">
              Distance
            </span>
            <span className="font-bold text-lg sm:text-xl">
              {formatDistance(route.distance)}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-gray-500 text-xs sm:text-sm">ETA</span>
            <span className="font-bold text-lg sm:text-xl">
              {formatDuration(route.duration)}
            </span>
          </div>
        </div>

        {/* Coordinates */}
        <div className="text-xs sm:text-sm text-gray-600 space-y-1 wrap-break-word">
          <p>
            <span className="font-medium">From:</span>{" "}
            {origin?.lat.toFixed(5)}, {origin?.lng.toFixed(5)}
          </p>
          <p>
            <span className="font-medium">To:</span>{" "}
            {destination?.lat.toFixed(5)}, {destination?.lng.toFixed(5)}
          </p>
        </div>
      </div>
    </div>
  );
}