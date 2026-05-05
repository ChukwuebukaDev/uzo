"use client";

import { Pencil, Trash2, Eye, MapPin } from "lucide-react";
import { Point } from "@/stores/useMapStore";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  point: Point;
  isDuplicate: boolean;
  nameKey: string;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updateName: (id: string, name: string) => void;
  deletePoint: (id: string) => void;
  onView: (p: Point) => void;

  eye: {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
  };
}

export default function PointCard({
  point,
  isDuplicate,
  nameKey,
  editingId,
  setEditingId,
  updateName,
  deletePoint,
  onView,
  eye,
}: Props) {
  const [localName, setLocalName] = useState(point.name ?? "");

  const metaKeys = Object.keys(point.meta ?? {}).filter(
    (k) => k !== nameKey
  );

  const isActive = eye.activeId === point.id;

  const handleSave = () => {
    if (localName.trim() !== point.name) {
      updateName(point.id, localName.trim());
    }
    setEditingId(null);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative p-4 sm:p-5 rounded-2xl
        backdrop-blur-md backdrop-saturate-150
        ring-1 transition-all duration-200
        ${
          isDuplicate
            ? "bg-red-500/10 ring-red-400/40"
            : "bg-white/50 ring-white/40 hover:bg-white/60"
        }`}
    >
      {/* Duplicate badge */}
      {isDuplicate && (
        <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium">
          Duplicate
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* NAME */}
          {editingId === point.id ? (
            <input
              autoFocus
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setLocalName(point.name ?? "");
                  setEditingId(null);
                }
              }}
              className="w-full bg-white/70 px-2.5 py-1.5 rounded-lg text-sm font-semibold"
            />
          ) : (
            <h4 className="font-semibold text-sm sm:text-base truncate">
              {point.name || "Unnamed point"}
            </h4>
          )}

          {/* COORDS */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin size={12} className="text-gray-400" />
            <p className="text-xs text-gray-500 font-mono">
              {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100">
          {/* EDIT */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditingId(point.id)}
            className="p-1.5 rounded-lg bg-white/60 text-gray-600 hover:text-emerald-600"
          >
            <Pencil size={14} />
          </motion.button>

          {/* VIEW / EYE */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              onView(point);
              eye.setActiveId(point.id);
            }}
            className={`p-1.5 rounded-lg bg-white/60 transition-all ${
              isActive ? "text-blue-600" : "text-gray-600"
            } hover:text-blue-600`}
          >
            <Eye size={14} />
          </motion.button>

          {/* DELETE */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => deletePoint(point.id)}
            className="p-1.5 rounded-lg bg-white/60 text-gray-600 hover:text-red-600"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>

      {/* META */}
      {metaKeys.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {metaKeys.slice(0, 3).map((k) => (
            <span
              key={k}
              className="text-xs bg-white/60 px-2 py-1 rounded-lg"
            >
              <span className="text-gray-500">{k}:</span>{" "}
              {String(point.meta?.[k]).slice(0, 18)}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}