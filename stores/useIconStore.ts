
import { create } from "zustand";
import { createIcons, Icons } from "@/lib/marker/markerMaker";

type IconState = {
  icons: Icons | null;
  loadIcons: () => Promise<void>;
};

export const useIconStore = create<IconState>((set, get) => ({
  icons: null,

  loadIcons: async () => {
    if (get().icons) return; 

    const icons = await createIcons();
    set({ icons });
  },
}));