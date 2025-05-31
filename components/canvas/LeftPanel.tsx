"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Text,
  Palette,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Ruler,
  Shirt,
} from "lucide-react";
import { useState, useRef } from "react";
import { useDesignStore } from "@/lib/store";
import {
  Canvas as FabricCanvas,
  Image as FabricImage,
  Text as FabricText,
} from "fabric";

const sections = [
  {
    title: "Upload Image",
    icon: <Upload className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const input = document.getElementById("upload") as HTMLInputElement;
            input?.click();
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        <Input
          type="file"
          className="hidden"
          id="upload"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const imgUrl = event.target?.result as string;
                const img = new Image();
                img.src = imgUrl;
                img.onload = () => {
                  const canvas = useDesignStore.getState().draw;
                  if (canvas) {
                    const fabricImage = new FabricImage(img, {
                      left: 100,
                      top: 100,
                      scaleX: 0.5,
                      scaleY: 0.5,
                    });
                    canvas.add(fabricImage);
                    canvas.renderAll();
                  }
                };
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
    ),
  },
  {
    title: "Add Text",
    icon: <Text className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <Input
          placeholder="Enter text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const input = e.target as HTMLInputElement;
              const text = input.value;
              if (text) {
                const canvas = useDesignStore.getState().draw;
                if (canvas) {
                  const fabricText = new FabricText(text, {
                    left: 100,
                    top: 100,
                    fontSize: 20,
                    fill: "#000000",
                  });
                  canvas.add(fabricText);
                  canvas.renderAll();
                  input.value = "";
                }
              }
            }
          }}
        />
        <Button
          className="w-full"
          onClick={() => {
            const input = document.querySelector(
              'input[placeholder="Enter text"]'
            ) as HTMLInputElement;
            const text = input.value;
            if (text) {
              const canvas = useDesignStore.getState().draw;
              if (canvas) {
                const fabricText = new FabricText(text, {
                  left: 100,
                  top: 100,
                  fontSize: 20,
                  fill: "#000000",
                });
                canvas.add(fabricText);
                canvas.renderAll();
                input.value = "";
              }
            }
          }}
        >
          Add to Design
        </Button>
      </div>
    ),
  },
  {
    title: "Size",
    icon: <Ruler className="h-5 w-5" />,
    content: (
      <div className="space-y-2">{/* Size content will be added later */}</div>
    ),
  },
  {
    title: "Product Type",
    icon: <Shirt className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        {/* Product type content will be added later */}
      </div>
    ),
  },
  {
    title: "Product Colors",
    icon: <Palette className="h-5 w-5" />,
    content: null, // Will be set below
  },
];

const tShirtColors = [
  { name: "White", color: "#FFFFFF" },
  { name: "Black", color: "#000000" },
  { name: "Red", color: "#FF0000" },
  { name: "Green", color: "#00FF00" },
  { name: "Blue", color: "#0000FF" },
  { name: "Orange", color: "#FFA500" },
  { name: "Purple", color: "#800080" },
  { name: "Yellow", color: "#FFFF00" },
  { name: "Brown", color: "#A52A2A" },
  { name: "Salmon", color: "#FFC0CB" },
  { name: "Lilac", color: "#E6E6FA" },
  { name: "Lime", color: "#32CD32" },
  { name: "Light Brown", color: "#8B4513" },
  { name: "Army Green", color: "#4B5320" },
  { name: "Wine", color: "#722F37" },
  { name: "Deep Blue", color: "#000080" },
  { name: "Tan", color: "#D2B48C" },
  { name: "Pebble", color: "#B8B8B8" },
];

export function LeftPanel() {
  const [activeTab, setActiveTab] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const setTShirtColor = useDesignStore((state) => state.setTShirtColor);
  const toggleView = useDesignStore((state) => state.toggleView);
  const isFrontView = useDesignStore((state) => state.isFrontView);

  // Set Product Colors content dynamically
  sections[4].content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">T-shirt Colors</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleView}
          className="h-8 w-8"
          title={isFrontView ? "Show back view" : "Show front view"}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {tShirtColors.map(({ name, color }) => (
          <Button
            key={color}
            style={{ backgroundColor: color }}
            className="h-8 w-8 rounded-full p-0 hover:ring-2"
            onClick={() => setTShirtColor(color)}
            title={name}
          />
        ))}
      </div>
    </div>
  );

  return (
    <aside
      className={`h-full flex flex-col border-r bg-card transition-all duration-200 ${collapsed ? "w-20" : "w-72"}`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold">Design Tools</h2>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-y-auto">
        {/* Vertical Tabs */}
        <nav
          className={`flex flex-col ${collapsed ? "w-20" : "w-32"} border-r bg-muted/30 transition-all duration-200`}
        >
          {sections.map((section, idx) => (
            <button
              key={section.title}
              className={`flex flex-col items-center gap-1 py-4 px-2 focus:outline-none transition-colors relative ${
                activeTab === idx
                  ? "text-primary bg-background font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              style={{ minWidth: collapsed ? 0 : 100 }}
              onClick={() => setActiveTab(idx)}
            >
              {/* Left underline for active */}
              <span
                className={`absolute left-0 top-2 bottom-2 w-1 rounded bg-primary transition-all duration-200 ${
                  activeTab === idx ? "opacity-100" : "opacity-0"
                }`}
              />
              {section.icon}
              {!collapsed && (
                <span className="text-xs font-medium mt-1 whitespace-nowrap">
                  {section.title}
                </span>
              )}
            </button>
          ))}
        </nav>
        {/* Tab Content */}
        <div
          className={`transition-all duration-200 ${collapsed ? "w-0 p-0" : "w-[320px] p-6"}`}
        >
          {!collapsed && sections[activeTab].content}
        </div>
      </div>
    </aside>
  );
}
