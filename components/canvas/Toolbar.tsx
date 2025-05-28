"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { PanelTop, PanelLeft, Box, ZoomIn, ZoomOut } from "lucide-react";
import { useDesignStore } from "../../lib/store";

export function Toolbar() {
  const { currentView, setCurrentView, zoom } = useDesignStore();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
      {/* View Controls */}
      <ToggleGroup
        type="single"
        value={currentView}
        onValueChange={(value) => {
          if (value) setCurrentView(value as "front" | "back" | "sleeve");
        }}
        variant="outline"
      >
        <ToggleGroupItem value="front" aria-label="Front view">
          <PanelTop className="h-4 w-4" /> {/* Front view icon */}
        </ToggleGroupItem>
        <ToggleGroupItem value="back" aria-label="Back view">
          <PanelLeft className="h-4 w-4" /> {/* Back view icon */}
        </ToggleGroupItem>
        <ToggleGroupItem value="sleeve" aria-label="Sleeve view">
          <Box className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Zoom Controls */}
      <div className="bg-background/95 backdrop-blur p-1 rounded-lg shadow-sm flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => zoom("in")}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => zoom("out")}>
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
