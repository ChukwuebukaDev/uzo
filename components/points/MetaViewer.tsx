import { AnimatePresence, motion } from "framer-motion";
import { Point } from "@/stores/useMapStore";
interface MetaProps {
  open: boolean;
  onClose: () => void;
  point: Point | null;
}


export default function MetaViewer({ open, point, onClose }: MetaProps) {
  if (!point) return null;

  const entries = Object.entries(point.meta ?? {});

  return (
    <AnimatePresence>
      {open && (
        // Overlay background
        <motion.div
          className="fixed inset-0 z-999 bg-black/40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal content */}
          <motion.div
            layoutId={point.id} // makes it animate from the clicked row
            className="w-full max-w-lg bg-white rounded-2xl p-4 max-h-[80vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <h3 className="text-lg font-semibold mb-3">{point.name} - Details</h3>

            {/* Meta Table */}
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

            {/* Close Button */}
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}