"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onAdd: (poi: {
    id: number;
    name: string;
    description: string;
    lat: number;
    lng: number;
  }) => void;
}

export default function POIInput({ onAdd }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    const parts = text.split(",");

    if (parts.length !== 2) {
      toast.error("Enter coordinates like: lat,lng");
      return;
    }

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    toast.success(`${lat},${lng} successfully added`);
    const newPOI = {
      id: Date.now(),
      name: "Custom Location",
      description: text,
      lat,
      lng,
    };

    onAdd(newPOI);
    setText("");
  };

  return (
    <div className="absolute top-4 left-4 z-1000 bg-white p-4 rounded-lg shadow w-72">
      <textarea
        placeholder="Enter coordinates: 9.0765,7.3986"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded p-2 text-sm resize-none"
        rows={3}
      />

      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add POI
      </button>
    </div>
  );
}