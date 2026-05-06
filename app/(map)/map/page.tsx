import DisplayMapPage from "@/components/map/UI/DisplayMapPage";
import { Suspense } from "react";
export default function MapPage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
        <DisplayMapPage />
    </Suspense>
  );
}
