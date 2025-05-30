// app/(canvas)/layout.tsx
import React from "react";
import "../globals.css";
import { Metadata } from "next";
import CanvasNavBar from "@/components/canvas/canvas-nav-bar";
import { CartProvider } from "@/providers/cart-provider";

export const metadata: Metadata = {
  title: "Design Studios",
  description: "Design Studios",
};

interface CanvasLayoutProps {
  children: React.ReactNode;
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
  return (
    <>
      <CartProvider>
        <CanvasNavBar />
        {children}
      </CartProvider>
    </>
  );
}
