"use client";

import { AlertTriangle, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  errorCount: number;
  duplicateCount: number;
  onRemoveDuplicates: () => void;
}

export default function Alerts({
  errorCount,
  duplicateCount,
  onRemoveDuplicates,
}: Props) {
  if (errorCount === 0 && duplicateCount === 0) return null;

  return (
    <div className="space-y-2.5">
      <AnimatePresence mode="popLayout">
        {errorCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-3.5 sm:p-4 rounded-xl
                      bg-gradient-to-br from-amber-500/10 to-orange-500/10
                      backdrop-blur-md ring-1 ring-amber-400/30
                      shadow-[0_4px_12px_rgba(245,158,11,0.08)]
                      flex items-start gap-3"
          >
            <div className="p-1.5 bg-amber-500/20 rounded-lg backdrop-blur-sm
                           ring-1 ring-amber-400/30 shrink-0">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-900">
                {errorCount} {errorCount === 1 ? "row" : "rows"} skipped
              </p>
              <p className="text-xs text-amber-700/80 mt-0.5">
                Invalid coordinates or missing required fields
              </p>
            </div>
          </motion.div>
        )}

        {duplicateCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-3.5 sm:p-4 rounded-xl
                      bg-gradient-to-br from-red-500/10 to-rose-500/10
                      backdrop-blur-md ring-1 ring-red-400/30
                      shadow-[0_4px_12px_rgba(239,68,68,0.08)]
                      flex items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-1.5 bg-red-500/20 rounded-lg backdrop-blur-sm
                             ring-1 ring-red-400/30 shrink-0">
                <Copy size={16} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-900">
                  {duplicateCount} {duplicateCount === 1 ? "duplicate" : "duplicates"} found
                </p>
                <p className="text-xs text-red-700/80 mt-0.5">
                  Points with matching coordinates
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onRemoveDuplicates}
              className="px-3.5 py-2 rounded-lg
                        bg-gradient-to-br from-red-500 to-red-600
                        hover:from-red-600 hover:to-red-700
                        text-white text-xs sm:text-sm font-medium
                        shadow-[0_4px_12px_rgba(239,68,68,0.25)]
                        ring-1 ring-red-400/50
                        flex items-center gap-1.5
                        transition-all duration-200 shrink-0"
            >
              <X size={14} />
              <span className="hidden sm:inline">Remove</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}