"use client";
import { useEffect, useRef } from "react";
import { useDesignStore } from "@/lib/store";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tShirtColor = useDesignStore((state) => state.tShirtColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a simple t-shirt shape (replace with your SVG path if needed)
    ctx.save();
    ctx.translate(200, 100); // Position the t-shirt
    ctx.beginPath();
    // Body
    ctx.moveTo(0, 0);
    ctx.lineTo(-60, -80); // left shoulder
    ctx.lineTo(-100, -120); // left sleeve out
    ctx.lineTo(-80, -140); // left sleeve tip
    ctx.lineTo(-30, -100); // left sleeve in
    ctx.lineTo(-30, -200); // left bottom
    ctx.lineTo(30, -200); // right bottom
    ctx.lineTo(30, -100); // right sleeve in
    ctx.lineTo(80, -140); // right sleeve tip
    ctx.lineTo(100, -120); // right sleeve out
    ctx.lineTo(60, -80); // right shoulder
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = tShirtColor;
    ctx.fill();
    ctx.restore();
  }, [tShirtColor]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border rounded-lg"
    />
  );
}
