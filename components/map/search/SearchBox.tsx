"use client";

import { SearchBox } from "@mapbox/search-js-react";
import { useMapStore } from "@/stores/useMapStore";

export default function MapSearch() {
  const {addPoints} = useMapStore();

  return (
    <div className="absolute top-4 left-4 z-10 w-80">
      <SearchBox
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        placeholder="Search location..."
        onRetrieve={(res) => {
          const feature = res.features[0];
          if (!feature) return;

          
          const [lng, lat] = feature.geometry.coordinates;
            addPoints([{ id: crypto.randomUUID(), lat, lng,name: feature.properties?.name, createdAt: Date.now(), meta: feature.properties }]);
         
        }}
      />
    </div>
  );
}