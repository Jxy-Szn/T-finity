"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shirt,
  Text,
  Layers,
  Users,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    title: "T-shirt",
    icon: <Shirt className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p className="font-semibold">T-shirt Options</p>
        <Button variant="outline" className="w-full">
          Change Color
        </Button>
        <Button variant="outline" className="w-full">
          Upload Design
        </Button>
      </div>
    ),
  },
  {
    title: "Text",
    icon: <Text className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <Input placeholder="Enter text" />
        <Button className="w-full">Add to Design</Button>
      </div>
    ),
  },
  {
    title: "Shirt Type",
    icon: <Layers className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p className="font-semibold">Select Shirt Type</p>
        <Button variant="outline" className="w-full">
          Short Sleeve
        </Button>
        <Button variant="outline" className="w-full">
          Long Sleeve
        </Button>
        <Button variant="outline" className="w-full">
          Hoodie
        </Button>
        <Button variant="outline" className="w-full">
          Tank Top
        </Button>
      </div>
    ),
  },
  {
    title: "Model",
    icon: <Users className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p className="font-semibold">Select Model</p>
        <Button variant="outline" className="w-full">
          Man
        </Button>
        <Button variant="outline" className="w-full">
          Woman
        </Button>
        <Button variant="outline" className="w-full">
          Children
        </Button>
      </div>
    ),
  },
  {
    title: "Model Size",
    icon: <Ruler className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p className="font-semibold">Select Size</p>
        <div className="flex flex-wrap gap-2">
          {["XXL", "XL", "L", "M", "S"].map((size) => (
            <Button key={size} variant="outline" className="w-16">
              {size}
            </Button>
          ))}
        </div>
      </div>
    ),
  },
];

export function RightPanel() {
  const [activeTab, setActiveTab] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-full flex flex-col border-l bg-card transition-all duration-200 ${collapsed ? "w-20" : "w-72"}`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold">Options</h2>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-y-auto">
        {/* Content area */}
        <div
          className={`flex-1 p-6 transition-all duration-200 ${collapsed ? "hidden" : "block"}`}
        >
          {sections[activeTab].content}
        </div>
        {/* Vertical Tabs on the right with fixed border */}
        <nav
          className={`flex flex-col border-l bg-muted/30 transition-all duration-200 ${collapsed ? "w-20" : "w-32"}`}
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
              {/* Right underline for active */}
              <span
                className={`absolute right-0 top-2 bottom-2 w-1 rounded bg-primary transition-all duration-200 ${
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
      </div>
    </aside>
  );
}
