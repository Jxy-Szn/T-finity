"use client";
import { LeftPanel } from "@/components/canvas/LeftPanel";
import { RightPanel } from "@/components/canvas/RightPanel";

export default function DesignPage() {
  return (
    <div className="flex h-screen bg-background">
      <LeftPanel />
      <main className="flex-1 relative">{/* <Canvas /> */}</main>
      <RightPanel />
    </div>
  );
}
