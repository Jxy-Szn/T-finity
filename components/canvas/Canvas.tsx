"use client";
import { useEffect, useRef } from "react";
import { useDesignStore } from "@/lib/store";
import Image from "next/image";

export default function Canvas() {
  const tShirtColor = useDesignStore((state) => state.tShirtColor);
  const isFrontView = useDesignStore((state) => state.isFrontView);

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
      <div className="relative w-[400px] h-[500px]">
        <Image
          src={getTShirtImage(tShirtColor, isFrontView)}
          alt={`${isFrontView ? "Front" : "Back"} view of t-shirt`}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
