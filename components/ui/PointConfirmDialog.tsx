"use client";

import { ReactNode, useState, useEffect, useMemo } from "react";
import DialogOverlay from "./DialogOverlay";
import { HiOutlinePlus, HiOutlineFire } from "react-icons/hi2";
import { Trash, Pen, Eye } from "lucide-react";
import { Point, useMapStore } from "@/stores/useMapStore";
import { toast } from "sonner";


interface Props {
  open: boolean;
  onClose: () => void;
  points: {
    lat: number;
    lng: number;
    name?: string;
    meta?: Record<string, unknown>;
  }[];
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
  title = "Import Points",
  description,
}: Props) {
  const { closePanel } = useMapStore();

  const normalize = (pts: Props["points"]): Point[] =>
    pts.map((p) => ({
      id: crypto.randomUUID(),
      lat: p.lat,
      lng: p.lng,
      name: p.name ?? "Unnamed",
      createdAt: Date.now(),
      meta: p.meta ?? {},
    }));

  const [list, setList] = useState<Point[]>([]);
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Meta viewer state
  const [viewPoint, setViewPoint] = useState<Point | null>(null);

  useEffect(() => {
    if (open) {
      setList(normalize(points));
      setSearch("");
      setEditingIndex(null);
    }
  }, [open, points]);

  // 🔍 Filter logic (name + meta)
  const filtered = useMemo(() => {
    if (!search.trim()) return list;

    const q = search.toLowerCase();

    return list.filter((p) => {
      if (p.name?.toLowerCase().includes(q)) return true;

      return Object.values(p.meta ?? {}).some((v) =>
        String(v).toLowerCase().includes(q)
      );
    });
  }, [list, search]);

  // Duplicate detection
  const duplicateIndexes = useMemo(() => {
    const map = new Map<string, number[]>();

    list.forEach((p, i) => {
      const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
      const arr = map.get(key) ?? [];
      arr.push(i);
      map.set(key, arr);
    });

    const dup = new Set<number>();
    for (const indexes of map.values()) {
      if (indexes.length > 1) indexes.forEach((i) => dup.add(i));
    }

    return dup;
  }, [list]);

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

  const deletePoint = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const updateName = (i: number, name: string) =>
    setList((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, name } : p))
    );

  return (
    <>
      <DialogOverlay open={open} onClose={onClose}>
        <div className="w-full h-full sm:h-auto sm:max-w-xl bg-white sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-4 overflow-hidden">

          {/* Header */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">
              {description ?? `${list.length} points ready`}
            </p>
          </div>

          {/* Search */}
          <input
            placeholder="Search by name or data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />

          {/* Duplicate warning */}
          {duplicateIndexes.size > 0 && (
            <div className="text-red-600 text-sm">
              {duplicateIndexes.size} duplicates detected
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="bg-gray-100 p-3 rounded-lg flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">

                  {/* Name */}
                  {editingIndex === i ? (
                    <input
                      autoFocus
                      value={p.name ?? ""}
                      onChange={(e) =>
                        updateName(i, e.target.value)
                      }
                      onBlur={() => setEditingIndex(null)}
                      className="border px-2 py-1 text-sm rounded"
                    />
                  ) : (
                    <span className="font-medium text-sm">
                      {p.name}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => setEditingIndex(i)}>
                      <Pen size={16} />
                    </button>

                    <button onClick={() => setViewPoint(p)}>
                      <Eye size={16} />
                    </button>

                    <button onClick={() => deletePoint(i)}>
                      <Trash size={16} color="red" />
                    </button>
                  </div>
                </div>

                <span className="text-xs text-gray-600">
                  {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                </span>

                {/* Meta preview */}
                {Object.keys(p.meta ?? {}).length > 0 && (
                  <span className="text-xs text-gray-500">
                    {Object.entries(p.meta)
                      .slice(0, 2)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" • ")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2">

            {duplicateIndexes.size > 0 && (
              <button
                onClick={removeDuplicates}
                className="bg-blue-500 text-white py-2 rounded-lg"
              >
                Remove Duplicates
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-gray-200 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onAdd(list);
                toast.success("Added successfully");
                closePanel();
                onClose();
              }}
              className="bg-amber-500 text-white py-2 rounded-lg flex items-center justify-center gap-1"
            >
              <HiOutlinePlus /> Add
            </button>

            <button
              onClick={() => {
                onReplace(list);
                toast.success("Replaced successfully");
                closePanel();
                onClose();
              }}
              className="bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-1"
            >
              <HiOutlineFire /> Replace
            </button>
          </div>
        </div>
      </DialogOverlay>

      {/* Meta Viewer */}
      <MetaViewer
        open={!!viewPoint}
        point={viewPoint}
        onClose={() => setViewPoint(null)}
      />
    </>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  point: Point | null;
}


function MetaViewer({ open, onClose, point }: Props) {
  if (!open || !point) return null;

  const entries = Object.entries(point.meta ?? {});

  return (
    <div className="fixed inset-0 z-999 bg-black/40 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl p-4 max-h-[80vh] overflow-y-auto">

        <h3 className="text-lg font-semibold mb-3">
          {point.name} - Details
        </h3>

        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">No extra data</p>
        ) : (
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="p-2 font-medium bg-gray-50">{key}</td>
                  <td className="p-2">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-200 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}