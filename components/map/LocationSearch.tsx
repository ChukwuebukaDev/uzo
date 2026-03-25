"use client";

import { useEffect, useState } from "react";

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function LocationSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery) return;

    // Check if it's coordinates
    const coordMatch = debouncedQuery.match(
      /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/
    );

    if (coordMatch) {
      const [lat, lon] = debouncedQuery.split(",");
      setResults([
        {
          display_name: `Coordinates: ${lat}, ${lon}`,
          lat: lat.trim(),
          lon: lon.trim(),
        },
      ]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${debouncedQuery}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (item: Suggestion) => {
    console.log("Selected:", item);

    // 👉 You’ll connect this to your map store
    // e.g. setOrigin({ lat: +item.lat, lng: +item.lon })

    setQuery(item.display_name);
    setResults([]);
  };

  return (
    <div className="relative w-full z-500 max-w-xl">
      {/* Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search address or coords (lat, lng)"
        className="w-full rounded-4xl p-2 absolute top-4  outline-0 border-0 bg-white/85  focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {/* Suggestions */}
      {results.length > 0 && (
        <div className="absolute mt-2 w-full bg-black/90 border border-white/10 rounded-xl max-h-64 overflow-y-auto z-50">
          {results.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm"
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="absolute right-3 top-3 text-sm text-neutral-400">
          Loading...
        </div>
      )}
    </div>
  );
}