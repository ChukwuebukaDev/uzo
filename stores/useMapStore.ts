import { Coordinates } from "@/types/routes";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ToolPanel = "none" | "excel" | "input" | "save";

interface MapState {
  points: Coordinates[];

  activePanel: ToolPanel;

  setPoints: (points: Coordinates[]) => void;
  addPoints: (points: Coordinates[]) => void;
  clearPoints: () => void;

  openPanel: (panel: ToolPanel) => void;
  closePanel: () => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      points: [],

      activePanel: "none",

      setPoints: (points) => set({ points }),

      addPoints: (newPoints) =>
        set((state) => {
          const existing = new Set(
            state.points.map((p) => `${p.lat},${p.lng}`),
          );

          const filtered = newPoints.filter(
            (p) => !existing.has(`${p.lat},${p.lng}`),
          );

          return {
            points: [...state.points, ...filtered],
          };
        }),

      clearPoints: () => set({ points: [] }),

      openPanel: (panel) =>
        set({
          activePanel: panel,
        }),

      closePanel: () =>
        set({
          activePanel: "none",
        }),
    }),
    {
      name: "uzo-map-storage",

      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
