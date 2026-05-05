import MapHeader from "@/components/map/UI/MapHeader";
import MapFooter from "@/components/map/UI/MapFooter";
import { Toaster } from "sonner";
import {Inter} from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-auto">
      <Toaster richColors position="top-center" />
      <MapHeader />
      <main className={`flex-1 relative ${inter.className}`}>{children}</main>
      <MapFooter />
    </div>
  );
}
