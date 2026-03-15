"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ToolPanel = "none"|"dashboard" | "excel" | "input" | "save";

export type Point = {
  id: string;          // unique ID
  lat: number;
  lng: number;
  name: string;        // default "soccer"
  category?: string;   // e.g., Soccer, School, Hospital
  createdAt: number;   // timestamp
};

export type Dataset = {
  id: string;
  name: string;
  points: Point[];
  createdAt: number;
};

export interface Activity {
  id: string;
  text: string;
  time: string;
}

interface MapState {
  // Map & Dashboard State
  points: Point[];
  activePanel: ToolPanel;

  // Datasets
  datasets: Dataset[];
  activeDatasetId?: string;

  // Activity Log
  activities: Activity[];

  // Actions
  setPoints: (points: Point[]) => void;
  addPoints: (points: Point[]) => void;
  replacePoints: (points: Point[]) => void;
  clearPoints: () => void;

  openPanel: (panel: ToolPanel) => void;
  closePanel: () => void;


  // Dataset Actions
  addDataset: (dataset: Dataset) => void;
  setActiveDataset: (id: string) => void;
  renameDataset: (id: string, name: string) => void;
  deleteDataset: (id: string) => void;

  addActivity: (text: string) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      points: [],
      activePanel: "none",
      dashboardOpen: true,
      datasets: [],
      activeDatasetId: undefined,
      activities: [],

      setPoints: (points) => set({ points }),
      addPoints: (newPoints) =>
        set((state) => {
          const existing = new Set(state.points.map((p) => p.id));
          const filtered = newPoints.filter((p) => !existing.has(p.id));
          return { points: [...state.points, ...filtered] };
        }),
      replacePoints: (points) => set({ points }),
      clearPoints: () => set({ points: [] }),

      openPanel: (panel) => set({ activePanel: panel }),
      closePanel: () => set({ activePanel: "none" }),

      addDataset: (dataset) =>
        set((state) => ({
          datasets: [...state.datasets, dataset],
        })),
      setActiveDataset: (id: string) => set({ activeDatasetId: id }),
      renameDataset: (id: string, name: string) =>
        set((state) => ({
          datasets: state.datasets.map((d) =>
            d.id === id ? { ...d, name } : d
          ),
        })),
      deleteDataset: (id: string) =>
        set((state) => ({
          datasets: state.datasets.filter((d) => d.id !== id),
        })),

      addActivity: (text: string) =>
        set((state) => ({
          activities: [
            { id: crypto.randomUUID(), text, time: new Date().toLocaleTimeString() },
            ...state.activities,
          ],
        })),
    }),
    {
      name: "uzo-map-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);