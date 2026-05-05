"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Point } from "@/stores/useMapStore";
import { X, Database, MapPin } from "lucide-react";

interface MetaProps {
  open: boolean;
  onClose: () => void;
  point: Point | null;

  // optional but recommended for consistency with your system
  clearActiveEye?: () => void;
}

export default function MetaViewer({
  open,
  point,
  onClose,
  clearActiveEye,
}: MetaProps) {
  if (!point) return null;

  const entries = Object.entries(point.meta ?? {});

  const handleClose = () => {
    clearActiveEye?.(); // reset eye highlight in parent
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[1000] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <motion.div
                layoutId={point.id}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl my-8
                          rounded-2xl
                          bg-gradient-to-br from-white/70 via-white/60 to-white/40
                          backdrop-blur-2xl backdrop-saturate-150
                          shadow-[0_8px_32px_rgba(31,38,135,0.15)]
                          ring-1 ring-white/30 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* HEADER */}
                <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-white/20 bg-white/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2.5 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl ring-1 ring-blue-500/20">
                        <Database size={18} className="text-blue-600" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold truncate">
                          {point.name || "Unnamed point"}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin size={12} className="text-gray-500" />
                          <p className="text-xs font-mono text-gray-600">
                            {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClose}
                      className="p-2 rounded-xl bg-white/50 hover:bg-white/70 ring-1 ring-white/40"
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="px-5 sm:px-7 py-5 sm:py-6 max-h-[60vh] overflow-y-auto">
                  {entries.length === 0 ? (
                    <div className="text-center py-12">
                      <Database size={32} className="mx-auto text-gray-400/60" />
                      <p className="text-sm font-medium text-gray-700 mt-2">
                        No extra data
                      </p>
                      <p className="text-xs text-gray-500">
                        This point has no metadata
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {entries.map(([key, value], idx) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="p-4 rounded-xl bg-white/50 ring-1 ring-white/40"
                        >
                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            {key}
                          </div>
                          <div className="text-sm text-gray-900 break-words">
                            {String(value) || (
                              <span className="text-gray-400 italic">
                                Empty
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="px-5 sm:px-7 py-4 border-t border-white/20 bg-white/40">
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 rounded-xl bg-white/60 hover:bg-white/80 ring-1 ring-white/50"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}