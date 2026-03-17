"use client";

import Link from "next/link";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { navigateToPoint } from "@/utilities/navigateToPoint";
import { getAddressString } from "@/utilities/navigateToPoint";

export type MarkerCardProps = {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category?: string;
};

export type Navigate = {
  lat: number;
  lng: number;
  travelMode: string;
};

export default function MarkerCard({
  id,
  name,
  description,
  lat,
  lng,
  category,
}: MarkerCardProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const point: Navigate = {
    lat,
    lng,
    travelMode: "driving",
  };

  // 🔥 Fetch address on mount or when coords change
  useEffect(() => {
    let active = true;

    async function loadAddress() {
      setLoading(true);

      const addr = await getAddressString(lat, lng);

      if (active) {
        setAddress(addr);
        setLoading(false);
      }
    }

    loadAddress();

    return () => {
      active = false;
    };
  }, [lat, lng]);

  return (
    <div
      className="
        w-[320px] max-w-full
        relative overflow-hidden
        rounded-2xl
        bg-white/90 dark:bg-zinc-900/90
        backdrop-blur-xl
        border border-white/40 dark:border-zinc-700/60
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        p-4
        flex flex-col gap-3
        transition-all duration-300
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)]
      "
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />

      {/* Title + Category */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {name}
        </h3>

        {category && (
          <span
            className="
              shrink-0
              px-2.5 py-1
              text-xs font-medium
              rounded-full
              bg-blue-600/10 text-blue-700
              dark:bg-blue-500/20 dark:text-blue-300
            "
          >
            {category}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-zinc-300 line-clamp-3">
          {description}
        </p>
      )}

      {/* 📍 Address chip */}
      <div
        className="
          inline-flex items-center gap-2
          self-start
          text-xs
          px-2.5 py-1.5
          rounded-lg
          bg-gray-100 dark:bg-zinc-800
          text-gray-600 dark:text-zinc-300
          max-w-full
        "
      >
        <MapPin size={14} />

        {loading
          ? "Resolving address..."
          : address ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-2">
        {/* View Details */}
        <Link
          href={`/map/${id}`}
          className="
            group flex-1
            inline-flex items-center justify-center gap-2
            rounded-xl
            bg-linear-to-r from-blue-600 to-cyan-500
            text-white
            px-4 py-2.5
            text-sm font-medium
            shadow-md
            transition-all duration-200
            hover:shadow-lg hover:brightness-110
            active:scale-[0.97]
          "
        >
          View Details
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        {/* Navigate */}
        <button
          className="
            inline-flex items-center justify-center
            rounded-xl
            bg-gray-100 dark:bg-zinc-800
            p-2.5
            text-gray-700 dark:text-zinc-200
            transition
            hover:bg-gray-200 dark:hover:bg-zinc-700
            active:scale-[0.95]
          "
          title="Navigate"
          onClick={() => navigateToPoint(point)}
        >
          <Compass size={18} />
        </button>
      </div>
    </div>
  );
}