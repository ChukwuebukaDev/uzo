"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Point } from "@/stores/useMapStore";

interface PointFilterProps {
  filterOpen: boolean;
  points: Point[] | null;
  onClose: () => void;
  onApply?: (filtered: Point[]) => void;
}

export default function PointFilter({
  filterOpen,
  points,
  onClose,
  onApply,
}: PointFilterProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  /* ------------------ FLATTEN FUNCTION ------------------ */
  const flattenObject = (obj: any, parentKey = ""): Record<string, any> => {
    let result: Record<string, any> = {};

    for (const key in obj) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }

    return result;
  };

  /* ------------------ FLATTEN ALL POINTS ------------------ */
  const flatPoints = useMemo(() => {
    if (!points) return [];
    return points.map((p) => flattenObject(p));
  }, [points]);

  /* ------------------ GENERATE FILTER COLUMNS ------------------ */
  const columns = useMemo(() => {
    if (!flatPoints.length) return [];

    const keys = Object.keys(flatPoints[0]);

    return keys.map((key) => {
      const values = Array.from(
        new Set(flatPoints.map((p) => String(p[key])))
      ).filter(Boolean);

      return {
        key,
        label: key
          .split(".")
          .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
          .join(" → "),
        options: values,
      };
    });
  }, [flatPoints]);

  /* ------------------ RESET WHEN OPEN ------------------ */
  useEffect(() => {
    if (filterOpen) setFilters({});
  }, [filterOpen]);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    if (!points) return;

    const filtered = flatPoints.filter((point, index) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(point[key]) === value;
      });
    });

    // Map back to original points
    const result = filtered.map((_, i) => points[i]);

    onApply?.(result);
    onClose();
  };

  const clearFilters = () => setFilters({});

  const activeCount = Object.values(filters).filter(Boolean).length;

  if (!points || points.length === 0) return null;

  return (
    <AnimatePresence>
      {filterOpen && (
        <motion.div
          className="fixed inset-0 z-999 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            {/* HEADER */}
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Filter Points</h2>
                <p className="text-sm text-gray-500">
                  Auto-generated from your dataset
                </p>
              </div>

              {activeCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {activeCount} active
                </span>
              )}
            </div>

            {/* BODY */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {columns.map((col) => (
                <div key={col.key} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    {col.label}
                  </label>

                  <select
                    value={filters[col.key] || ""}
                    onChange={(e) =>
                      handleChange(col.key, e.target.value)
                    }
                    className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>

                    {col.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-between">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Clear
              </button>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleApply}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}