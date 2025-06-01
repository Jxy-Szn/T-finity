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
  Bold,
  Underline,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDesignStore } from "@/lib/store";
import {
  Canvas as FabricCanvas,
  Image as FabricImage,
  Text as FabricText,
  IText,
  TEvent,
} from "fabric";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  const setSelectedSize = useDesignStore((state) => state.setSelectedSize);
  const selectedSize = useDesignStore((state) => state.selectedSize);

  // Text formatting state
  const [textColor, setTextColor] = useState("#000000");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

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
              const input = document.getElementById(
                "upload"
              ) as HTMLInputElement;
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
        <div className="space-y-4 px-2">
          <div className="space-y-4">
            <Input
              placeholder="Enter text"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement;
                  const text = input.value;
                  if (text) {
                    addTextToCanvas(text);
                    input.value = "";
                  }
                }
              }}
            />

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-center block">Font</Label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">
                      Times New Roman
                    </SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-center block">Color</Label>
                <div className="grid grid-cols-4 gap-2 justify-items-center">
                  {[
                    "#000000",
                    "#FF0000",
                    "#0000FF",
                    "#008000",
                    "#800080",
                    "#FFA500",
                    "#A52A2A",
                    "#808080",
                  ].map((color) => (
                    <Button
                      key={color}
                      variant={textColor === color ? "default" : "outline"}
                      className="h-8 w-8 p-0"
                      style={{ backgroundColor: color }}
                      onClick={() => setTextColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-center block">Style</Label>
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bold"
                      checked={isBold}
                      onCheckedChange={setIsBold}
                    />
                    <Label htmlFor="bold" className="flex items-center gap-2">
                      <Bold className="h-4 w-4" />
                      Bold
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="underline"
                      checked={isUnderline}
                      onCheckedChange={setIsUnderline}
                    />
                    <Label
                      htmlFor="underline"
                      className="flex items-center gap-2"
                    >
                      <Underline className="h-4 w-4" />
                      Underline
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder="Enter text"]'
                ) as HTMLInputElement;
                const text = input.value;
                if (text) {
                  addTextToCanvas(text);
                  input.value = "";
                }
              }}
            >
              Add to Design
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Size",
      icon: <Ruler className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Product Colors",
      icon: <Palette className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-center">T-shirt Colors</h3>
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
      ),
    },
  ];

  useEffect(() => {
    const canvas = useDesignStore.getState().draw;
    if (canvas) {
      // Enable double-click editing for text objects
      canvas.on("mouse:dblclick", (event: TEvent) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "text") {
          const textObject = activeObject as IText;
          textObject.set("editable", true);
          textObject.set("selectable", true);
          canvas.renderAll();
        }
      });

      // Update text properties when editing is finished
      canvas.on("text:changed", (event: TEvent) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "text") {
          const textObject = activeObject as IText;
          // Update text properties based on current state
          textObject.set({
            fill: textColor,
            fontFamily: selectedFont,
            fontWeight: isBold ? "bold" : "normal",
            underline: isUnderline,
          });
          canvas.renderAll();
        }
      });

      // Handle text editing completion
      canvas.on("mouse:down", (event: TEvent) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "text") {
          const textObject = activeObject as IText;
          if (
            textObject.editable &&
            event.e &&
            event.e.target !== canvas.getElement()
          ) {
            textObject.set("editable", false);
            canvas.renderAll();
          }
        }
      });

      // Handle keyboard events for text editing
      canvas.on("key:down", (event: TEvent) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "text") {
          const textObject = activeObject as IText;
          if (event.e && event.e.key === "Enter" && !event.e.shiftKey) {
            textObject.set("editable", false);
            canvas.renderAll();
          }
        }
      });
    }
  }, [textColor, selectedFont, isBold, isUnderline]);

  // Add text to canvas function
  const addTextToCanvas = (text: string) => {
    const canvas = useDesignStore.getState().draw;
    if (canvas) {
      const textOptions = {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: textColor,
        fontFamily: selectedFont,
        fontWeight: isBold ? "bold" : "normal",
        underline: isUnderline,
        editable: true,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      };

      const fabricText = new FabricText(text, textOptions);
      canvas.add(fabricText);
      canvas.setActiveObject(fabricText);
      canvas.renderAll();
    }
  };

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
          className={`transition-all duration-200 ${collapsed ? "w-0 p-0" : "w-[320px] p-4"}`}
        >
          {!collapsed && sections[activeTab].content}
        </div>
      </div>
    </aside>
  );
}
