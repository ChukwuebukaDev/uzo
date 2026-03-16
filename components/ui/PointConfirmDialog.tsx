"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import DialogOverlay from "./DialogOverlay";
import { HiOutlinePlus, HiOutlineFire } from "react-icons/hi2";
import { Trash, Pen } from "lucide-react";
import { Point } from "@/stores/useMapStore";

interface Props {
  open: boolean;
  onClose: () => void;
  points: { lat: number; lng: number; name?: string }[];
  onAdd: (points: Point[]) => void;
  onReplace: (points: Point[]) => void;
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

  /* -------------------------------------------------- */
  /* 🔹 Normalize imported points → Store points */
  /* -------------------------------------------------- */

  const normalize = (pts: Props["points"]): Point[] =>
    pts.map((p) => ({
      id: crypto.randomUUID(),
      lat: p.lat,
      lng: p.lng,
      name: p.name ?? "Unnamed",
      createdAt: Date.now(),
    }));

  const [list, setList] = useState<Point[]>(() => normalize(points));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setTimeout(()=>{
           setList(normalize(points));
      setEditingIndex(null);
      },0)
   
    }
    wasOpen.current = open;
  }, [open, points]);



  const findDuplicates = (pts: Point[]) => {
    const map = new Map<string, number[]>();

    pts.forEach((p, i) => {
      const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
      const arr = map.get(key) ?? [];
      arr.push(i);
      map.set(key, arr);
    });

    const dup = new Set<number>();

    for (const indexes of map.values()) {
      if (indexes.length > 1) {
        indexes.forEach((i) => dup.add(i));
      }
    }

    return dup;
  };

  const duplicateIndexes = findDuplicates(list);

  const removeDuplicates = () => {
    const seen = new Set<string>();

    setList((prev) =>
      prev.filter((p) => {
        const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
    );
  };

  /* -------------------------------------------------- */
  /* 🔹 Editing & Deleting */
  /* -------------------------------------------------- */

  const deletePoint = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const updateName = (i: number, name: string) =>
    setList((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, name } : p))
    );

  /* -------------------------------------------------- */
  /* 🔹 UI */
  /* -------------------------------------------------- */

  return (
    <DialogOverlay open={open} onClose={onClose}>
      <div className="relative z-10 w-[90vw] max-w-lg bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 flex flex-col gap-5">

        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-700 text-sm">
          {description ??
            `You uploaded ${list.length} point${
              list.length > 1 ? "s" : ""
            }. Add or replace existing points?`}
        </p>

        {/* Duplicate Warning */}
        {duplicateIndexes.size > 0 && (
          <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-300">
            ⚠️ {duplicateIndexes.size} duplicate point
            {duplicateIndexes.size > 1 ? "s" : ""} detected
          </div>
        )}

        {/* Preview List */}
        {list.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-3 text-sm flex flex-col gap-2 max-h-56 overflow-y-auto">

            <strong>Points:</strong>

            {list.map((p, i) => (
              <div
                key={p.id}
                className={`flex justify-between items-center gap-2 px-2 py-1 rounded-md
                  ${
                    duplicateIndexes.has(i)
                      ? "bg-red-100 border border-red-400"
                      : "hover:bg-gray-200"
                  }`}
              >
                {/* LEFT */}
                <div className="flex flex-col flex-1">

                  {editingIndex === i ? (
                    <input
                      autoFocus
                      value={p.name ?? ""}
                      onChange={(e) =>
                        updateName(i, e.target.value)
                      }
                      onBlur={() => setEditingIndex(null)}
                      className="px-2 py-1 rounded border text-sm"
                    />
                  ) : (
                    <span className="font-medium">
                      {i + 1}. {p.name}
                    </span>
                  )}

                  <span className="text-xs text-gray-600">
                    {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                  </span>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingIndex(i)}
                    className="hover:bg-gray-300 p-1 rounded-full"
                  >
                    <Pen size={16} />
                  </button>

                  <button
                    onClick={() => deletePoint(i)}
                    className="hover:bg-red-100 p-1 rounded-full"
                  >
                    <Trash size={16} color="red" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mt-2">

          {duplicateIndexes.size > 0 && (
            <button
              onClick={removeDuplicates}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Remove Duplicates
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onAdd(list);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add to Map
          </button>

          <button
            onClick={() => {
              onReplace(list);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
          >
            <HiOutlineFire className="w-5 h-5" />
            Replace Map
          </button>

        </div>
      </div>
    </DialogOverlay>
  );
}