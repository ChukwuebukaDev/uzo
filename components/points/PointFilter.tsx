"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Point } from "@/stores/useMapStore";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import { HiOutlineChevronDown } from "react-icons/hi2";

interface PointFilterProps {
  columns: {
    key: string;
    label: string;
    options: string[];
  }[];
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
      const newKey = parentKey? `${parentKey}.${key}` : key;

      if (
        typeof obj[key] === "object" &&
        obj[key]!== null &&
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
      ).filter(Boolean).sort();

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

    const filtered = flatPoints.filter((point) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(point[key]) === value;
      });
    });

    // Map back to original points using index
    const result = points.filter((_, idx) => {
      const flatPoint = flatPoints[idx];
      return filtered.includes(flatPoint);
    });

    onApply?.(result);
    onClose();
  };

  const clearFilters = () => setFilters({});

  const activeCount = Object.values(filters).filter(Boolean).length;

  if (!points || points.length === 0) return null;

  return (
    <AnimatePresence>
      {filterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl my-8
                          flex flex-col
                          rounded-2xl sm:rounded-
                          bg-gradient-to-br from-white/70 via-white/60 to-white/40
                          backdrop-blur-2xl backdrop-saturate-150
                          shadow-[0_8px_32px_rgba(31,38,135,0.15)]
                          ring-1 ring-white/30
                          overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* HEADER */}
                <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4
                               border-b border-white/20
                               bg-white/40 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2.5 bg-gradient-to-br from-violet-400/20 to-violet-600/20
                                     rounded-xl backdrop-blur-sm
                                     ring-1 ring-violet-500/20 shrink-0">
                        <Filter size={18} className="text-violet-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                          Filter Points
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600/80 mt-0.5">
                          Auto-generated from your dataset
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {activeCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs font-semibold
                                    bg-violet-500/20 text-violet-700
                                    px-2.5 py-1 rounded-full
                                    ring-1 ring-violet-400/30 backdrop-blur-sm"
                        >
                          {activeCount} active
                        </motion.div>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="p-2 rounded-xl bg-white/50 hover:bg-white/70
                                  backdrop-blur-sm ring-1 ring-white/40
                                  transition-all"
                      >
                        <X size={18} className="text-gray-700" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div className="px-5 sm:px-7 py-5 sm:py-6 max-h- overflow-y-auto">
                  {columns.length === 0? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 bg-white/50 rounded-2xl backdrop-blur-sm
                                     ring-1 ring-white/50 mb-3">
                        <Filter size={32} className="text-gray-400/60" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        No filterable fields
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {columns.map((col, idx) => (
                        <motion.div
                          key={col.key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="space-y-2"
                        >
                          <label className="text-xs sm:text-sm font-semibold text-gray-700 block">
                            {col.label}
                          </label>

                          <div className="relative">
                            <select
                              value={filters[col.key] || ""}
                              onChange={(e) =>
                                handleChange(col.key, e.target.value)
                              }
                              className="w-full appearance-none pl-4 pr-10 py-2.5
                                        bg-white/60 backdrop-blur-md
                                        ring-1 ring-white/50 hover:ring-white/70
                                        focus:ring-2 focus:ring-violet-400/40
                                        rounded-xl text-sm text-gray-900
                                        outline-none transition-all duration-200 cursor-pointer
                                        shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                            >
                              <option value="" className="bg-white">All</option>
                              {col.options.map((opt) => (
                                <option key={opt} value={opt} className="bg-white">
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <HiOutlineChevronDown
                              className="absolute right-3.5 top-1/2 -translate-y-1/2
                                        text-gray-500/70 pointer-events-none"
                              size={16}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="px-5 sm:px-7 py-4 sm:py-5
                               border-t border-white/20
                               bg-white/40 backdrop-blur-xl
                               pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={clearFilters}
                      disabled={activeCount === 0}
                      className="px-4 py-2.5 rounded-xl
                                bg-white/60 hover:bg-white/80
                                backdrop-blur-sm ring-1 ring-white/50
                                text-gray-700 text-sm font-medium
                                disabled:opacity-40 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2
                                transition-all"
                    >
                      <RotateCcw size={16} />
                      Clear
                    </motion.button>

                    <div className="flex gap-2 sm:gap-3">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl
                                  bg-white/60 hover:bg-white/80
                                  backdrop-blur-sm ring-1 ring-white/50
                                  text-gray-700 text-sm font-medium
                                  transition-all"
                      >
                        Cancel
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ boxShadow: "0 8px 24px rgba(139,92,246,0.25)" }}
                        onClick={handleApply}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl
                                  bg-gradient-to-br from-violet-500 to-violet-600
                                  hover:from-violet-600 hover:to-violet-700
                                  text-white text-sm font-medium
                                  shadow-[0_4px_16px_rgba(139,92,246,0.3)]
                                  ring-1 ring-violet-400/50
                                  flex items-center justify-center gap-2
                                  transition-all"
                      >
                        <Check size={16} />
                        Apply Filters
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}