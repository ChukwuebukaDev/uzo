import { create } from "zustand";
import { Coordinates,RouteInfo } from "@/types/routes";


type RouteState = {
  origin?: Coordinates;
  destination?: Coordinates;
  route?: RouteInfo;

  setOrigin: (c: Coordinates) => void;
  setDestination: (c: Coordinates) => void;
  setRoute: (r: RouteInfo) => void;
  clearRoute: () => void;
};

export const useRouteStore = create<RouteState>((set) => ({
  origin: undefined,
  destination: undefined,
  route: undefined,

  setOrigin: (c) => set({ origin: c }),
  setDestination: (c) => set({ destination: c }),
  setRoute: (r) => set({ route: r }),
  clearRoute: () =>
    set({ origin: undefined, destination: undefined, route: undefined }),
}));