import MapHeader from "@/components/map/UI/MapHeader";
import MapFooter from "@/components/map/UI/MapFooter";
import { Toaster } from "sonner";
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-auto">
      <Toaster richColors position="top-center" />
      <MapHeader />
      <main className="flex-1 relative">{children}</main>
      <MapFooter />
    </div>
  );
}
