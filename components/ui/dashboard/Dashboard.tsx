"use client";

import SummaryCard from "@/utilities/cards/SummaryCard";
import ActivityBoard from "@/utilities/cards/ActivityBoard";
import { useMapStore } from "@/stores/useMapStore";
import { MapPin, Layers, PanelLeft } from "lucide-react";

export default function Dashboard() {
  const points = useMapStore((s) => s.points);
  const panel = useMapStore((s) => s.activePanel);

  const activities = [
    {
      id: "1",
      text: `You imported ${points && points.length} Points`,
      time: new Date().toLocaleTimeString(),
    },
    {
      id: "2",
      text: "Renamed dataset to Survey A",
      time: "10 minutes ago",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Points"
          value={points.length}
          icon={<MapPin />}
          color="bg-blue-500"
        />

        <SummaryCard
          title="Dataset"
          value={"Unnamed"}
          icon={<Layers />}
          color="bg-purple-500"
        />

        <SummaryCard
          title="Active Panel"
          value={panel}
          icon={<PanelLeft />}
          color="bg-green-500"
        />
      </div>

      <ActivityBoard activities={activities} />
    </div>
  );
}
