"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMapStore, Point } from "@/stores/useMapStore";
import { getAddressString } from "@/utilities/navigateToPoint";
import { MapPin, Calendar, Trash2, Edit2 } from "lucide-react";
import { mapProps } from "@/types/map";
import { Suspense } from "react";
import MapContainer from "@/components/map/MapContainer";
import { Marker } from "@/components/map/leaflet/leaflet";
import { useIconStore } from "@/stores/useIconStore";
interface PointPageProps {
  params: Promise<{ id: string }>;
}


export default function PointPage({ params }: PointPageProps) {
  const router = useRouter();
  const points = useMapStore((s) => s.points);
  const replacePoints = useMapStore(s => s.replacePoints);
  const [point, setPoint] = useState<Point | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const icons = useIconStore((s) => s.icons);


const position: [number, number] | null = point
  ? [point.lat, point.lng]
  : null;
  const mapProperties: mapProps = {
    zoom:6,
    center:position ?? [11.971781,8.565484],
    zoomControl: false,
    scrollWheelZoom: false,
    maxZoom: 18,
    searchControl:false
  };

  const handleDelete = (n:string)=>{
    const point = points.filter(p => p.name !== n);
     replacePoints(point);
              router.back();
  }

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      const found = points.find((p) => p.id === resolvedParams.id);
      setPoint(found ?? null);
      
      if (found) {
        setLoadingAddress(true);
        const addr = await getAddressString(found.lat, found.lng);
        setAddress(addr);
        setLoadingAddress(false);
      }
    })();
  }, [params, points]);
if (!icons) return null;
  if (!point)
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-zinc-400 px-4">
        Point not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
    <button
  onClick={() => router.back()}
  className="
    fixed top-12 left-5
    z-50
    flex items-center gap-2
    px-4 py-3
    text-gray-800 dark:text-white
    underline
    transition
    text-base
    touch-manipulation
  "
>
  &larr; Back
</button>

      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          {point.name}
        </h1>
        {point.category && (
          <span className="inline-block mt-2 px-4 py-1 rounded-full bg-blue-600/20 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 text-sm font-medium">
            {point.category}
          </span>
        )}
      </header>

      {/* Description */}
      {point.description && (
        <p className="mb-6 text-gray-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed">
          {point.description}
        </p>
      )}

      {/* Details Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-lg p-6">
        {/* Coordinates & Address */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 dark:text-zinc-300">
            <MapPin size={18} />
            <span className="font-medium">Location:</span>
            <span className="truncate">
              {loadingAddress
                ? "Resolving address..."
                : address ?? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 dark:text-zinc-300">
            <Calendar size={18} />
            <span className="font-medium">Added:</span>
            <span>{new Date(point.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-4 sm:mt-0">
          <button onClick={()=> handleDelete(point.name)} className="flex items-center justify-center gap-2 px-5 py-3 text-base bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-full sm:w-auto">
            <Trash2 size={18} />
            Delete
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-3 text-base bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition w-full sm:w-auto">
            <Edit2 size={18} />
            Edit
          </button>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="mt-8 h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg">
        {/* Leaflet/Mapbox map can go here */}
        <div className="w-full relative h-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 text-lg">
         

          <Suspense fallback = {<div className="text-6xl z-500">Map Loading...</div>}>
<MapContainer properties={mapProperties}>
{position && (
  <Marker position={position} icon={icons.defaultIcon}/>
)}
</MapContainer>
          </Suspense>
        </div>
      </section>
    </div>
  );
}