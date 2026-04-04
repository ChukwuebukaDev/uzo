"use client";

import { useState } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { Button } from "@/components/ui/Button";
import PointConfirmDialog from "@/components/points/PointConfirmDialog";

type Mode = "single" | "multiple";

export default function CoordinateInput() {
  const [mode, setMode] = useState<Mode>("multiple");
  const [text, setText] = useState("");
  const [single, setSingle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedPoints, setUploadedPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [warning, setWarning] = useState(""); 

  const { addPoints, setPoints, clearPoints } = useMapStore();

  
  function parseMultiple() {
    const lines = text.split("\n");
    const parsed = lines
      .map((line) => {
        const [lat, lng] = line.split(",").map(Number);
        if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
        return null;
      })
      .filter(Boolean) as { lat: number; lng: number }[];

    if (parsed.length) {
      setUploadedPoints(parsed);
      setDialogOpen(true);
      setWarning("");
    } else {
      setWarning("Please enter at least one valid coordinate.😉");
    }
  }

  function parseSingle() {
    const [lat, lng] = single.split(",").map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setUploadedPoints([{ lat, lng }]);
      setDialogOpen(true);
      setSingle("");
      setWarning("");
    } else {
      setWarning("Please enter a valid coordinate (lat,lng).👌");
    }
  }

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 w-[92vw] max-w-md">

    
      <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 p-4">

       
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Add Coordinates</h3>
          <button
            onClick={() => setMode((m) => (m === "single" ? "multiple" : "single"))}
            className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition"
          >
            {mode === "single" ? "Multi" : "Single"}
          </button>
        </div>

        
        {mode === "multiple" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`lat, lng per line
9.082, 8.6753
6.5244, 3.3792`}
            rows={6}
            className="w-full rounded-xl p-3 text-sm resize-none focus:ring-2 focus:outline-none bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-amber-500 transition-all duration-300"
          />
        ) : (
          <input
            value={single}
            onChange={(e) => setSingle(e.target.value)}
            placeholder="lat, lng"
            className="w-full rounded-xl p-3 text-sm focus:ring-2 focus:outline-none bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-amber-500 transition-all duration-300"
          />
        )}

       
        {warning && (
          <p className="text-red-600 text-xs mt-1 animate-pulse">
            {warning}
          </p>
        )}

      
        <div className="flex gap-2 mt-4">
          <Button onClick={mode === "multiple" ? parseMultiple : parseSingle}>
            Add
          </Button>
          <Button variant="danger" onClick={clearPoints}>
            Clear
          </Button>
        </div>
      </div>

      
      <PointConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        points={uploadedPoints}
        onAdd={addPoints}
        onReplace={setPoints}
      />
    </div>
  );
}