"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export type ToolPanel = "none"|"dashboard" | "excel" | "input" | "save";

export type Point = {
  id: string;          
  lat: number;
  lng: number;
  description?:string,
  name: string;       
  category?: string;   
  createdAt: number;  
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
  points: Point[];
  mapCenter:[number,number];
  zoom:number;
  activePanel: ToolPanel;
 
  datasets: Dataset[];
  activeDatasetId?: string;


  activities: Activity[];

  // Actions
  setPoints: (points: Point[]) => void;
  addPoints: (points: Point[]) => void;
  replacePoints: (points: Point[]) => void;
  clearPoints: () => void;
setMapView: (center: [number, number], zoom: number) => void;
  openPanel: (panel: ToolPanel) => void;
  closePanel: () => void;
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
      mapCenter:[6.4475, 3.5236],
      zoom:12,
      activePanel: "none",
      dashboardOpen: true,
      datasets: [],
      activeDatasetId: undefined,
      activities: [],
      fitBounds:undefined,
      setMapView: (center, zoom) =>
  set({ mapCenter: center, zoom }),
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
      storage: createJSONStorage(() => localStorage),
    }
  )
);