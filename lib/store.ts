"use client"; // Add this if not present
import { create } from "zustand";

type DesignState = {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  tShirtColor: string;
  setTShirtColor: (color: string) => void;
};

export const useDesignStore = create<DesignState>((set) => ({
  leftPanelOpen: true,
  rightPanelOpen: true,
  toggleLeftPanel: () =>
    set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () =>
    set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  tShirtColor: "#A9A9A9",
  setTShirtColor: (color: string) => set({ tShirtColor: color }),
}));
