"use client";
import { useEffect, useRef, useState } from "react";
import { useDesignStore } from "@/lib/store";
import Image from "next/image";
import { Canvas as FabricCanvas, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Trash2, Undo, ShoppingCart, Type } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function Canvas() {
  const tShirtColor = useDesignStore((state) => state.tShirtColor);
  const isFrontView = useDesignStore((state) => state.isFrontView);
  const selectedSize = useDesignStore((state) => state.selectedSize);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const setDraw = useDesignStore((state) => state.setDraw);
  const [price, setPrice] = useState(19.99); // Base price for white t-shirt
  const { addItem } = useCart();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [editColor, setEditColor] = useState("#000000");
  const [editFont, setEditFont] = useState("Arial");
  const [editBold, setEditBold] = useState(false);
  const [editUnderline, setEditUnderline] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize Fabric.js canvas
      const canvas = new FabricCanvas(canvasRef.current, {
        width: 400,
        height: 500,
        backgroundColor: "transparent",
      });

      // Enable object selection
      canvas.selection = true;

      // Add event listeners for price updates
      canvas.on("object:added", () => {
        updatePrice();
      });

      canvas.on("object:removed", () => {
        updatePrice();
      });

      canvas.on("object:modified", () => {
        updatePrice();
      });

      fabricCanvasRef.current = canvas;
      setDraw(canvas);

      // Cleanup on unmount
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
        setDraw(null);
      };
    }
  }, [setDraw]);

  // Update price based on canvas state
  const updatePrice = () => {
    let newPrice = 19.99; // Base price for white t-shirt

    // Add cost for non-white colors
    if (tShirtColor !== "#FFFFFF") {
      newPrice += 2.0;
    }

    // Add cost for each object on canvas
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const objectCount = canvas.getObjects().length;
      newPrice += objectCount * 1.5; // $1.50 per design element
    }

    setPrice(newPrice);
  };

  // Handle delete selected objects
  const handleDelete = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
        updatePrice();
      }
    }
  };

  // Handle undo
  const handleUndo = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        canvas.remove(objects[objects.length - 1]);
        canvas.renderAll();
        updatePrice();
      }
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas to combine t-shirt and design
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 400;
    tempCanvas.height = 500;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    // Create a promise to handle the image loading
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.crossOrigin = "anonymous"; // Enable CORS
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    // Load and combine images
    const tShirtSrc = getTShirtImage(tShirtColor, isFrontView);
    loadImage(tShirtSrc)
      .then((tShirtImg) => {
        // Draw t-shirt
        ctx.drawImage(tShirtImg, 0, 0, 400, 500);

        // Get design data URL
        const designDataURL = canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2,
        });

        // Load and draw design
        return loadImage(designDataURL).then((designImg) => {
          ctx.drawImage(designImg, 0, 0, 400, 500);

          // Get the combined image
          const combinedDataURL = tempCanvas.toDataURL({
            format: "png",
            quality: 1,
          });

          // Create a unique ID for the cart item
          const id = `custom-tshirt-${Date.now()}`;

          // Add to cart
          addItem({
            id,
            name: "Custom T-Shirt Design",
            price: price,
            color: tShirtColor,
            variant: `${isFrontView ? "Front" : "Back"} • Size ${selectedSize}`,
            quantity: 1,
            image: combinedDataURL,
          });

          toast.success("Added to cart!");
        });
      })
      .catch((error) => {
        console.error("Error loading images:", error);
        toast.error("Failed to add to cart. Please try again.");
      });
  };

  // Handle text editing
  const handleEdit = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "text") {
        const textObject = activeObject as IText;
        setEditText(textObject.text || "");
        setEditColor(textObject.fill as string);
        setEditFont(textObject.fontFamily || "Arial");
        setEditBold(textObject.fontWeight === "bold");
        setEditUnderline(textObject.underline || false);
        setIsEditDialogOpen(true);
      } else {
        toast.error("Please select a text object to edit");
      }
    }
  };

  // Apply text changes
  const applyTextChanges = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "text") {
        const textObject = activeObject as IText;
        textObject.set({
          text: editText,
          fill: editColor,
          fontFamily: editFont,
          fontWeight: editBold ? "bold" : "normal",
          underline: editUnderline,
        });
        canvas.renderAll();
        setIsEditDialogOpen(false);
      }
    }
  };

  // Map color codes to t-shirt image paths
  const getTShirtImage = (color: string, isFront: boolean) => {
    const colorMap: { [key: string]: string } = {
      "#FFFFFF": isFront
        ? "/img/canvas/white_front.png"
        : "/img/canvas/white_back.png",
      "#000000": isFront
        ? "/img/canvas/black_front.png"
        : "/img/canvas/black_back.png",
      "#FF0000": isFront
        ? "/img/canvas/red_front.png"
        : "/img/canvas/red_back.png",
      "#00FF00": isFront
        ? "/img/canvas/green_front.png"
        : "/img/canvas/green_back.png",
      "#0000FF": isFront
        ? "/img/canvas/blue_front.png"
        : "/img/canvas/blue_back.png",
      "#FFA500": isFront
        ? "/img/canvas/orange_front.png"
        : "/img/canvas/orange_back.png",
      "#800080": isFront
        ? "/img/canvas/purple_front.png"
        : "/img/canvas/purple_back.png",
      "#FFFF00": isFront
        ? "/img/canvas/yellow_front.png"
        : "/img/canvas/yellow_back.png",
      "#A52A2A": isFront
        ? "/img/canvas/brown_front.png"
        : "/img/canvas/brown_black.png",
      "#FFC0CB": isFront
        ? "/img/canvas/salmon_front.png"
        : "/img/canvas/salmon_back.png",
      "#E6E6FA": isFront
        ? "/img/canvas/lilac_front.png"
        : "/img/canvas/lilac_back.png",
      "#32CD32": isFront
        ? "/img/canvas/lime_front.png"
        : "/img/canvas/lime_back.png",
      "#8B4513": isFront
        ? "/img/canvas/light_brown_front.png"
        : "/img/canvas/light_brown_back.png",
      "#4B5320": isFront
        ? "/img/canvas/army_green_front.png"
        : "/img/canvas/army_green_back.png",
      "#722F37": isFront
        ? "/img/canvas/wine_front.png"
        : "/img/canvas/wine_back.png",
      "#000080": isFront
        ? "/img/canvas/deep_blue_front.png"
        : "/img/canvas/deep_blue_back.png",
      "#D2B48C": isFront
        ? "/img/canvas/tan_front.png"
        : "/img/canvas/tan_back.png",
      "#B8B8B8": isFront
        ? "/img/canvas/pebble_front.png"
        : "/img/canvas/pebble_back.png",
    };
    return colorMap[color] || "/img/canvas/white_front.png"; // Default to white front if color not found
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDelete}
          title="Delete selected"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo}
          title="Undo last action"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleEdit}
          title="Edit text"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleAddToCart}
          className="ml-2"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Text</Label>
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter text"
              />
            </div>
            <div className="space-y-2">
              <Label>Font</Label>
              <Select value={editFont} onValueChange={setEditFont}>
                <SelectTrigger>
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
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2">
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
                    variant={editColor === color ? "default" : "outline"}
                    className={cn(
                      "h-8 w-8 p-0 relative",
                      editColor === color && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditColor(color)}
                  >
                    {editColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Style</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-bold"
                    checked={editBold}
                    onCheckedChange={setEditBold}
                  />
                  <Label htmlFor="edit-bold">Bold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-underline"
                    checked={editUnderline}
                    onCheckedChange={setEditUnderline}
                  />
                  <Label htmlFor="edit-underline">Underline</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={applyTextChanges}>Apply Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Price Display */}
      <div className="absolute top-4 right-4 bg-background/95 backdrop-blur p-2 rounded-lg shadow-sm">
        <p className="text-lg font-semibold">${price.toFixed(2)}</p>
      </div>

      <div className="relative w-[400px] h-[500px]">
        <Image
          src={getTShirtImage(tShirtColor, isFrontView)}
          alt={`${isFrontView ? "Front" : "Back"} view of t-shirt`}
          fill
          className="object-contain"
          priority
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
}
