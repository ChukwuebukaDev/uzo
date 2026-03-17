"use client";

import { useEffect, useState } from "react";
import { useMapStore, Point } from "@/stores/useMapStore";
import { getAddressString } from "@/utilities/navigateToPoint";
import { MapPin } from "lucide-react";
import DialogOverlay from "@/components/ui/DialogOverlay";

type User = { id: string; name: string };

export default function PlanRoute() {
  const points = useMapStore((s) => s.points);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [note, setNote] = useState("");
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  const { closePanel } = useMapStore();

  const users: User[] = [
    { id: "u1", name: "Alice" },
    { id: "u2", name: "Bob" },
    { id: "u3", name: "Charlie" },
  ];

  const [totalDistance, setTotalDistance] = useState<number>(0);

  // Resolve address for selected point
  useEffect(() => {
    if (!selectedPoint) return;
    setTimeout(()=>setLoadingAddress(true),0)
    getAddressString(selectedPoint.lat, selectedPoint.lng).then((addr) => {
      setAddress(addr);
      setLoadingAddress(false);
    });
  }, [selectedPoint]);

  // Fake total distance
  useEffect(() => {
    if (points.length > 0)
     setTimeout(()=>setTotalDistance(points.length * 2.5),0)
  }, [points]);

  const handleAssign = () => {
    if (!selectedPoint || !assignedUser) return;
    alert(`Point "${selectedPoint.name}" assigned to ${assignedUser.name}`);
    setSelectedPoint(null);
    setNote("");
    setAssignedUser(null);
  };

  return (
    <div className="relative max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Floating Back Button */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-3
                   bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl
                   rounded-xl shadow-lg hover:bg-white/50 dark:hover:bg-zinc-900/50
                   transition text-base sm:text-lg"
      >
        ← Back
      </button>

      {/* Floating Summary Card */}
      <div className="fixed top-20 right-5 z-50 p-3 w-44 sm:w-52
                      bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl
                      border border-white/20 dark:border-zinc-700/30 rounded-2xl
                      shadow-lg flex flex-col gap-1 text-sm sm:text-base">
        <p className="text-gray-800 dark:text-white font-semibold text-base sm:text-lg">
          Summary
        </p>
        <div className="flex justify-between text-gray-700 dark:text-zinc-300">
          <span>Total Points:</span>
          <span>{points.length}</span>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-zinc-300">
          <span>Total Distance:</span>
          <span>{totalDistance.toFixed(1)} km</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 sm:mb-8">
        Plan Route
      </h1>

      {/* Points List */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex-1 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto p-4
                        bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl
                        border border-white/20 dark:border-zinc-700/30
                        rounded-2xl shadow-lg">
          {points.length === 0 && (
            <p className="text-gray-600 dark:text-zinc-400">No points available.</p>
          )}
          {points.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPoint(p)}
              className="w-full text-left p-3 mb-3 rounded-xl
                         bg-white/20 dark:bg-zinc-800/20 backdrop-blur-md
                         border border-white/10 dark:border-zinc-700/20
                         hover:bg-white/30 dark:hover:bg-zinc-800/30
                         transition flex justify-between items-center"
            >
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg line-clamp-1">
                  {p.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-300">{p.category}</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                  {`${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-zinc-400">→</span>
            </button>
          ))}
        </div>

        {/* Desktop / iPad Assign Panel */}
        <div className="hidden lg:flex flex-1 sticky top-32 p-4 sm:p-6 rounded-2xl
                        bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl
                        border border-white/20 dark:border-zinc-700/30 shadow-lg flex-col gap-3">
          {selectedPoint && (
            <>
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
                {selectedPoint.name}
              </h2>
              <p className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 text-sm sm:text-base">
                <MapPin size={16} />
                <span className="font-medium truncate">
                  {loadingAddress ? "Resolving address..." : address || "Unknown location"}
                </span>
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes or instructions"
                className="w-full p-3 rounded-xl border border-white/20 dark:border-zinc-700/30
                           bg-white/20 dark:bg-zinc-800/30 text-gray-900 dark:text-white
                           resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <select
                value={assignedUser?.id || ""}
                onChange={(e) =>
                  setAssignedUser(users.find((u) => u.id === e.target.value) || null)
                }
                className="w-full p-3 rounded-xl border border-white/20 dark:border-zinc-700/30
                           bg-white/20 dark:bg-zinc-800/30 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">Assign to...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Assign Point
              </button>
              <button
                onClick={() => setSelectedPoint(null)}
                className="w-full py-3 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-zinc-700 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile-Only Dialog Overlay */}
      {selectedPoint && (
        <div className="lg:hidden">
          <DialogOverlay open={true} onClose={() => setSelectedPoint(null)}>
            <section className="fixed inset-4 m-auto w-11/12 sm:w-96 p-4 sm:p-6
                                bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl
                                border border-white/20 dark:border-zinc-700/30
                                rounded-2xl shadow-lg flex flex-col gap-3">
              <div className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
                {selectedPoint.name}
              </div>
              <p className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 text-sm sm:text-base">
                <MapPin size={16} />
                <span className="font-medium truncate">
                  {loadingAddress ? "Resolving address..." : address || "Unknown location"}
                </span>
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes or instructions"
                className="w-full p-3 rounded-xl border border-white/20 dark:border-zinc-700/30
                           bg-white/20 dark:bg-zinc-800/30 text-gray-900 dark:text-white
                           resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <select
                value={assignedUser?.id || ""}
                onChange={(e) =>
                  setAssignedUser(users.find((u) => u.id === e.target.value) || null)
                }
                className="w-full p-3 rounded-xl border border-white/20 dark:border-zinc-700/30
                           bg-white/20 dark:bg-zinc-800/30 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">Assign to...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Assign Point
              </button>
              <button
                onClick={() => setSelectedPoint(null)}
                className="w-full py-3 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-zinc-700 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </section>
          </DialogOverlay>
        </div>
      )}

      {/* Map Preview */}
      <div className="mt-6 sm:mt-8 h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden
                      bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/20 dark:border-zinc-700/30
                      shadow-lg flex items-center justify-center text-gray-500 dark:text-zinc-400 text-base sm:text-lg">
        Map preview (interactive map coming soon)
      </div>
    </div>
  );
}