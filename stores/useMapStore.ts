"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ----------------- TYPES -----------------
export type ToolPanel = "none" | "dashboard" | "excel" | "input" | "save";

export type Point = {
  id: string;
  lat: number;
  lng: number;
  description?: string;
  name: string;
  category?: string;
  createdAt: number;
   meta: Record<string, unknown>;
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

// ----------------- STORE -----------------
interface MapState {
  // Core
  points: Point[];
  mapCenter: [number, number];
  zoom: number;

  // UI
  activePanel: ToolPanel;

  // Routing
  userLocation: { lng: number; lat: number } | null;
  selectedPointId: string | null;

  // Data
  datasets: Dataset[];
  activeDatasetId?: string;

  // Activity log
  activities: Activity[];

  // ----------------- ACTIONS -----------------
  setUserLocation: (loc: { lng: number; lat: number }) => void;

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

  // ----------------- DERIVED HELPERS -----------------
  setSelectedPoint: (id: string | null) => void;
  getSelectedPoint: () => Point | null;
  getNearestPoint: () => Point | null;
}

// ----------------- STORE IMPLEMENTATION -----------------
export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      // ----------------- STATE -----------------
      points: [],
      mapCenter: [6.4475, 3.5236],
      zoom: 12,
      activePanel: "none",

      userLocation: null,
      selectedPointId: null,

      datasets: [],
      activeDatasetId: undefined,

      activities: [],

      // ----------------- ACTIONS -----------------
      setUserLocation: (loc) =>
        set((state) => ({
          userLocation: loc,
          activities: [
            {
              id: crypto.randomUUID(),
              text: "User location updated",
              time: new Date().toLocaleTimeString(),
            },
            ...state.activities,
          ],
        })),

      setPoints: (points) => set({ points }),

      addPoints: (newPoints) =>
        set((state) => {
          const existing = new Set(state.points.map((p) => p.id));
          const filtered = newPoints.filter((p) => !existing.has(p.id));
          return { points: [...state.points, ...filtered] };
        }),

      replacePoints: (points) => set({ points }),

      clearPoints: () => set({ points: [] }),

      setMapView: (center, zoom) => set({ mapCenter: center, zoom }),

      openPanel: (panel) => set({ activePanel: panel }),

      closePanel: () => set({ activePanel: "none" }),

      addDataset: (dataset) =>
        set((state) => ({
          datasets: [...state.datasets, dataset],
        })),

      setActiveDataset: (id) => set({ activeDatasetId: id }),

      renameDataset: (id, name) =>
        set((state) => ({
          datasets: state.datasets.map((d) =>
            d.id === id ? { ...d, name } : d,
          ),
        })),

      deleteDataset: (id) =>
        set((state) => ({
          datasets: state.datasets.filter((d) => d.id !== id),
        })),

      addActivity: (text) =>
        set((state) => ({
          activities: [
            {
              id: crypto.randomUUID(),
              text,
              time: new Date().toLocaleTimeString(),
            },
            ...state.activities,
          ],
        })),

      // ----------------- ROUTING HELPERS -----------------
      setSelectedPoint: (id) => set({ selectedPointId: id }),

      getSelectedPoint: () => {
        const { points, selectedPointId } = get();
        return points.find((p) => p.id === selectedPointId) || null;
      },

      getNearestPoint: () => {
        const { points, userLocation } = get();
        if (!userLocation || points.length === 0) return null;

        let nearest = points[0];
        let minDist = Infinity;

        for (const p of points) {
          const dist =
            (p.lng - userLocation.lng) ** 2 + (p.lat - userLocation.lat) ** 2;

          if (dist < minDist) {
            minDist = dist;
            nearest = p;
          }
        }

        return nearest;
      },
    }),
    {
      name: "uzo-map-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
