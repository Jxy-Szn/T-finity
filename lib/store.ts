"use client"; // Add this if not present
import { create } from "zustand";

type DesignState = {
  // Panel states
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;

  // T-shirt properties
  tShirtColor: string;
  setTShirtColor: (color: string) => void;
  tShirtStyle: "crew" | "vneck" | "polo";
  setTShirtStyle: (style: "crew" | "vneck" | "polo") => void;
  isFrontView: boolean;
  toggleView: () => void;

  // Canvas elements
  draw: any; // SVG.js instance
  setDraw: (draw: any) => void;
  tshirtGroup: any; // T-shirt SVG group
  setTshirtGroup: (group: any) => void;

  // Design elements
  addText: (
    text: string,
    options?: {
      fontSize?: number;
      fontFamily?: string;
      color?: string;
    }
  ) => void;
  addImage: (imageUrl: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedModel: "man" | "woman" | "children";
  setSelectedModel: (model: "man" | "woman" | "children") => void;
};

export const useDesignStore = create<DesignState>((set, get) => ({
  // Panel states
  leftPanelOpen: true,
  rightPanelOpen: true,
  toggleLeftPanel: () =>
    set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () =>
    set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

  // T-shirt properties
  tShirtColor: "#A9A9A9",
  setTShirtColor: (color) => set({ tShirtColor: color }),
  tShirtStyle: "crew",
  setTShirtStyle: (style) => set({ tShirtStyle: style }),
  isFrontView: true,
  toggleView: () => set((state) => ({ isFrontView: !state.isFrontView })),

  // Canvas elements
  draw: null,
  setDraw: (draw) => set({ draw }),
  tshirtGroup: null,
  setTshirtGroup: (group) => set({ tshirtGroup: group }),

  // Design elements
  addText: (text, options = {}) => {
    const { draw } = get();
    if (draw) {
      draw
        .text(text)
        .font({
          family: options.fontFamily || "Arial",
          size: options.fontSize || 24,
          weight: "normal",
        })
        .fill(options.color || "#000000")
        .move(150, 200)
        .draggable();
    }
  },

  addImage: (imageUrl) => {
    const { draw } = get();
    if (draw) {
      draw.image(imageUrl).size(100, 100).move(150, 200).draggable();
    }
  },

  // Model and size selection
  selectedSize: "M",
  setSelectedSize: (size) => set({ selectedSize: size }),
  selectedModel: "man",
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
