"use client";

import { useMemo, useState } from "react";
import DialogOverlay from "../ui/DialogOverlay";
import { useMapStore } from "@/stores/useMapStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PointList({ open, onClose }: Props) {
  const points = useMapStore((s) => s.points);
  const setSelectedPoint = useMapStore((s) => s.setSelectedPoint);

  const [search, setSearch] = useState("");

  // ✅ Filter points
  const filteredPoints = useMemo(() => {
    if (!search) return points;

    return points.filter((p) =>
      `${p.place ?? ""} ${p.id}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [points, search]);

  return (
    <DialogOverlay open={open} onClose={onClose}>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-5 flex flex-col max-h-[80vh]">

        {/* ✅ Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Points</h2>
          <span className="text-sm text-gray-500">
            {filteredPoints.length} items
          </span>
        </div>

        {/* ✅ Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* ✅ Empty state */}
        {filteredPoints.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 text-sm">
            <p>No points found</p>
          </div>
        )}

        {/* ✅ List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredPoints.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPoint({ id: p.id });
                onClose();
              }}
              className="p-3 rounded-xl border border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800">
                  {p.place || `${p.name || p.id.slice(0, 6)}`}
                </h3>

                {p.mag !== undefined && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                    Mag {p.mag}
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="mt-1 text-xs text-gray-500">
                <p>
                  Lat: {p.lat.toFixed(4)} | Lng: {p.lng.toFixed(4)}
                </p>

                {p.time && (
                  <p>
                    {new Date(p.time).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogOverlay>
  );
}