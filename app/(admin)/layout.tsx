// app/(admin)/layout.tsx
import React from "react";
import "../globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AdminSidebar />
        <main className="w-full">
          <AdminNavbar />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
