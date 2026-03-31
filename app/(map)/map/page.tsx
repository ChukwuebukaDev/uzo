import DisplayMapPage from "@/components/map/UI/DisplayMapPage";
import CurtainLoader from "@/utilities/entrance/CurtainLoader";
import { Suspense } from "react";
export default function MapPage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <CurtainLoader>
        <DisplayMapPage />
      </CurtainLoader>
    </Suspense>
  );
}
