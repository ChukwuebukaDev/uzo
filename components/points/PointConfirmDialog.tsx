"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import DialogOverlay from "../ui/DialogOverlay";
import { MapPin, X, Layers } from "lucide-react";
import { Point, useMapStore } from "@/stores/useMapStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import MetaViewer from "./MetaViewer";
import PointFilter from "./PointFilter";
import PointCard from "./PointCard";
import ToolBar from "./ToolBar";
interface Props {
  open: boolean;
  onClose: () => void;
  points: Point[];
  headers: string[];
  errors: string[];
  suggestedNameKey?: string;
  onAdd: (points: Point[]) => void;
  onReplace: (points: Point[]) => void;
  title?: string;
  description?: string | ReactNode;
}

export default function PointConfirmDialog({
  open,
  onClose,
  points,
  headers = [],
  errors,
  suggestedNameKey,
  onAdd,
  onReplace,
  title = "Import Points",
  description,
}: Props) {
  const { closePanel } = useMapStore();

  const [nameKey, setNameKey] = useState(
    suggestedNameKey ?? headers?.[0] ?? ""
  );

  const [list, setList] = useState<Point[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewPoint, setViewPoint] = useState<Point | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // eye state here for changing text
  const [activeEyeId, setActiveEyeId] = useState<string | null>(null);

  const applyNameKey = (pts: Point[], key: string): Point[] =>
    pts.map((p) => ({
      ...p,
      name: String(p.meta?.[key] ?? p.name ?? "Unnamed"),
    }));

  useEffect(() => {
    if (open) {
      setList(applyNameKey(points, nameKey));
    }
  }, [open, points, nameKey]);

  useEffect(() => {
    if (!suggestedNameKey && headers?.length) {
      setNameKey(headers[0]);
    }
  }, [headers, suggestedNameKey]);

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

  const duplicateIds = useMemo(() => {
    const map = new Map<string, string[]>();

    list.forEach((p) => {
      const key = `${Math.round(p.lat * 1e5)},${Math.round(p.lng * 1e5)}`;
      map.set(key, [...(map.get(key) ?? []), p.id]);
    });

    const dups = new Set<string>();
    map.forEach((ids) => {
      if (ids.length > 1) ids.forEach((id) => dups.add(id));
    });

    return dups;
  }, [list]);

  const removeDuplicates = () => {
    const seen = new Set<string>();

    setList((prev) =>
      prev.filter((p) => {
        const key = `${Math.round(p.lat * 1e5)},${Math.round(p.lng * 1e5)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
    );

    toast.success("Duplicates removed");
  };

  const deletePoint = (id: string) => {
    if (!confirm("Delete this point?")) return;
    setList((prev) => prev.filter((p) => p.id !== id));
  };

  const updateName = (id: string, name: string) => {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  return (
    <>
      <DialogOverlay open={open} onClose={onClose}>
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              />

              <div className="absolute inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl my-8 flex flex-col rounded-2xl bg-white/60 backdrop-blur-xl"
                  >
                    {/* HEADER */}
                    <div className="sticky top-0 px-6 py-5 border-b bg-white/40">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className="text-emerald-600" />
                          <div>
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <p className="text-sm text-gray-600">
                              {description ??
                                `${list.length} points • ${duplicateIds.size} duplicates`}
                            </p>
                          </div>
                        </div>

                        <button onClick={onClose}>
                          <X size={18} />
                        </button>
                      </div>

                      <div className="mt-4">
                        <ToolBar
                          search={search}
                          setSearch={setSearch}
                          headers={headers}
                          nameKey={nameKey}
                          setNameKey={setNameKey}
                          onOpenFilter={() => setFilterOpen(true)}
                        />
                      </div>
                    </div>

                    {/* LIST */}
                    <div className="p-6">
                      {filtered.length === 0 ? (
                        <div className="text-center py-10">
                          <Layers className="mx-auto text-gray-400" />
                          <p>No points found</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          {filtered.map((p) => (
                            <PointCard
                              key={p.id}
                              point={p}
                              isDuplicate={duplicateIds.has(p.id)}
                              nameKey={nameKey}
                              editingId={editingId}
                              setEditingId={setEditingId}
                              updateName={updateName}
                              deletePoint={deletePoint}
                              onView={setViewPoint}
                              eye={{
                                activeId: activeEyeId,
                                setActiveId: setActiveEyeId,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="sticky bottom-0 p-5 border-t bg-white/50 flex justify-between">
                      <span className="text-sm">
                        {filtered.length} / {list.length}
                      </span>

                      <div className="flex gap-3">
                        <button onClick={onClose}>Cancel</button>

                        <button
                          onClick={() => {
                            onReplace(list);
                            setActiveEyeId(null);
                            closePanel();
                            onClose();
                          }}
                        >
                          Replace
                        </button>

                        <button
                          onClick={() => {
                            onAdd(list);
                            setActiveEyeId(null);
                            closePanel();
                            onClose();
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </DialogOverlay>

      {/* MODALS */}
      <MetaViewer
        open={!!viewPoint}
        point={viewPoint}
        onClose={() => {
          setViewPoint(null);
          setActiveEyeId(null);
        }}
      />

      <PointFilter
        columns={headers.map((h) => ({ key: h, label: h, options: [] }))}
        filterOpen={filterOpen}
        points={list}
        onClose={() => setFilterOpen(false)}
      />
    </>
  );
}