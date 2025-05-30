"use client";
import Canvas from "@/components/canvas/Canvas";
import { LeftPanel } from "@/components/canvas/LeftPanel";
import { CartSidebar } from "@/components/cart-sidebar";

export default function DesignPage() {
  return (
    <div className="flex h-screen bg-background">
      <LeftPanel />
      <main className="flex-1 relative">
        <Canvas />
      </main>
      <CartSidebar />
    </div>
  );
}
