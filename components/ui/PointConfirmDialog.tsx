"use client";

import { ReactNode, useState, useEffect } from "react";
import DialogOverlay from "./DialogOverlay";
import { HiOutlinePlus, HiOutlineFire } from "react-icons/hi2";
import { Trash, Pen } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  points: { lat: number; lng: number }[];
  onAdd: (points: { lat: number; lng: number }[]) => void;
  onReplace: (points: { lat: number; lng: number }[]) => void;
  title?: string;
  description?: string | ReactNode;
}

export default function PointConfirmDialog({
  open,
  onClose,
  points,
  onAdd,
  onReplace,
  title = "Add or Replace Points?",
  description,
}: Props) {
  const [newPointList, setNewPointList] = useState(points);

  useEffect(() => {
    setNewPointList(points);
  }, [points]);

  const handlePointDelete = (index: number) => {
    setNewPointList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DialogOverlay open={open} onClose={onClose}>
      <div className="relative z-10 w-[90vw] max-w-lg bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 fade-in-0">
        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {description ??
            `You have uploaded ${newPointList.length} point${
              newPointList.length > 1 ? "s" : ""
            }. Do you want to add them to the map or replace existing points?`}
        </p>

        {/* Optional Preview */}
        {newPointList.length > 0 && (
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-lg p-3 text-gray-800 text-sm flex flex-col gap-1 max-h-36 overflow-y-auto">
            <strong>Preview of points:</strong>
            {newPointList.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded-md"
              >
                <span>
                  {i + 1}. {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePointDelete(i)}
                    className="hover:bg-red-100 p-1 rounded-full transition"
                  >
                    <Trash size={16} color="red" />
                  </button>
                  <button className="hover:bg-gray-200 p-1 rounded-full transition">
                    <Pen size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium transition-all duration-200"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onAdd(newPointList);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-1 transition-all duration-200"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add to Map
          </button>

          <button
            onClick={() => {
              onReplace(newPointList);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-1 transition-all duration-200"
          >
            <HiOutlineFire className="w-5 h-5" />
            Replace Map
          </button>
        </div>
      </div>
    </DialogOverlay>
  );
}