"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import DialogOverlay from "../ui/DialogOverlay";
import { HiOutlinePlus, HiOutlineFire } from "react-icons/hi2";
import { Trash, Pen, Eye } from "lucide-react";
import { Point, useMapStore } from "@/stores/useMapStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import MetaViewer from "./MetaViewer";
import PointFilter from "./PointFilter";
interface Props {
  open: boolean;
  onClose: () => void;
  points: { lat: number; lng: number; name?: string; meta?: Record<string, unknown> }[];
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
  const [viewPoint, setViewPoint] = useState<Point | null>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  useEffect(() => {
    if (open) {
      setList(normalize(points));
      setSearch("");
      setEditingIndex(null);
    }
  }, [open, points]);

  
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

  /**
   * Detect duplicates
   */
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
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="
                w-[95vw] max-w-2xl 
                bg-white 
                rounded-2xl 
                p-4 sm:p-6 
                flex flex-col gap-4 
                max-h-[90vh] 
                overflow-hidden
                shadow-2xl
              "
            >
              {/* HEADER */}
              
              <div className="flex justify-between items-center">
               <div>
                 <h3 className="text-lg sm:text-xl font-semibold">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {description ?? `${list.length} points ready for import`}
                </p>

               </div>
                <button onClick={()=>setFilterOpen(p => !p)} className="dark:bg-white/75  bg-black/35 px-3 py-1 text-gray-200  hover:bg-black/55 transition-all duration-500 rounded-3xl">Filter Points</button>
              </div>

              {/* SEARCH */}
              <input
                placeholder="Search by name or metadata..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              {/* DUPLICATES */}
              {duplicateIndexes.size > 0 && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                  ⚠️ {duplicateIndexes.size} duplicate point
                  {duplicateIndexes.size > 1 ? "s" : ""} detected
                </div>
              )}

              {/* LIST */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layoutId={p.id} // 🔥 row → modal animation
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      p-3 rounded-xl border flex flex-col gap-2 
                      cursor-pointer transition
                      ${
                        duplicateIndexes.has(i)
                          ? "bg-red-50 border-red-300"
                          : "bg-gray-100 hover:bg-gray-200"
                      }
                    `}
                  >
                    {/* TOP ROW */}
                    <div className="flex justify-between items-center gap-2">
                      
                      {/* NAME */}
                      {editingIndex === i ? (
                        <input
                          autoFocus
                          value={p.name ?? ""}
                          onChange={(e) => updateName(i, e.target.value)}
                          onBlur={() => setEditingIndex(null)}
                          className="border px-2 py-1 text-sm rounded w-full"
                        />
                      ) : (
                        <span className="font-medium text-sm truncate">
                          {p.name}
                        </span>
                      )}

                      {/* ACTIONS */}
                      <div className="flex gap-2 shrink-0">
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

                    {/* COORDINATES */}
                    <span className="text-xs text-gray-600">
                      {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                    </span>

                    {/* META PREVIEW */}
                    {Object.keys(p.meta ?? {}).length > 0 && (
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {Object.entries(p.meta)
                          .slice(0, 2)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" • ")}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">

                {duplicateIndexes.size > 0 && (
                  <button
                    onClick={removeDuplicates}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  >
                    Remove Duplicates
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="bg-gray-200 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    onAdd(list);
                    toast.success("Points added successfully");
                    closePanel();
                    onClose();
                  }}
                  className="bg-amber-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-1"
                >
                  <HiOutlinePlus />
                  Add
                </button>

                <button
                  onClick={() => {
                    onReplace(list);
                    toast.success("Points replaced successfully");
                    closePanel();
                    onClose();
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-1"
                >
                  <HiOutlineFire />
                  Replace
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogOverlay>

      {/* META VIEWER MODAL */}
      <MetaViewer
        open={!!viewPoint}
        point={viewPoint}
        onClose={() => setViewPoint(null)}
      />
      {/* FILTER */}
      <PointFilter columns={[
    {
      key: "status",
      label: "Status",
      options: ["Active", "Inactive", "Pending"],
    },
    {
      key: "category",
      label: "Category",
      options: ["A", "B", "C"],
    },
    {
      key: "type",
      label: "Type",
      options: ["Road", "Water", "Land"],
    },
  ]} filterOpen={filterOpen} points={points} onClose={()=>setFilterOpen(false)}/>
    </>
  );
}
